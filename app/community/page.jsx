import AppShell from '@/components/AppShell'
import { CommunityPage } from '@/components/pages/CommunityPage'

export const metadata = { title: 'Community sessions | GraceGrip', robots: { index: false, follow: false } }

export default function CommunityRoute() { return <AppShell><CommunityPage /></AppShell> }
