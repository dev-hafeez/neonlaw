'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'

type Phase = 'idle' | 'bg' | 'blue' | 'white'

/**
 * ExitTransition
 * - Plays exit animations on internal navigations.
 * - Should live in a persistent layout.
 */
export default function ExitTransition() {
  const router = useRouter()
  const pathname = usePathname()

  const [phase, setPhase] = useState<Phase>('idle')
  const isAnimating = useRef(false)
  const timers = useRef<number[]>([])
  const prevPath = useRef(pathname)

  const DURATION = {
    bgIn: 0.25,        // background sweep in (s)
    blueDelay: 0.08,   // delay before blue logo (s)
    swapDelay: 0.22,   // when to swap blue -> white (s)
    total: 0.52,       // total before navigation (s)
  }

  // Clear all timeouts
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])

  // Reset state after navigation
  const reset = useCallback(() => {
    clearTimers()
    isAnimating.current = false
    setPhase('idle')
    document.documentElement.classList.remove('overflow-hidden')
  }, [clearTimers])

  // Reset when pathname changes
  useEffect(() => {
    if (pathname !== prevPath.current) {
      reset()
      prevPath.current = pathname
    }
  }, [pathname, reset])

  // Cleanup on unmount
  useEffect(() => () => {
    clearTimers()
    document.documentElement.classList.remove('overflow-hidden')
  }, [clearTimers])

  // Schedule a timeout and store the ID
  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
  }

  // Start transition sequence
  const startTransition = useCallback((url: string) => {
    if (isAnimating.current) return
    isAnimating.current = true
    document.documentElement.classList.add('overflow-hidden')

    setPhase('bg')                          // 1) sweep bg
    schedule(() => setPhase('blue'), DURATION.blueDelay * 1000)
    schedule(() => setPhase('white'), DURATION.swapDelay * 1000)
    schedule(() => router.push(url), DURATION.total * 1000)
  }, [router])

  // Intercept internal link clicks
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const anchor = (e.target as HTMLElement)?.closest('a') as HTMLAnchorElement | null
      if (!anchor) return
      if (anchor.hasAttribute('download') || anchor.getAttribute('target') === '_blank' || anchor.dataset.noTransition !== undefined) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#')) return

      try {
        const next = new URL(href, window.location.href)
        if (next.origin !== window.location.origin) return
      } catch {
        return
      }

      if (href === window.location.pathname + window.location.search + window.location.hash) return

      e.preventDefault()
      startTransition(href)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [startTransition])

  // Optional: intercept programmatic router.push
  useEffect(() => {
    const originalPush = router.push
    router.push = ((url: string, ...rest: any[]) => {
      if (!isAnimating.current) startTransition(url)
      else originalPush(url as any, ...rest)
    }) as typeof router.push

    return () => { router.push = originalPush }
  }, [router, startTransition])

  if (phase === 'idle') return null

  return (
    <>
      {/* Gradient Background */}
      <AnimatePresence>
        {phase !== 'idle' && (
          <motion.div
            key="bg"
            className="fixed inset-0 z-[9998] bg-gradient-to-r from-[#0a72bd] via-[#38bdf8] to-[#bae6fd] pointer-events-none"
            initial={{ x: '100%', filter: 'blur(16px)' }}
            animate={{ x: 0, filter: 'blur(0px)' }}
            exit={{ x: '-100%', filter: 'blur(16px)' }}
            transition={{ duration: DURATION.bgIn, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Blue Logo */}
      <AnimatePresence>
        {phase === 'blue' && (
          <motion.div
            key="blue"
            className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
          >
            <Image
              src="/Blue.png"
              alt="Blue Logo"
              width={384}
              height={384}
              className="drop-shadow-xl w-96 h-96 object-contain"
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* White Logo */}
      <AnimatePresence>
        {phase === 'white' && (
          <motion.div
            key="white"
            className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <Image
              src="/White.png"
              alt="White Logo"
              width={384}
              height={384}
              className="drop-shadow-xl w-96 h-96 object-contain"
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
