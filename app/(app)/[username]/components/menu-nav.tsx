"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href?: string;
    title: string;
    icon?: React.ReactNode;
  }[];
}

export function MenuNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href ? item.href : "/app"}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname?.split("/").pop() === item.href?.split("/").pop()
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start flex items-center gap-4 rounded-full"
          )}
        >
          <div>{item.icon}</div>
          <span className="hidden md:flex">

          {item.title}
          </span>
        </Link>
      ))}
    </nav>
  );
}
