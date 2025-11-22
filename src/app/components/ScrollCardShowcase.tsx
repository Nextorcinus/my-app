'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroesJson from '../data/heroes.json'

gsap.registerPlugin(ScrollTrigger)

export interface CardData {
  name: string
  rarity: string
  class: string
  attack?: number
  def?: number
  health?: number
  expAttack?: string
  expDef?: string
  image: string
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const cards: CardData[] = heroesJson.heroes
  .filter((hero) => hero.generation <= 11)
  .map((hero) => ({
    name: hero['hero-name'].toUpperCase(),
    rarity: hero.rarity,
    class: capitalize(hero['hero-class']),
    attack: hero.stats?.exploration?.attack,
    def: hero.stats?.exploration?.defense,
    health: hero.stats?.exploration?.health,
    expAttack: hero.stats?.expedition?.attack,
    expDef: hero.stats?.expedition?.defense,
    image: `/${hero['hero-name'].toLowerCase().replace(/\s+/g, '-')}.png`,
  }))

export default function ScrollCardShowcase() {
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const cardWidth = 256
  const gap = 8
  const fullCard = cardWidth + gap

  const centerOffset = (index: number) =>
    fullCard * index - (window.innerWidth - cardWidth) / 2

  const goToCard = (index: number) => {
    const clamped = Math.max(0, Math.min(cards.length - 1, index))
    setActiveIndex(clamped)

    if (trackRef.current) {
      gsap.to(trackRef.current, {
        x: -centerOffset(clamped),
        duration: 0.5,
        ease: 'power3.out',
      })
    }

    if (infoRef.current) {
      gsap.fromTo(
        infoRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
    }
  }

  useEffect(() => {
    if (!trackRef.current || !containerRef.current) return

    const totalScroll = fullCard * cards.length

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: () => `+=${totalScroll}`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        if (isDraggingRef.current) return

        const progress = self.progress
        const idx = Math.round(progress * (cards.length - 1))
        setActiveIndex(idx)

        const offset = centerOffset(progress * (cards.length - 1))
        gsap.to(trackRef.current, {
          x: -offset,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      },
    })
  }, [])

  // Drag logic
  const isDraggingRef = useRef(false)
  const dragData = useRef({
    startX: 0,
    lastX: 0,
    currentX: 0,
  })

  const getClosestToCenter = () => {
  const currentX = gsap.getProperty(trackRef.current, 'x') as number
  const viewportCenter = window.innerWidth / 2

  let closest = 0
  let closestDist = Infinity

  for (let i = 0; i < cards.length; i++) {
    // posisi center kartu secara visual, sudah termasuk transform X
    const cardCenter = fullCard * i + currentX + cardWidth / 2

    const dist = Math.abs(cardCenter - viewportCenter)
    if (dist < closestDist) {
      closestDist = dist
      closest = i
    }
  }

  return closest
}


  function handlePointerDown(e: React.PointerEvent) {
    isDraggingRef.current = true
    dragData.current.startX = e.clientX
    dragData.current.lastX = e.clientX
    dragData.current.currentX = gsap.getProperty(trackRef.current, 'x') as number
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDraggingRef.current) return

    const delta = e.clientX - dragData.current.lastX
    dragData.current.lastX = e.clientX

    dragData.current.currentX += delta

    gsap.set(trackRef.current, { x: dragData.current.currentX })
  }

  function handlePointerUp() {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false

    const closest = getClosestToCenter()
    goToCard(closest)
  }

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh] bg-zinc-900 text-white overflow-hidden"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center px-6">
        {/* Info */}
        <div ref={infoRef} className="text-center mb-8">
          <h1 className="font-russo text-4xl mb-2">{cards[activeIndex].name}</h1>
          <p className="text-zinc-400 text-sm">
            {cards[activeIndex].class} | {cards[activeIndex].rarity}
          </p>
        </div>

        {/* Track */}
        <div className="relative w-full max-w-[100vw] overflow-hidden select-none touch-none">
          <div
            ref={trackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="flex gap-2 p-8 will-change-transform"
            style={{
              width: `${fullCard * cards.length}px`,
            }}
          >
            {cards.map((card, i) => (
              <div
                key={card.name}
                className={`w-[258px] shrink-0 transition-transform duration-500 ${
                  i === activeIndex ? 'scale-105' : 'scale-90 opacity-40'
                }`}
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="h-260px] object-contain mb-4"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigasi */}
        <div className="mt-6 flex gap-6">
          <button
            onClick={() => goToCard(activeIndex - 1)}
            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded"
          >
            Prev
          </button>
          <button
            onClick={() => goToCard(activeIndex + 1)}
            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}
