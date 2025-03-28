"use client";

import { useState, useEffect } from "react";

export default function TypingEffect({ content }: { content: string }) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent((prev) => prev + content[index]);
        setIndex((prev) => prev + 1);
      }, 20);

      return () => clearTimeout(timer);
    }
  }, [index, content]);

  return (
    <div className="whitespace-pre-wrap">
      {displayedContent}
      {index < content.length && <span className="animate-pulse">▊</span>}
    </div>
  );
}
