"use client";

import { ReactNode, useState } from "react";
import CollectionPage from "./page";

const CollectionLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex justify-content item-center items-start space-x-4">
      <div className="w-full h-full">
        <CollectionPage />
      </div>
    </div>
  );
};

export default CollectionLayout;
