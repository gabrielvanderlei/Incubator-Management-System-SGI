"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if(!localStorage.getItem('token')){
      router.push('/auth')
    } else {
      router.push('/workspace')
    }
  }, []);

  return (<div></div>)
}
