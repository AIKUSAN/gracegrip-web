import AppShell from '@/components/AppShell'
import { HelperPage } from '@/components/pages/HelperPage'

export const metadata = { title: 'Private reflection helper | GraceGrip', robots: { index: false, follow: false } }

export default function HelperRoute() { return <AppShell><HelperPage /></AppShell> }
