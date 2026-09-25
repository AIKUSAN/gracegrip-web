import AppShell from '@/components/AppShell'
import { UnsubscribePage } from '@/components/pages/UnsubscribePage'

export const metadata = { title: 'Article email preference | GraceGrip', robots: { index: false, follow: false } }

export default function UnsubscribeRoute() { return <AppShell><UnsubscribePage /></AppShell> }
