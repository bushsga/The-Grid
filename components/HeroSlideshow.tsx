"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Container from "./Container"
import Link from "next/link"

const slides = [
  {
    image: "/images/solar-1.jpg",
    title: "End Your Dependence on NEPA",
    subtitle: "Stay Powered, Always."
  },
  {
    image: "/images/solar-2.jpg",
    title: "Say Goodbye to Dark Nights",
    subtitle: "Take Control Today."
  },
  {
    image: "/images/solar-3.jpg",
    title: "Blackouts Are History",
    subtitle: "With The Grid."
  }
]

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 10000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="bg-[#0B0F19] text-white py-24 sm:py-32 relative overflow-hidden min-h-[600px]">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-40" : "opacity-0"
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

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content - UPDATED WITH CLIENT'S TEXT */}
      <Container>
        <div className="max-w-3xl relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight tracking-tight">
            {slides[currentSlide].title}
            <br />
            <span className="text-[#C8A75B]">
              {slides[currentSlide].subtitle}
            </span>
          </h1>

          {/* Dynamic paragraph based on slide */}
          <p className="mt-8 text-gray-200 text-lg leading-relaxed">
            {currentSlide === 0 && "Stop letting power cuts slow your home or business. With reliable power and smart systems—delivered, installed, and fully supported—you stay productive and worry-free, every hour, every day."}
            {currentSlide === 1 && "Tired of sitting in the dark every time the power goes out? It's time to take control. With reliable solar and smart power solutions, your home or business can stay lit—day and night."}
            {currentSlide === 2 && "The Grid delivers reliable solar power for Nigerian homes and businesses, fully installed and supported, moving you from blackout frustration to energy independence."}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/categories">
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