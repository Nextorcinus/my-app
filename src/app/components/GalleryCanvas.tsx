'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import SplitText from '@/lib/gsap/splitText'
import collection from '@/app/components/collection.js'

const GalleryCanvas = () => {
  const galleryRef = useRef<HTMLDivElement>(null)
  const galleryContainerRef = useRef<HTMLDivElement>(null)
  const titleContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(SplitText)

    const gallery = galleryRef.current
    const galleryContainer = galleryContainerRef.current
    const titleContainer = titleContainerRef.current

    if (!gallery || !galleryContainer || !titleContainer) return

    const cards: HTMLDivElement[] = []
    const transformState: any[] = []

    const config = {
      imageCount: 6,
      radius: 275,
      sensivity: 500,
      effectFalloff: 250,
      cardMoveAmount: 50,
      lerpFactor: 0.15,
      isMobile: window.innerWidth < 1000,
    }

    const parallaxState = {
      targetX: 0,
      targetY: 0,
      targetZ: 0,
      currentX: 0,
      currentY: 0,
      currentZ: 0,
    }

    let currentTitle: HTMLParagraphElement | null = null
    let isPreviewActive = false
    let isTransitioning = false

    for (let i = 0; i < config.imageCount; i++) {
      const angle = (i / config.imageCount) * Math.PI * 2
      const x = Math.cos(angle) * config.radius
      const y = Math.sin(angle) * config.radius
      const cardIndex = i % collection.length

      const card = document.createElement('div')
      card.className = 'card'
      card.dataset.index = i.toString()
      card.dataset.title = collection[cardIndex].title

      const img = document.createElement('img')
      img.src = collection[cardIndex].image
      card.appendChild(img)

      gsap.set(card, {
        x,
        y,
        z: 0,
        rotationY: (angle * 180) / Math.PI + 90,
        transformPerspective: 800,
        transformOrigin: 'center center',
      })

      gallery.appendChild(card)
      cards.push(card)
      transformState.push({
        currentRotation: 0,
        targetRotation: 0,
        currentX: 0,
        targetX: 0,
        currentY: 0,
        targetY: 0,
        currentScale: 1,
        targetScale: 1,
        angle,
      })

      card.addEventListener('click', (e) => {
        if (!isPreviewActive && !isTransitioning) {
          togglePreview(parseInt(card.dataset.index!))
          e.stopPropagation()
        }
      })
    }

    function togglePreview(index: number) {
      isPreviewActive = true
      isTransitioning = true

      const angle = transformState[index].angle
      const targetPosition = (Math.PI * 3) / 2
      let rotationRadians = targetPosition - angle

      if (rotationRadians > Math.PI) rotationRadians -= Math.PI * 2
      else if (rotationRadians < -Math.PI) rotationRadians += Math.PI * 2

      transformState.forEach((state) => {
        state.currentRotation = state.targetRotation = 0
        state.currentScale = state.targetScale = 1
        state.currentX = state.targetX = state.currentY = state.targetY = 0
      })

      gsap.to(gallery, {
        onStart: () => {
          cards.forEach((card, i) => {
            gsap.to(card, {
              x: config.radius * Math.cos(transformState[i].angle),
              y: config.radius * Math.sin(transformState[i].angle),
              rotationY: 0,
              scale: 1,
              duration: 1.25,
              ease: 'power4.out',
            })
          })
        },
        scale: 0.5,
        y: 1300,
        rotation: (rotationRadians * 180) / Math.PI + 360,
        duration: 2,
        ease: 'power4.inOut',
        onComplete: () => (isTransitioning = false),
      })

      gsap.to(parallaxState, {
        currentX: 0,
        currentY: 0,
        currentZ: 0,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          gsap.set(galleryContainer, {
            rotateX: parallaxState.currentX,
            rotateY: parallaxState.currentY,
            rotateZ: parallaxState.currentZ,
            transformOrigin: 'center center',
          })
        },
      })

      const titleText = cards[index].dataset.title
      const p = document.createElement('p')
      p.textContent = titleText!
      titleContainer.appendChild(p)
      currentTitle = p

      const splitText = new SplitText(p, { type: 'words', wordClass: 'word' })
      const words = splitText.words
      gsap.set(words, { y: '125%' })
      gsap.to(words, {
        y: '0%',
        duration: 0.75,
        delay: 1.25,
        stagger: 0.1,
        ease: 'power4.out',
      })
    }

    function animate() {
      if (!isPreviewActive && !isTransitioning) {
        parallaxState.currentX += (parallaxState.targetX - parallaxState.currentX) * config.lerpFactor
        parallaxState.currentY += (parallaxState.targetY - parallaxState.currentY) * config.lerpFactor
        parallaxState.currentZ += (parallaxState.targetZ - parallaxState.currentZ) * config.lerpFactor

        gsap.set(galleryContainer, {
          rotateX: parallaxState.currentX,
          rotateY: parallaxState.currentY,
          rotateZ: parallaxState.currentZ,
        })

        cards.forEach((cardElem, index) => {
          const state = transformState[index]

          state.currentRotation += (state.targetRotation - state.currentRotation) * config.lerpFactor
          state.currentScale += (state.targetScale - state.currentScale) * config.lerpFactor
          state.currentY += (state.targetY - state.currentY) * config.lerpFactor
          state.currentX += (state.targetX - state.currentX) * config.lerpFactor

          const angle = state.angle
          const x = config.radius * Math.cos(angle) + state.currentX
          const y = config.radius * Math.sin(angle) + state.currentY

          gsap.set(cardElem, {
            x,
            y,
            rotationY: state.currentRotation,
            scale: state.currentScale,
            rotation: (angle * 180) / Math.PI + 90,
            transformPerspective: 1000,
          })
        })
      }

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <div className="gallery-container" ref={galleryContainerRef}>
      <div className="gallery" ref={galleryRef} />
      <div className="title-container" ref={titleContainerRef} />
    </div>
  )
}

export default GalleryCanvas
