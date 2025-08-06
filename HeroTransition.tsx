'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function HeroTransition() {
  const [showBg, setShowBg] = useState(true)
  const [showImg1, setShowImg1] = useState(true)
  const [showImg2, setShowImg2] = useState(false)

  useEffect(() => {
    // Background slides out after 2s
    const bgTimeout = setTimeout(() => setShowBg(false), 2000)
    // Image 1 fades out and image 2 fades in at 2s
    const img1Timeout = setTimeout(() => setShowImg1(false), 2000)
    const img2Timeout = setTimeout(() => setShowImg2(true), 2000)
    // Image 2 fades out after 1s
    const img2FadeTimeout = setTimeout(() => setShowImg2(false), 3000)
    return () => {
      clearTimeout(bgTimeout)
      clearTimeout(img1Timeout)
      clearTimeout(img2Timeout)
      clearTimeout(img2FadeTimeout)
    }
  }, [])

  return (
    <>
      <AnimatePresence>
        {showBg && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full z-[9998] bg-gradient-to-r from-[#0a72bd] via-[#38bdf8] to-[#bae6fd]"
            initial={{ x: 0, filter: 'blur(0px)' }}
            animate={{ x: 0, filter: 'blur(0px)' }}
            exit={{ x: '100%', filter: 'blur(32px)' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>
      {/* Image 1: White logo */}
      <AnimatePresence>
        {showImg1 && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full z-[9999] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.01 }} // Instantly vanish
          >
            <div className="">
              <Image
                src="/White.png"
                alt="White Logo"
                width={384}
                height={384}
                className="drop-shadow-xl"
                priority
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Image 2: Neon logo */}
      <AnimatePresence>
        {showImg2 && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full z-[9999] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} // Instantly appear and vanish
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
    </>
  )
}
