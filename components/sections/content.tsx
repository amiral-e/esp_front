import React from "react";
import Image from "next/image";

const Content = () => {
  return (
    <div className="flex items-start justify-between h-screen m-16">
      <div className="flex flex-col items-start space-y-4">
        <h1 className="text-6xl flex-wrap">
          Ne vous prenez plus la tête avec la comptabilité
        </h1>
        <p className="text-muted-foreground">
          Finmate est une IA basé sur la comptabilité qui automatisera votre
          gestion
        </p>
      </div>
      <Image src="/pictures/rewards.png" alt="hero" width={800} height={800} />
    </div>
  );
};

export default Content;
