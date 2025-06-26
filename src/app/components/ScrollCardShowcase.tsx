'use client'

import { useEffect, useState } from 'react'
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
  level?: string
  image: string
}

// Fungsi bantu untuk kapitalisasi
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Konversi heroes.json menjadi cards[]
const cards: CardData[] = heroesJson.heroes
  .filter((hero) => hero.generation <= 9)
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
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    ScrollTrigger.create({
      trigger: '#stack-section',
      start: 'top top',
      end: () => `+=${cards.length * 300}`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const newIndex = Math.min(
          cards.length - 1,
          Math.floor(self.progress * cards.length)
        )
        setActiveIndex(newIndex)
      },
    })
  }, [])

  const activeCard = cards[activeIndex]

  return (
    <section
      id="stack-section"
      className="relative h-[100vh] bg-black text-white"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        <div className="flex gap-16 items-center">
          {/* Info */}
          <div className="w-[300px]">
            <h1 className="text-3xl font-bold text-pink-400">
              {activeCard.name}
            </h1>
            <p>
              <span className="text-gray-400">Rarity:</span>{' '}
              <span className="text-green-400">{activeCard.rarity}</span>
            </p>
            <p>
              <span className="text-gray-400">Class:</span>{' '}
              <span className="text-green-400">{activeCard.class}</span>
            </p>
            {activeCard.attack && (
              <p>
                Attack:{' '}
                <span className="text-green-400">{activeCard.attack}</span>
              </p>
            )}
            {activeCard.def && (
              <p>
                Def: <span className="text-green-400">{activeCard.def}</span>
              </p>
            )}
            {activeCard.health && (
              <p>
                Health:{' '}
                <span className="text-green-400">{activeCard.health}</span>
              </p>
            )}
            {activeCard.expAttack && (
              <p>
                Expedition Attack:{' '}
                <span className="text-green-400">{activeCard.expAttack}</span>
              </p>
            )}
            {activeCard.expDef && (
              <p>
                Expedition Def:{' '}
                <span className="text-green-400">{activeCard.expDef}</span>
              </p>
            )}
          </div>

          {/* Stack cards */}
          <div className="relative w-[320px] h-[480px]">
            {cards.map((card, index) => {
              const offset = index - activeIndex
              const isActive = index === activeIndex
              const isAfter = index > activeIndex

              return (
                <div
                  key={card.name}
                  className={`absolute transition-all duration-500 ease-in-out ${
                    isActive
                      ? 'z-20 scale-110 opacity-100 shadow-[0_12px_24px_rgba(0,0,0,0.6)] rounded-lg'
                      : isAfter
                      ? 'opacity-40'
                      : 'hidden'
                  }`}
                  style={{
                    transform: isActive
                      ? 'translateX(-40px) translateY(-40px) scale(1.1)'
                      : `translateX(${offset * 20}px) translateY(${
                          offset * 10
                        }px) scale(1)`,
                    left: '50%',
                    top: '50%',
                    transformOrigin: 'center',
                    translate: '-50% -50%',
                    zIndex: 10 - Math.abs(offset),
                  }}
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full object-contain"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
