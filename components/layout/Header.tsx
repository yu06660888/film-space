"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  const nav = [
    { href: "/shelf", label: "书架", icon: BookOpen },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/shelf" className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-gray-900">
            Film Space
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                pathname === href || pathname.startsWith(href)
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/log"
          className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors"
        >
          <Plus size={14} />
          记录
        </Link>
      </div>
    </header>
  );
}
