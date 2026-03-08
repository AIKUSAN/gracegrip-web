import Image from 'next/image'

export function DynamicLogo({ size = 40, className = '', alt = 'GraceGrip logo' }) {
  return (
    <Image
      src="/logo.svg"
      alt={alt}
      width={size}
      height={size}
      className={`dynamic-logo ${className}`.trim()}
      priority={size >= 40}
      draggable={false}
    />
  )
}
