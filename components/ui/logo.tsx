import Link from "next/link";
import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src="/pictures/logo.svg" alt="Logo" width={32} height={32} />
      <h1 className="text-xl font-bold">Finmate</h1>
    </Link>
  );
};

export default Logo;
