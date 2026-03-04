import Container from "./Container"

export default function Footer() {
  return (
    <footer className="bg-[#0B0F19] text-white mt-20 w-full">
      <Container>
        <div className="py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div>
            <div className="text-lg font-semibold mb-3">
              THE GRID
            </div>
            <p className="text-sm opacity-70">
              Premium solar & power solutions distributor in Nigeria.
            </p>
          </div>

          <div>
            <div className="font-medium mb-3">Products</div>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Portable Power</li>
              <li>Home Backup</li>
              <li>Solar Panels</li>
              <li>Smart Tech</li>
            </ul>
          </div>

          <div>
            <div className="font-medium mb-3">Company</div>
            <ul className="space-y-2 text-sm opacity-80">
              <li>About</li>
              <li>Installations</li>
              <li>Contact</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 py-6 text-xs opacity-60 text-center">
          © {new Date().getFullYear()} THE GRID. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}