"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getCurrentUser, signOut } from "@/lib/db-service"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut()
      setUser(null)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/career-paths", label: "Career Paths" },
    { href: "/resources", label: "Physics Learning Resources" },
    { href: "/publications", label: "STEM Publications" },
    { href: "/contact-us", label: "Contact Us" },
  ]

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">STEM</span> School
          </Link>
          <nav className="hidden md:flex ml-10 gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium hover:underline underline-offset-4 ${
                  pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm hidden md:inline">{user.full_name}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => router.push("/profile")}>
                      <div className="rounded-full bg-primary/10 p-1 text-primary">
                        {user.full_name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="hidden md:inline-flex">
                      Log out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login-page" className="hidden md:inline-flex">
                    <Button variant="outline" size="sm">
                      Log in
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium hover:underline underline-offset-4 ${
                  pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <div className="flex flex-col space-y-2 pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  router.push("/profile")
                  setMobileMenuOpen(false)
                }}
              >
                Profile
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 pt-2 border-t">
              <Link href="/login-page" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Log in
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
