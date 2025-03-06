"use client"

import { useState, useEffect } from "react"
import { fetchCollections } from "@/app/actions/collection-action"
import { MultiSelect, OptionGroup } from "./ui/multi-select"

interface MultiSelectDemoProps {
  onSelectCollections: (collections: string[]) => void
}

export function MultiSelectDemo({ onSelectCollections }: MultiSelectDemoProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [options, setOptions] = useState<OptionGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const result = await fetchCollections()
        if ("collections" in result && result.collections) {
          const groupedOptions: OptionGroup[] = [
            {
              label: "Global collection",
              options: result.collections.filter((c) => c.status === "global"),
            },
            {
              label: "User collection",
              options: result.collections.filter((c) => c.status === "normal"),
            },
          ]
          setOptions(groupedOptions)
        } else {
          setError("Failed to fetch collections")
        }
      } catch (err) {
        setError("An error occurred while fetching collections")
      } finally {
        setLoading(false)
      }
    }

    loadCollections()
  }, [])

  const handleChange = (values: string[]) => {
    setSelected(values)
    onSelectCollections(values)
  }

  if (loading) {
    return <div>Chargement des collections...</div>
  }

  if (error) {
    return <div>Erreur: {error}</div>
  }

  return (
    <div className="w-[200px]">
      <MultiSelect options={options} selected={selected} onChange={handleChange} placeholder="Choisir les collections..." />
    </div>
  )
}