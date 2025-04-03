"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const PromptInput = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col w-full rounded-lg border bg-background p-4",
      className
    )}
    {...props}
  />
));
PromptInput.displayName = "PromptInput";

const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex w-full resize-none bg-transparent px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    rows={1}
    {...props}
  />
));
PromptInputTextarea.displayName = "PromptInputTextarea";

const PromptInputActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-end gap-2 pt-2", className)}
    {...props}
  />
));
PromptInputActions.displayName = "PromptInputActions";

const PromptInputAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { tooltip?: string }
>(({ className, tooltip, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative", className)}
    title={tooltip}
    {...props}
  />
));
PromptInputAction.displayName = "PromptInputAction";

export {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
};
