'use client';

import Link from "next/link";
import { UserButton, Show } from "@clerk/nextjs";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2">
          <div className="size-6 rounded-sm bg-primary" />
          <span className="text-xl font-extrabold tracking-tighter">HOTELPIPE</span>
        </a>
        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#problem" className="transition-colors hover:text-primary">
            The Problem
          </a>
          <a href="#how" className="transition-colors hover:text-primary">
            How it works
          </a>
          <a href="#pricing" className="transition-colors hover:text-primary">
            Pricing
          </a>
        </div>
        
        {/* Right Side: Dynamic Auth & CTA Actions */}
        <div className="flex items-center gap-4">
          
          {/* What logged-in users see */}
          <Show when = "signed-in">
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
            <UserButton />
          </Show>

          {/* What brand-new visitors see */}
          <Show when="signed-out">
            <Link
              href="/login"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground"
            >
              Book a Pilot
            </Link>
          </Show>

        </div>
      </div>
    </nav>
  );
}