'use client';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function notFound() {

  const router = useRouter();
  const goHome = () => {
    router.push('/');
  }
  return (
    <div>
      ☹️ The page you are looking for does not exist.
      <button onClick={goHome}>go home 🏠</button>
    </div>
  )
}
