"use client"

import { Star } from "lucide-react"
import { useState } from "react"

type StarRatingProps = {
    label: string
    description: string
    value: number
    onChangeAction: (value: number) => void
}

export default function StarRating({ label, description, value, onChangeAction }: StarRatingProps  ) {
  const [hoverValue, setHoverValue] = useState(0)

  return (
    <div className="flex flex-col gap-3 p-6 border rounded-xl bg-card hover:border-primary/50 transition-colors shadow-sm">
        <span className="font-semibold text-xl">Rate the {label}</span>
        <span className="text-primary/80">{description}</span>
        <div className="flex items-center gap-2">
            {[1,2,3,4,5].map((star) => {
                const isActive = star <= (hoverValue || value)
                return (
                    <button
                        key={star}
                        type="button"
                        aria-label={`Rate ${label} ${star} out of 5`}
                        onClick={() => onChangeAction(star)}
                        onMouseEnter={() => setHoverValue(star)}
                        onMouseLeave={() => setHoverValue(0)}
                        className="transition-transform hover:scale-110 cursor-pointer"
                    >
                        <Star
                            className={`w-10 h-10 transition-all ${  
                                isActive ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                        />        
                    </button>
                )
            })}
        </div>
    </div>
  )
}
