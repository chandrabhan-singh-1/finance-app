import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function ({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1  lg:grid-cols-2 ">
      <div className="h-full lg:flex flex-col items-center jusitfy-center px-4 ">
        <div className="text-center space-y-4 pt-16">
          <h1 className="font-bold text-3xl text-[#2e2a47] ">Welcome Back!</h1>
          <p className="text-base text-[#7e8ca0]">
            Login or Create Account to get back to your Dashboard.
          </p>
        </div>
        <div className="flex items-center justify-center mt-8 ">
          <ClerkLoaded>{children}</ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="animate-spin text-muted-foreground" />
          </ClerkLoading>
        </div>
      </div>
      <div className="h-full bg-blue-600 hidden lg:flex items-center justify-center">
        <Image
          src={"/logo.jpg"}
          alt="Logo"
          height={100}
          width={100}
          className="rounded-full"
          priority
        />
      </div>
    </div>
  );
}
