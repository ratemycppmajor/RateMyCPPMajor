'use client'

import { useEffect } from 'react'
import { Brain, Briefcase, Smile, Star } from "lucide-react"
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
import Link from 'next/link'
import Image from 'next/image'
type Props = {
    major: MajorWithRelations;
}

export default function MajorClient({ major } : Props) {
  useEffect(() => window.document.scrollingElement?.scrollTo(0, 0), [])

  const avgRating = major?.reviews && major.reviews.length > 0
    ? major.reviews.reduce((sum, review) => sum + review.rating, 0) / major.reviews.length
    : null
 
  const avgCareerReadiness = major?.reviews && major.reviews.length > 0
    ? major.reviews.reduce((sum, review) => sum + review.careerReadiness, 0) / major.reviews.length
    : null
 
  const avgDifficulty = major?.reviews && major.reviews.length > 0
    ? major.reviews.reduce((sum, review) => sum + review.difficulty, 0) / major.reviews.length
    : null
 
  const avgSatisfaction = major?.reviews && major.reviews.length > 0
    ? major.reviews.reduce((sum, review) => sum + review.satisfaction, 0) / major.reviews.length
    : null

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

  const ratingOptions = [
    {
      name: "Career Readiness",
      value: avgCareerReadiness,
      icon: Briefcase
    },
    {
      name: "Difficulty",
      value: avgDifficulty,
      icon: Brain,
    },
    {
      name: "Satisfaction",
      value: avgSatisfaction,
      icon: Smile
    } 
  ]

  return (
    <div className="mx-auto max-w-7xl px-8">
      {/* First Section */}
      <div className="grid lg:grid-cols-2 grid-rows-1 items-center py-20 gap-2">
        {/* Major and Rating */}
        <section>
          <h1 className="text-4xl font-semibold">{major.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span>{major.department.college.name}</span>
            <span>|</span>
            <span>{major.department.name}</span>
          </div>

          {avgRating !== null ? 
          (
            <div className="mt-6 inline-flex flex-col gap-2 rounded-lg border bg-card p-4">
              <div className="text-sm font-medium text-muted-foreground">Average Rating</div>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold">{avgRating}</div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const filled = i < Math.floor(avgRating)

                      return (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            filled
                              ? "fill-amber-400 text-amber-400"
                              : "fill-muted text-muted-foreground/40"
                          }`}
                        />
                      )
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Based on {major.reviews.length} {major.reviews.length === 1 ? "review" : "reviews"}
                  </div>
                </div>
              </div>
            </div>
          )
           :
           <div className="mt-6 inline-flex flex-col gap-2 rounded-lg border bg-card p-4">
              <div className="text-sm font-medium text-muted-foreground">Average Rating</div>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold">N/A</div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-muted-foreground">
                    Based on {major.reviews.length} {major.reviews.length === 1 ? "review" : "reviews"}
                  </div>
                </div>
              </div>
            </div>
          }

          <div className="mt-5 flex items-center gap-x-6">
            <Link 
              href={`/add/${major.slug}`} 
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold transition-all duration-300 ease-in-out hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Add Review
            </Link>
            {major.url && 
              <a
                href={major.url} 
                target="_blank" 
                className="text-sm font-semibold leading-6 block hover:underline hover:underline-offset-2"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            }
          </div>
        </section>
        
        {/* Rating options */}
        <div className="relative h-[400px] rounded-2xl border-4 border-primary overflow-hidden mt-12 lg:mt-0">
          {major.imgSrc && (
            <Image
              src={major.imgSrc}
              alt={major.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 400px, 100vw"
              priority
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/35 to-transparent"/>

          <div className="relative h-full flex items-end p-8">
            <ul className="flex flex-col gap-4 w-full">
              {ratingOptions.map(({ name, value, icon: Icon }) => (
                <li key={name} className="text-sm">
                  <div className="flex items-center gap-2 text-white">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{name}</span>
                  </div>
                  {value !== null ? (
                    <div className="flex items-center gap-0.5 pl-7 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const filled = i < Math.round(value)

                        return (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                            filled
                              ? "fill-amber-400 text-amber-400"
                              : "fill-muted text-muted-foreground/40"
                          }`}
                          />
                        )
                      })}
                    </div>
                  ) : (
                    <div className="pl-7 mt-1 text-white/70">N/A</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Second Section */}
      <div className="grid lg:grid-cols-2 grid-rows-1 items-center gap-12 pb-20">
        {/* About section */}
        <section>
          <h2 className="text-lg lg:text-xl uppercase font-semibold mb-4">About the major</h2>
          <p className="text-lg lg:text-xl text-primary/80">{major.description}</p>
        </section>
        
        {/* Average GPA */}
        <div className="flex flex-col">
          <div className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px] min-h-[200px] w-full"
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
          <div className="flex items-center px-6 flex-col gap-2 text-sm">
            <span className="flex items-center gap-2 leading-none font-medium">
              Average GPA
            </span>
            <span className="text-muted-foreground leading-none">
              Showing for all class standings from 2018-2025
            </span>
          </div>
        </div>
      </div>
      
      {/* Third Section */}

      <div className="pb-20">
        <div className="text-sm mt-4">
          <span className="text-lg lg:text-xl font-semibold">{major.reviews.length} Student Reviews</span>  
          <hr className='border-primary/30 mt-3'/>
        </div>  

        <div>
          <ul>
            {major.reviews.length > 0 && major.reviews.map((review) => (
              <li key={review.id} className="py-4 border-b border-primary/30">
                <div className='flex justify-between'>
                  <div className="flex items-center gap-0.5 pl-8">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const filled = i < Math.round(review.rating)

                      return (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            filled
                              ? "fill-amber-400 text-amber-400"
                              : "fill-muted text-muted-foreground/40"
                          }`}
                        />
                      )
                    })}
                  </div>
                  <span>12/13/2025</span>
                </div>

                <ul className='flex gap-10 mt-3'>
                  {ratingOptions.map((option) => (
                    <li key={option.name}>
                      {option.name}: <span className='font-semibold'>4</span> 
                    </li>
                  ))}
                </ul>

                <p className="my-4">{review.comment}</p>
              </li>
            ))}
          </ul>
          
          {/* <ul>
            <li className="py-4 border-b border-primary/30 ">
              <div className='flex justify-between'>
                <div className="flex items-center gap-0.5">
                  <Star className={`h-4 w-4 }`}/>
                  <Star className={`h-4 w-4 }`}/>
                  <Star className={`h-4 w-4 }`}/>
                  <Star className={`h-4 w-4 }`}/>
                  <Star className={`h-4 w-4 }`}/>
                </div>

                <span>12/13/2025</span>
              </div>

              <ul className='flex gap-10 mt-3'>
                {ratingOptions.map((option) => (
                  <li key={option.name}>
                    {option.name}: <span className='font-semibold'>4</span> 
                  </li>
                ))}    
              </ul>

              <p className='my-4'>A paragraph is a group of sentences focused on a single idea, typically starting with a topic sentence, followed by supporting details (facts, examples, explanations), and often ending with a concluding sentence to wrap up the thought, like a short story about a bad first day of school: My first day of school was a disaster from start to finish. </p> 
            </li>   
          </ul> */}
        </div>     
      </div>
      
      
    </div>
  )
}
