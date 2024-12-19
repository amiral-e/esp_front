"use client";

import { useEffect, useRef, useState } from "react";

import { fetchCollections } from "@/app/actions/collection-action";

const CollectionPage = () => {
  const getCollections = async () => {
      try {
        const fetchedCollection = await fetchCollections();
        if (fetchedCollection.error) {
          console.error(fetchedCollection.error);
        }
        if (fetchedCollection.collection) {
          console.log("fetchedCollection", fetchedCollection.collection);
        }
      } catch (error) {
        console.error("Error fetching collection:", error);
      }
    };

  useEffect(() => {
    getCollections();
  }, []);
  
  return (
    <></>
  );
};

export default CollectionPage;
