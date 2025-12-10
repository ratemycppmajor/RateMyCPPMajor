'use client';

import { useState } from 'react';
import { CollegeWithRelations } from '@/types/major';
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react"
import Image from 'next/image'
import { cn } from "@/lib/utils"
import { Badge } from '@/components/ui/badge';
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

type Props = {
  colleges: CollegeWithRelations[];
};

export default function MajorList({ colleges } : Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [major, setMajor] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);


  const toggleCollege = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((college) => college !== id) : [...prev, id]))
  }

  const filteredColleges = selected.length === 0
    ? colleges
    : colleges.filter((college) => selected.includes(college.name));


  return (
    <div className='text-primary'> 
      {/* Hero */}
      <div className="relative h-[400px] w-full">
        <Image
          id="top"
          src="/images/cpp_banners.webp"
          fill={true}
          alt="CPP campus"
          loading="eager"
          style={{ objectFit: "cover" }}
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

      {/* Search content */}
      <main className='lg:flex w-10/12 mx-auto lg:space-x-8'>
        <div className='lg:w-8/12'>
          <div className='lg:flex lg:space-x-8 space-y-4 mt-6'>
            {/* Search */}
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

            {/* Sort */}
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


          <div className="text-sm mt-4">
            <span className="font-semibold">Results Found: 128</span>                     
            <hr className='border-primary/30 mt-3'/>
          </div>             
        
          {/* Search Results */}
          <ul className="flex flex-col gap-6 mt-12 mb-20">
            {filteredColleges.map((college) => (
                <li key={college.id}>
                    <h2 className="text-3xl lg:text-4xl mb-8 font-semibold">{college.name}</h2>
                    {college.departments.map((department) => (  
                        <div key={department.id} className="mb-12">
                            <h3 
                                className="text-white text-xl lg:text-2xl p-2.5 border-border rounded-t-2xl shadow-sm bg-primary
                                lg:bg-linear-to-r 
                                from-[#005030] 
                                via-[#005030]
                                to-[#ffb81c]/80

                                lg:from-[#005030]
                                lg:via-[#005030]
                                lg:to-[#ffb81c]/80" 
                            >
                            {department.name}
                            </h3>
                            <div className="p-5 bg-zinc-100 border-border border-solid rounded-b-2xl shadow-sm">
                            <span className="font-semibold mb-1 block">Bachelor</span>
                            {department.majors.map((major) => (
                                <ul key={major.id}>
                                    <li className="text-xl lg:text-2xl">
                                        <a href="" className="hover:underline">{major.name}</a>
                                    </li>
                                </ul>
                            ))}
                                
                            </div>
                            <a 
                                className="font-light text-sm mt-6 ml-1 block cursor-pointer"
                                href="#top"
                                onClick={(e) => {
                                e.preventDefault();
                                document.querySelector('#top')?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start',
                                });
                                }}
                            >
                                {"("} back to top {")"}
                            </a>
                        </div>
                    ))}
                </li> 
            ))}
          </ul>

        </div>
        
        {/* Filter button */}
        <div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="fixed bottom-4 right-4 flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-opacity hover:opacity-90 lg:hidden"
          >
            <SlidersHorizontal className="size-4" />
            Filters
            {selected.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-primary-foreground text-primary">
                {selected.length}
              </Badge>
            )}
          </button>
        </div>
        
        {/* Sidebar Filter College */}
        <div className="w-4/12">
            <section className="mt-6 lg:flex flex-col gap-6 bg-zinc-100 rounded-lg p-4 shadow-sm hidden">
            <span className="font-semibold">Filter College</span>
            {colleges.map(((college) => (
                <div key={college.id} className="flex items-center gap-3">
                  <Checkbox 
                    id={college.name} 
                    className="border-primary cursor-pointer"
                    checked={selected.includes(college.name)}
                    onCheckedChange={() => toggleCollege(college.name)}
                  />
                  <Label htmlFor={college.name}>{college.name}</Label>
                </div>
            )))}
            </section>
        </div>
        
        
        {/* Filter College Mobile UI */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setIsFilterOpen(false)} />

            <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-background p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Colleges</h2>
                  <p className="text-sm text-muted-foreground">Select colleges to filter</p>
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="rounded-lg p-2 transition-colors hover:bg-accent"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="space-y-1">
                {colleges.map((college) => (
                  <label
                    key={college.id}
                    htmlFor={`mobile-filter-${college.name}`}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 transition-colors active:bg-accent/50"
                  >
                    <Checkbox
                      id={`mobile-filter-${college.name}`}
                      checked={selected.includes(college.name)}
                      onCheckedChange={() => toggleCollege(college.name)}
                      className="border-primary cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium leading-none text-card-primary ">{college.name}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Apply {selected.length > 0 && selected.length} Filters
                </button>

                <button
                  onClick={() => setSelected([])}
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-card-foreground transition-colors hover:bg-accent/50"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
