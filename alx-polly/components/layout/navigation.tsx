"use client"

import Link from "next/link"

export function Navigation() {
  return (
    <nav>
      <div className="container">
        {/* Logo */}
        <Link href="/" className="logo">
          <span className="text-2xl">🗳️</span>
          <span>AlxPolly</span>
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link href="/polls">Browse Polls</Link>
          <Link href="/create-poll">Create Poll</Link>
        </div>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <Link href="/auth">
            <button className="btn btn-outline btn-sm">Sign In</button>
          </Link>
          <Link href="/auth">
            <button className="btn btn-default btn-sm">Sign Up</button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
