"use client";

import { usePathname } from "next/navigation";
import { NavSheet } from "@/components/ui/nav-sheet";
import { useState, useEffect } from "react";

export function Header() {
  const pathname = usePathname();
  const [title, setTitle] = useState("Chris Army Knife");

  const routes = [
    {
      path: "/",
      title: "Chris Army Knife",
    },
    {
      path: "/sleep-calculator",
      title: "Sleep Calculator",
    },
    {
      path: "/dnd-character-creator",
      title: "D&D 2025 Character Creator",
    },
    {
      path: "/gpa-calculator",
      title: "GPA Calculator",
    },
  ];

  useEffect(() => {
    const route = routes.find((route) => route.path === pathname);
    if (route) {
      setTitle(route.title);
    }
  }, [pathname]);

  return (
    <div className="flex gap-4 items-center p-4">
      <NavSheet routes={routes} />
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );
}
