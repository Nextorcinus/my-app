'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface CardData {
  name: string
  rarity: string
  class: string
  attack?: number
  def?: number
  health?: number
  expAttack?: string
  expDef?: string
  level?: string
  image: string
}

const cards: CardData[] = [
  {
    name: 'JERONIMO',
    rarity: 'SSR Legendary',
    class: 'Infantry',
    attack: 2218,
    def: 2220,
    health: 41260,
    expAttack: '260.2% ↑ 240.2% Flint',
    expDef: '260.2% ↑ 240.2% Flint',
    image: '/jeronimo.png',
  },
  {
    name: 'REINA',
    rarity: 'SSR',
    class: 'Lancer',
    level: 'S4',
    image: '/reina.png',
  },
  {
    name: 'LLOYD',
    rarity: 'SSR',
    class: 'Lancer',
    level: 'S11',
    image: '/lloyd.png',
  },
  {
    name: 'MOLLY',
    rarity: 'SSR',
    class: 'Lancer',
    level: 'S1',
    image: '/molly.png',
  },
  {
    name: 'PHILLY',
    rarity: 'SSR',
    class: 'Lancer',
    level: 'S3',
    image: '/philly.png',
  },
  {
    name: 'RUFUS',
    rarity: 'SSR',
    class: 'Marksman',
    level: 'S11',
    image: '/rufus.png',
  },
  {
    name: 'FREYA',
    rarity: 'SSR',
    class: 'Lancer',
    level: 'S10',
    image: '/freya.png',
  },
]

gsap.registerPlugin(ScrollTrigger)

const CardGallery = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cardEls = gsap.utils.toArray('.card') as HTMLElement[]

      gsap.set(cardEls, { opacity: 0.3, scale: 0.8, y: 50 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${cardEls.length * 150}`, // panjang scroll tergantung jumlah kartu
          pin: containerRef.current,
          scrub: true,
        },
      })

      cardEls.forEach((card, i) => {
        tl.to(card, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.3,
        })
        if (i !== cardEls.length - 1) {
          tl.to(card, {
            opacity: 0.3,
            scale: 0.8,
            y: -50,
            duration: 0.3,
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-white">
      <div
        ref={containerRef}
        className="min-h-screen flex items-center justify-center flex-col gap-10 py-40"
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className="card bg-white shadow-lg rounded-xl p-6 w-[300px] text-center"
          >
            <img src={card.image} alt={card.name} className="w-full mb-4" />
            <h2 className="text-xl font-bold">{card.name}</h2>
            <p>Rarity: {card.rarity}</p>
            <p>Class: {card.class}</p>
            {card.attack && <p>Attack: {card.attack}</p>}
            {card.def && <p>Def: {card.def}</p>}
            {card.health && <p>Health: {card.health}</p>}
            {card.expAttack && <p>Exp Attack: {card.expAttack}</p>}
            {card.expDef && <p>Exp Def: {card.expDef}</p>}
            {card.level && <p>Level: {card.level}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

export default CardGallery
