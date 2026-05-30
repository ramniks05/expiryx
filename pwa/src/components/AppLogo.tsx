const LOGO_SRC = `${import.meta.env.BASE_URL}logo.png`

interface Props {
  size?: number
  className?: string
  alt?: string
}

export function AppLogo({ size = 64, className = '', alt = 'ExpiryX' }: Props) {
  return (
    <img
      src={LOGO_SRC}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-2xl object-cover shadow-[var(--shadow-card-lg)] ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
