import React from "react";
import { HeaderLogo } from "./header-logo";
import { Navigation } from "./navigation";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { WelcomeMsg } from "./welcome-msg";
import { Filters } from "./filters";

export const Header = () => {
  return (
    <header className="bg-gradient-to-b from-blue-700 to-blue-400 px-4 py-8 lg:px-14 pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>
          <ClerkLoaded>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: {
                    height: "35px",
                    width: "35px",
                  },
                },
              }}
            />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="size-6 text-zinc-200 animate-spin" />
          </ClerkLoading>
        </div>
        <WelcomeMsg />
        <Filters />
      </div>
    </header>
  );
};
