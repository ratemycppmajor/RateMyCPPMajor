'use client'

import { useEffect } from 'react'

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"
import { MajorWithRelations } from "@/types/major"

type Props = {
    major: MajorWithRelations;
}

export default function MajorClient({ major } : Props) {
  useEffect(() => window.document.scrollingElement?.scrollTo(0, 0), [])

  const MAX_GPA = 4.0
  const rawGPA = major.averageGpa ?? null
  const fillAngle = rawGPA != null ? (rawGPA / MAX_GPA) * 360 : 0

  const chartData = [
    {
      gpa: 100,
      rawGpa: rawGPA,
      fill: "var(--color-gpa)", 

    },
  ]

  const chartConfig = {
    gpa: {
      label: "GPA",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  return (
    <div className="mx-auto max-w-7xl">

      <div>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={90 - fillAngle}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="gpa" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].rawGpa != null ? chartData[0].rawGpa : "N/A"}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Avg. GPA
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </div>
      
    </div>
  )
}
