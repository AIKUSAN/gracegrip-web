import AppShell from '@/components/AppShell'
import { PuzzlePage } from '@/components/pages/PuzzlePage'

export const metadata = { title: 'A quiet puzzle | GraceGrip', robots: { index: false, follow: true } }

export default function Page() { return <AppShell allowBeforeOnboarding><PuzzlePage /></AppShell> }
