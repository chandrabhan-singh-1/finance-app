"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMedia } from "react-use";

import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import { NavButton } from "./nav-button";
import { useState } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

const routes = [
  {
    href: "/",
    label: "Overview",
  },
  {
    href: "/transactions",
    label: "Transactions",
  },
  {
    href: "/accounts",
    label: "Accounts",
  },
  {
    href: "/categories",
    label: "Categories",
  },
  {
    href: "/settings",
    label: "Settings",
  },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMedia("(max-width: 1024px)", false);
  const pathname = usePathname();

  const router = useRouter();

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            variant={"outline"}
            size={"sm"}
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-transparent focus-visible:ring-offset-0 outline-none text-white focus:bg-white/30  transition"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="px-2">
          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map((r) => (
              <Button
                key={r.href}
                variant={r.href === pathname ? "secondary" : "ghost"}
                onClick={() => onClick(r.href)}
                className="w-full justify-start"
              >
                {r.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="hidden lg:flex items-center gap-2 overflow-x-auto justify-between">
      {routes.map((r) => (
        <NavButton
          key={r.href}
          href={r.href}
          label={r.label}
          isActive={pathname === r.href}
        />
      ))}
    </nav>
  );
};
