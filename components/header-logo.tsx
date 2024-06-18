import Image from "next/image";
import Link from "next/link";
import React from "react";

export const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="items-center hidden lg:flex">
        <Image
          src={"/logo.jpg"}
          alt="Logo"
          height={32}
          width={32}
          className="rounded-full"
        />
        <p className="font-semibold text-white text-2xl ml-2.5">Finance</p>
      </div>
    </Link>
  );
};
