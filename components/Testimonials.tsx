"use client"

import { useState } from "react"
import Container from "./Container"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    name: "Dr. Adebayo Ogunlesi",
    role: "Homeowner, Lagos",
    content: "THE GRID installed a complete solar system for my 4-bedroom home. I haven't had a single power outage since. The installation was professional and the team was very knowledgeable.",
    rating: 5
  },
  {
    name: "Mrs. Chioma Okonkwo",
    role: "Business Owner, Abuja",
    content: "Our bakery runs entirely on solar now. The hybrid system THE GRID designed for us handles all our equipment perfectly. Best investment we've made!",
    rating: 5
  },
  {
    name: "Engr. Michael Adeleke",
    role: "Tech Company CEO, Port Harcourt",
    content: "We needed a reliable power solution for our data center. THE GRID delivered beyond our expectations. 24/7 support and monitoring included.",
    rating: 5
  },
  {
    name: "Abu Jamal",
    role: "Chief Imam, Ilorin",
    content: "Our mosque now enjoys uninterrupted services thanks to THE GRID. They handled everything from design to installation. Highly recommended!",
    rating: 5
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 mt-3 max-w-xl mx-auto">
            Trusted by hundreds of homes and businesses across Nigeria
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-sm">
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C8A75B] text-[#C8A75B]" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">"{testimonial.content}"</p>
              <div>
                <h4 className="font-medium text-sm">{testimonial.name}</h4>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="bg-gray-50 p-6 rounded-sm">
            <div className="flex gap-1 mb-3">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#C8A75B] text-[#C8A75B]" />
              ))}
            </div>
            <p className="text-gray-600 text-sm mb-4">"{testimonials[currentIndex].content}"</p>
            <div>
              <h4 className="font-medium text-sm">{testimonials[currentIndex].name}</h4>
              <p className="text-xs text-gray-500">{testimonials[currentIndex].role}</p>
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="p-2 border rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="p-2 border rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}