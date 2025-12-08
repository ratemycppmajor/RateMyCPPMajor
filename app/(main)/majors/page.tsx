
'use client';

import { useState } from 'react';
import { Check, ChevronDown } from "lucide-react"
import Image from 'next/image'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


const sortOptions = [
  {
    value: "alphabetical",
    label: "Alphabetical",
  },
  {
    value: "department",
    label: "Department",
  },
  {
    value: "college",
    label: "College",
  },
]

const colleges = [
  "College of Agriculture", 
  "College of Business Administration", 
  "College of Engineering", 
  "College of Environmental Design", 
  "College of Science", 
  "Education and Integrative Studies", 
  "Letters, Arts, and Social Sciences", 
  "The Collins College of Hospitality Management"
]

export default function Majors() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [major, setMajor] = useState("");


  return (
    <main className='text-primary'> 
      <div className="relative h-[400px] w-full">
        <Image
          src="/images/cpp_banners.webp"
          fill={true}
          objectFit="cover"
          alt="CPP campus"
          loading="eager"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/50 to-black"></div>

        <span className='absolute w-full bottom-6 md:bottom-8 text-white'>
          <div className="text-center md:text-left">
              <div className="max-w-7xl mx-auto md:flex md:justify-between md:items-center space-y-4" >
                <h1 className="text-2xl md:text-4xl font-bold w-full md:w-10/12 md:pl-8 ml-0 mb-0 items-center">List of Majors</h1>
                <span className="md:pr-8 font-medium text-xs md:text-base">Pomona, CA</span>
              </div>
          </div>
        </span>
      </div>

      <div className='flex w-10/12 mx-auto'>
        <div className='lg:flex lg:space-x-8 space-y-4 mt-6 w-8/12'>
          <div className="space-y-2 w-full">
            <Label htmlFor="major" className="font-semibold">Search major</Label>
            <Input
              id="major"
              className='shadow-sm'
              placeholder="Major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="sort" className="font-semibold">Sort by</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="sort"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between cursor-pointer shadow-sm hover:text-primary focus:text-primary"
                >
                  {value
                    ? sortOptions.find((option) => option.value === value)?.label
                    : "Alphabetical"}
                  <ChevronDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {sortOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                          }}
                          className={`cursor-pointer ${value === option.value ? "text-primary bg-accent data-[selected=true]:text-primary" : ""}`}
                        >
                          {option.label}
                          <Check
                            className={cn(
                              "ml-auto text-primary",
                              value === option.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover> 
          </div>       
        </div>

        <section className="mt-6 lg:flex flex-col gap-6 w-4/12 bg-zinc-100 rounded-lg p-4 shadow-sm hidden">
          <span className="font-semibold">Filter College</span>
          {colleges.map(((college) => (
            <div key={college} className="flex items-center gap-3">
              <Checkbox id={college} className="border-primary" />
              <Label htmlFor={college}>{college}</Label>
            </div>
          )))}
        </section>
      </div>
      
    </main>
  )
}
