import AppShell from '@/components/AppShell'
import { EditorialPage } from '@/components/pages/EditorialPage'

export const metadata = { title: 'Private editor | GraceGrip', robots: { index: false, follow: false } }

export default function EditorRoute() { return <AppShell><EditorialPage /></AppShell> }
