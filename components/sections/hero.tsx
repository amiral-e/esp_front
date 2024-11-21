import React from "react";
import Image from "next/image";
import HeaderAuth from "../header-auth";
import { ArrowDown, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="h-screen justify-between">
      <div className="flex items-start justify-between m-16">
        <div className="flex flex-col items-start space-y-4">
          <div className="flex ">
            <h1 className="text-6xl flex-wrap">
              Ne vous prenez plus la tête avec la comptabilité
            </h1>
            <Image
              src="/pictures/star.png"
              alt="star"
              width={96}
              height={96}
              className="place-self-end"
            />
          </div>

          <p className="text-muted-foreground">
            Finmate est une IA basé sur la comptabilité qui automatisera votre
            gestion
          </p>
          <div className="flex items-center space-x-4 pt-8">
            <Button>
              Voir les avis <ArrowRight size={16} className="ml-2" />
            </Button>
            <Button variant="outline">
              <Play size={16} className="mr-2" />
              Voir la vidéo
            </Button>
          </div>
        </div>
        <Image src="/pictures/hero.png" alt="hero" width={1280} height={1280} />
      </div>
      <div className="absolute bottom-4 w-full flex flex-col space-y-4 items-center justify-center mb-4">
        <h1 className="">Découvrir</h1>
        <ArrowDown />
      </div>
    </div>
  );
};

export default Hero;
