"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Container from "./Container"
import Link from "next/link"

const slides = [
  {
    image: "/images/solar-1.jpg",
    title: "Reliable Power.",
    subtitle: "Premium Solar Solutions."
  },
  {
    image: "/images/solar-2.jpg",
    title: "Clean Energy.",
    subtitle: "For Every Home."
  },
  {
    image: "/images/solar-3.jpg",
    title: "24/7 Backup.",
    subtitle: "Never Be in Darkness."
  }
]

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Changed to 5 seconds for better testing

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="bg-[#0B0F19] text-white py-24 sm:py-32 relative overflow-hidden min-h-[600px]">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-30" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dark Overlay - Made lighter */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <Container>
        <div className="max-w-3xl relative z-10">
          <h1 className="text-4xl sm:text-6xl font-semibold leading-tight tracking-tight">
            {slides[currentSlide].title}
            <br />
            <span className="text-[#C8A75B]">
              {slides[currentSlide].subtitle}
            </span>
          </h1>

          <p className="mt-8 text-gray-200 text-lg leading-relaxed">
            High-performance solar systems and portable power stations
            designed for homes, businesses, and institutions across Nigeria.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/products">
              <button className="bg-[#C8A75B] text-black px-8 py-4 text-sm font-medium w-full sm:w-auto hover:bg-[#b8964a] transition">
                Shop Products
              </button>
            </Link>

            <Link href="/contact">
              <button className="border border-white px-8 py-4 text-sm w-full sm:w-auto hover:bg-white hover:text-black transition">
                Request Installation
              </button>
            </Link>
          </div>

          {/* Slide Indicators */}
          <div className="flex gap-2 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1 w-12 transition-all ${
                  index === currentSlide ? "bg-[#C8A75B]" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}