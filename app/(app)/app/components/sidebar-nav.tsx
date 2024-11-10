"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon?: React.ReactNode;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex flex-col pl-2 md:pl-0 space-y-2", className)}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            pathname === item.href
              ? "bg-gradient-to-r from-slate-800 to-slate-500 text-white shadow-lg"
              : " hover:bg-gray-100 dark:hover:bg-gray-800",
            "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105"
          )}
        >
          <div className="text-lg">{item.icon}</div>
          <span className="text-sm font-medium md:flex hidden">{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}
