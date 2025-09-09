'use client' 

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function HeroTransition() {
  const [isMounted, setIsMounted] = useState(false)
  const [showBg, setShowBg] = useState(true)
  const [showImg1, setShowImg1] = useState(true)
  const [showImg2, setShowImg2] = useState(false)
  const [revealContent, setRevealContent] = useState(false)

  // Only run time-based animations after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return // avoid running on server

    const bgTimeout = setTimeout(() => setShowBg(false), 2000)
    const img1Timeout = setTimeout(() => setShowImg1(false), 2000)
    const img2Timeout = setTimeout(() => setShowImg2(true), 2000)
    const img2FadeTimeout = setTimeout(() => {
      setShowImg2(false)
      setRevealContent(true)
    }, 3000)

    return () => {
      clearTimeout(bgTimeout)
      clearTimeout(img1Timeout)
      clearTimeout(img2Timeout)
      clearTimeout(img2FadeTimeout)
    }
  }, [isMounted])

  // Server-friendly static placeholder
  if (!isMounted) {
    return (
      <div className="fixed top-0 left-0 w-full h-full z-[9998] bg-gradient-to-r from-[#0a72bd] via-[#38bdf8] to-[#bae6fd]" />
    )
  }

  return (
    <>
      <AnimatePresence>
        {showBg && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full z-[9998] bg-gradient-to-r from-[#0a72bd] via-[#38bdf8] to-[#bae6fd]"
            exit={{ x: '100%', filter: 'blur(32px)' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showImg1 && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full z-[9999] flex items-center justify-center pointer-events-none"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.01 }}
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

      <AnimatePresence>
        {showImg2 && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full z-[9999] flex items-center justify-center pointer-events-none"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/Blue.png"
              alt="Neon Logo"
              width={384}
              height={384}
              className="drop-shadow-xl w-96 h-96 object-contain"
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {revealContent && (
          <motion.div
            className="fixed inset-0 z-[1] pointer-events-none"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
