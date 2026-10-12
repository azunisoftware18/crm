'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ResetPasswordForm from './ResetPasswordForm'

export default function ResetPasswordPageContent() {
  const searchParams = useSearchParams()
  const [token] = useState(() => searchParams.get('token') || '')

  useEffect(() => {
    if (!token) return
    const url = new URL(window.location.href)
    if (!url.searchParams.has('token')) return
    url.searchParams.delete('token')
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
  }, [token])

  return <ResetPasswordForm token={token} />
}
