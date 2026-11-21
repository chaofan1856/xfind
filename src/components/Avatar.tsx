interface AvatarProps {
  name: string
  hue: number
  size?: number
}

export function Avatar({ name, hue, size = 44 }: AvatarProps) {
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        background: `hsl(${hue} 42% 86%)`,
        color: `hsl(${hue} 42% 22%)`,
        borderColor: `hsl(${hue} 28% 42% / 0.35)`,
        fontSize: Math.round(size * 0.42),
      }}
      aria-hidden="true"
    >
      {name.slice(0, 1)}
    </span>
  )
}
