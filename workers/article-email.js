import approvedArticles from '../src/content/publishedArticles.js'
import { sendArticleEmail, unsubscribeToken } from '../functions/lib/transactionalEmail.js'

export async function runArticleEmail(env, articles = approvedArticles, sender = sendArticleEmail) {
  if (!env.ACCOUNT_DB || !env.RESEND_API_KEY || !env.EMAIL_UNSUB_SECRET) throw new Error('Article email bindings are missing')
  let sent = 0
  for (const article of articles) {
    if (article.reviewStatus !== 'approved' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) continue
    const subscribers = await env.ACCOUNT_DB.prepare(`SELECT a.id, a.verified_email FROM accounts a LEFT JOIN article_email_sent s ON s.account_id = a.id AND s.slug = ? WHERE a.article_email_opt_in = 1 AND a.verified_email IS NOT NULL AND s.account_id IS NULL ORDER BY a.created_at ASC LIMIT 20`)
      .bind(article.slug).all()
    for (const person of subscribers.results) {
      if (sent >= 20) return sent
      const current = await env.ACCOUNT_DB.prepare('SELECT article_email_opt_in, verified_email FROM accounts WHERE id = ?').bind(person.id).first()
      if (current?.article_email_opt_in !== 1 || current.verified_email !== person.verified_email) continue
      const token = await unsubscribeToken(env, person.id, person.verified_email)
      const title = article.title.replace(/[\r\n]/g, ' ').slice(0, 120)
      await sender(env, {
        to: person.verified_email,
        subject: `New GraceGrip resource: ${title}`,
        text: `A newly reviewed GraceGrip article is available:\n\n${title}\nhttps://gracegrip.app/resources/${article.slug}\n\nGraceGrip is free and this email is optional. To unsubscribe without deleting your account, open:\nhttps://gracegrip.app/unsubscribe#${token}`,
        idempotencyKey: `gracegrip-article-${article.slug}-${person.id}`,
      })
      await env.ACCOUNT_DB.prepare('INSERT OR IGNORE INTO article_email_sent (account_id, slug, sent_at) VALUES (?, ?, ?)')
        .bind(person.id, article.slug, new Date().toISOString()).run()
      sent++
    }
  }
  return sent
}

export default { scheduled(_event, env, ctx) { ctx.waitUntil(runArticleEmail(env)) } }
