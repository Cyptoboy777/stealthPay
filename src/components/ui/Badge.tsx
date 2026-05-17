import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
        {
          "border-transparent bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/20": variant === "default",
          "border-transparent bg-[#1E293B] text-slate-300 hover:bg-[#1E293B]/80": variant === "secondary",
          "border-transparent bg-red-500/20 text-red-400 hover:bg-red-500/30": variant === "destructive",
          "border-[#1E293B] text-slate-400": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
