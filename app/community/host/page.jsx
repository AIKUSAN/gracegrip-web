import AppShell from '@/components/AppShell'
import { CommunityHostPage } from '@/components/pages/CommunityHostPage'

export const metadata = { title: 'Host community | GraceGrip', robots: { index: false, follow: false } }

export default function HostRoute() { return <AppShell><CommunityHostPage /></AppShell> }
