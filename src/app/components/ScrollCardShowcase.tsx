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
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    ScrollTrigger.create({
      trigger: '#stack-section',
      start: 'top top',
      end: () => `+=${cards.length * 750}`,
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

  function getPreviousHeroStat(
    heroes: typeof heroesJson.heroes,
    current: any,
    type: 'attack' | 'defense'
  ) {
    const prev = [...heroes]
      .filter(
        (h) =>
          h['hero-class'] === current['hero-class'] &&
          h.generation < current.generation &&
          h.stats?.expedition?.[type]
      )
      .sort((a, b) => b.generation - a.generation)[0]

    if (!prev) return null

    return {
      value: prev.stats.expedition[type],
      name: prev['hero-name'],
    }
  }

  const rawHero = heroesJson.heroes.find(
    (h) => h['hero-name'].toUpperCase() === activeCard.name
  )

  const prevAttack = rawHero
    ? getPreviousHeroStat(heroesJson.heroes, rawHero, 'attack')
    : null
  const prevDef = rawHero
    ? getPreviousHeroStat(heroesJson.heroes, rawHero, 'defense')
    : null

  return (
    <section
      id="stack-section"
      className="relative h-[100vh] bg-zinc-800 text-white"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center  ">
          {/* Info */}
          <div className="w-[300px]">
            <h1 className="text-3xl font-russo title">
              {activeCard.name}
            </h1>
            <p>
              <span className="text-gray-400 text-xl font-vt323">Rarity:</span>{' '}
              <span className="desc text-xl font-vt323">{activeCard.rarity}</span>
            </p>
            <p>
              <span className="text-gray-400 text-xl font-vt323">Class:</span>{' '}
              <span className="desc text-xl font-vt323">{activeCard.class}</span>
            </p>
            <p className="text-xl mt-4 mb-2 md:text-2xl font-vt323  text-zinc-300">
              {' '}
              STATS{' '}
            </p>
            {activeCard.attack && (
              <p className="font-vt323 text-xl text-gray-400">
                Attack:{' '}
                <span className="desc text-xl">{activeCard.attack}</span>
              </p>
            )}
            {activeCard.def && (
              <p className="font-vt323 text-xl text-gray-400">
                Def: <span className="desc">{activeCard.def}</span>
              </p>
            )}
            {activeCard.health && (
              <p className="font-vt323 text-gray-400 text-xl">
                Health:{' '}
                <span className="desc">{activeCard.health}</span>
              </p>
            )}
            <p className="text-xl mt-4 mb-2 md:text-2xl font-vt323 text-zinc-300">
              {' '}
              EXPEDITION{' '}
            </p>
            {activeCard.expAttack && (
              <p className="flex items-center gap-2 font-vt323 text-xl text-gray-400">
                Attack:{' '}
                <span className="desc text-xl">{activeCard.expAttack}</span>
                {prevAttack && (
                  <span className="flex items-center gap-1">
                    {parseFloat(activeCard.expAttack) >
                    parseFloat(prevAttack.value) ? (
                      <span className="desc text-xl">↑</span>
                    ) : (
                      <span className="title text-xl">↓</span>
                    )}
                    <span className="title text-xl">{prevAttack.value}</span>
                    <span className="text-gray-400 text-xl">{prevAttack.name}</span>
                  </span>
                )}
              </p>
            )}

            {activeCard.expDef && (
              <p className="flex items-center gap-2 font-vt323 text-xl text-gray-400">
                Def: <span className="desc">{activeCard.expDef}</span>
                {prevDef && (
                  <span className="flex items-center gap-1">
                    {parseFloat(activeCard.expDef) >
                    parseFloat(prevDef.value) ? (
                      <span className="desc text-xl">↑</span>
                    ) : (
                      <span className="title text-xl">↓</span>
                    )}
                    <span className="title text-xl">{prevDef.value}</span>
                    <span className="text-gray-400 text-xl">{prevDef.name}</span>
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Stack cards */}
          <div className="relative w-[220px] h-[330px] md:w-[320px] md:h-[480px]">
            {cards.map((card, index) => {
              const offset = index - activeIndex
              const isActive = index === activeIndex
              const isBefore = offset < 0 && offset >= -8

              return (
                <div
                  key={card.name}
                  className={`absolute transition-all duration-500  ease-out ${
                    isActive
                      ? 'z-20 opacity-100 scale-110 shadow-[0_12px_24px_rgba(0,0,0,0.6)] rounded-lg'
                      : isBefore
                      ? 'opacity-40'
                      : 'hidden'
                  }`}
                  style={{
                    transform: isActive
                      ? 'translateX(-50px) translateY(-10px) scale(1.5)'
                      : `translateX(${offset * -10}px) translateY(${
                          offset * -5
                        }px) scale(1)`,
                    left: '50%',
                    top: '50%',
                    transformOrigin: 'center',
                    translate: '-50% -50%',
                    zIndex: 10 - Math.abs(offset),
                    transition: 'all 0.5s elastic-out',
                  }}
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full object-contain"
                    style={{
                      opacity: isActive ? 1 : 0.4,
                    }}
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
