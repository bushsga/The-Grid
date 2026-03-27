import Link from "next/link"
import Container from "./Container"
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  const productCategories = [
    { name: "Solar Panels", href: "/products?category=Solar%20Panels" },
    { name: "Inverters & Controllers", href: "/products?category=Inverters%20%26%20Controllers" },
    { name: "Batteries", href: "/products?category=Batteries" },
    { name: "Portable Power", href: "/products?category=Portable%20Power%20Stations" },
    { name: "Fans & Appliances", href: "/products?category=Fans%20%26%20Home%20Appliances" },
    { name: "Solar Lighting", href: "/products?category=Solar%20Lighting" },
    { name: "Tech Hub", href: "/products?category=Gadgets%20%26%20Accessories" },
    { name: "Installation", href: "/products?category=Installation%20%26%20Security" },
  ]

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Installation", href: "/contact" },
    { name: "Calculator", href: "/calculator" },
  ]

  return (
    <footer className="bg-[#0B0F19] text-white mt-20">
      <Container>
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="text-2xl font-bold mb-4 tracking-wide">
              THE GRID
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Nigeria's premier solar power solutions provider. Delivering clean, reliable energy to homes and businesses nationwide.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=61586539686519" className="text-gray-400 hover:text-[#C8A75B] transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/thegridsolartech/?utm_source=ig_web_button_share_sheet" className="text-gray-400 hover:text-[#C8A75B] transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#C8A75B]">Products</h3>
            <ul className="space-y-2">
              {productCategories.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#C8A75B]">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#C8A75B]">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-5 h-5 text-[#C8A75B] shrink-0" />
                <span>Kwara, Nigeria</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-5 h-5 text-[#C8A75B] shrink-0" />
                <span>08144414547</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-5 h-5 text-[#C8A75B] shrink-0" />
                <span>thegridgloballtd@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              © {currentYear} THE GRID. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-[#C8A75B] transition">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[#C8A75B] transition">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}