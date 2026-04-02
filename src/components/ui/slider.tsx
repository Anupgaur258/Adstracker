"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Slider({
  className,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: {
  className?: string
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}) {
  const currentValue = value?.[0] ?? min
  const percent = ((currentValue - min) / (max - min)) * 100

  return (
    <div className={cn("relative w-full select-none", props.disabled && "opacity-50 pointer-events-none", className)}>
      <div className="relative flex w-full touch-none items-center h-4">
        <div
          data-slot="slider-track"
          className="relative w-full h-1 rounded-full bg-muted overflow-hidden"
        >
          <div
            data-slot="slider-range"
            className="absolute h-full bg-primary rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={(e) => onValueChange?.([Number(e.target.value)])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          data-slot="slider-thumb"
          className="absolute block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none pointer-events-none hover:ring-3 focus-visible:ring-3"
          style={{ left: `calc(${percent}% - 6px)` }}
        />
      </div>
    </div>
  )
}

export { Slider }
