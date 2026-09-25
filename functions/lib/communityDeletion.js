export async function eraseCommunityMember(db, accountId) {
  const member = await db.prepare('SELECT id FROM members WHERE account_id = ?').bind(accountId).first()
  if (!member) return false
  await db.batch([
    db.prepare('DELETE FROM member_blocks WHERE blocker_id = ? OR blocked_id = ?').bind(member.id, member.id),
    db.prepare('DELETE FROM alias_requests WHERE member_id = ?').bind(member.id),
    db.prepare('DELETE FROM posts WHERE member_id = ?').bind(member.id),
    db.prepare('DELETE FROM post_rate WHERE member_id = ?').bind(member.id),
    db.prepare('DELETE FROM members WHERE id = ?').bind(member.id),
  ])
  // Incident evidence uses a random community ID and can remain for up to 90 days.
  return true
}
