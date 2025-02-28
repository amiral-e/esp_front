"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Collections } from "@/app/actions/collection-action"

export type OptionGroup = {
  label: string
  options: Collections[]
}

interface MultiSelectProps {
  options: OptionGroup[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  maxDisplayItems?: number
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
  disabled = false,
  maxDisplayItems = 10,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (value: string) => {
    onChange(selected.filter((item) => item !== value))
  }

  // Get display labels for selected items
  const selectedLabels = selected.map((value) => {
    const option = options.flatMap((group) => group.options).find((opt) => opt.collection === value)
    return option?.name || value
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between px-3 py-2 border border-gray-300", className, "rounded-md")}
          disabled={disabled}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-2 items-center w-full">
            {selected.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}

            {selected.length >= 2 ? (
              <Badge variant="secondary" className="px-2 py-1">
                {selected.length} sélectionnés
              </Badge>
            ) : (
              selectedLabels.slice(0, maxDisplayItems).map((label, i) => (
                <Badge key={i} variant="secondary" className="flex items-center space-x-1 px-2 py-1 text-sm">
                  <span>{label}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUnselect(selected[i])
                    }}
                  />
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search options..." />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            {options.map((group, index) => (
              <React.Fragment key={group.label}>
                {index > 0 && <CommandSeparator />}
                <CommandGroup heading={group.label}>
                  {group.options.map((option) => {
                    const isSelected = selected.includes(option.collection)
                    return (
                      <CommandItem
                        key={option.collection}
                        onSelect={() => {
                          if (isSelected) {
                            onChange(selected.filter((item) => item !== option.collection))
                          } else {
                            onChange([...selected, option.collection])
                          }
                        }}
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center border border-primary",
                            isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        <span>{option.name}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
