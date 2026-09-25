import AppShell from '@/components/AppShell'
import { AccountPage } from '@/components/pages/AccountPage'

export const metadata = { title: 'Private membership | GraceGrip', robots: { index: false, follow: false } }

export default function AccountRoute() { return <AppShell><AccountPage /></AppShell> }
