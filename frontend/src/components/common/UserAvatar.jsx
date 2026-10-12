'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/utils/cn'

const FALLBACK_AVATAR = '/user-avatar.svg'
const SIZE_CLASSES = {
  sm: 'h-9 w-9',
  md: 'h-10 w-10',
  lg: 'h-20 w-20',
}
const SIZE_VALUES = { sm: 36, md: 40, lg: 80 }

export default function UserAvatar({ name, src, size = 'md', className }) {
  return <UserAvatarImage key={src || 'default'} name={name} src={src} size={size} className={className} />
}

function UserAvatarImage({ name, src, size, className }) {
  const [failed, setFailed] = useState(false)
  const imageSrc = failed || !src ? FALLBACK_AVATAR : src
  const pixelSize = SIZE_VALUES[size] || SIZE_VALUES.md

  return (
    <span className={cn('relative inline-flex shrink-0 overflow-hidden rounded-full bg-slate-100', SIZE_CLASSES[size] || SIZE_CLASSES.md, className)}>
      <Image
        src={imageSrc}
        alt={`${name || 'User'} profile image`}
        fill
        sizes={`${pixelSize}px`}
        className="object-cover"
        unoptimized
        onError={() => setFailed(true)}
      />
    </span>
  )
}
