import AppShell from '@/components/AppShell'
import { ProgressPage } from '@/components/pages/ProgressPage'

export const metadata = { title: 'Private progress | GraceGrip', robots: { index: false, follow: true } }

export default function Page() { return <AppShell allowBeforeOnboarding><ProgressPage /></AppShell> }
