export function BotanicalEmblem({ kind = 'leaf', className = '' }) {
  const petals = kind === 'flower' ? 5 : kind === 'branch' ? 3 : 2
  return <svg className={className} width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="21" cy="21" r="20" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeOpacity=".4" />
    <path d="M21 32V16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    {Array.from({ length: petals }, (_, index) => {
      const y = 25 - index * 5
      const left = index % 2 === 0
      return <path key={index} d={left ? `M21 ${y}C15 ${y-1} 12 ${y-5} 12 ${y-8}C17 ${y-8} 21 ${y-5} 21 ${y}` : `M21 ${y}C27 ${y-1} 30 ${y-5} 30 ${y-8}C25 ${y-8} 21 ${y-5} 21 ${y}`} fill="currentColor" fillOpacity=".55" stroke="currentColor" strokeWidth="1.2" />
    })}
    <path d="M16 32h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
}
