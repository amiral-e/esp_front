"use client"

import { useState, useEffect } from "react"
import { Search, Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "react-toastify"
import { getPlatformPrices, updatePlatformPrice } from "@/app/actions"
import Link from "next/link"

interface Price {
    price: string
    description: string
    value: number
}

export default function PriceDashboard() {
    const [prices, setPrices] = useState<Price[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [editingPrice, setEditingPrice] = useState<string | null>(null)
    const [editValue, setEditValue] = useState<number>(0)

    // Fetch prices on component mount
    useEffect(() => {
        fetchPrices()
    }, [])

    const fetchPrices = async () => {
        setIsLoading(true)
        try {
            const priceData = await getPlatformPrices()
            setPrices(priceData)
        } catch (error) {
            toast.error("Erreur lors de la récupération des prix")
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditPrice = (price: Price) => {
        setEditingPrice(price.price)
        setEditValue(price.value)
    }

    const handleCancelEdit = () => {
        setEditingPrice(null)
    }

    const handleSavePrice = async (priceName: string) => {
        try {
            const message = await updatePlatformPrice(priceName, editValue)
            // Update local state
            setPrices(prices.map((p) => (p.price === priceName ? { ...p, value: editValue } : p)))
            toast.success(message || "Le prix a été mis à jour avec succès.")

            setEditingPrice(null)
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du prix")
        }
    }

    const filteredPrices = prices.filter(
        (price) =>
            price.price.toLowerCase().includes(searchQuery.toLowerCase()) ||
            price.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Gestion des Prix</h1>
                <Button disabled={isLoading}>
                    <Link href="/protected/admin">
                        Dashboard
                    </Link>
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Rechercher des prix..."
                    className="max-w-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={fetchPrices} disabled={isLoading}>
                    {isLoading ? "Chargement..." : "Actualiser"}
                </Button>
            </div>

            <Card>
                <CardHeader className="p-4">
                    <CardTitle>Prix de la Plateforme</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Identifiant</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Valeur</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        Chargement des prix...
                                    </TableCell>
                                </TableRow>
                            ) : filteredPrices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        Aucun prix trouvé
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPrices.map((price) => (
                                    <TableRow key={price.price}>
                                        <TableCell className="font-medium">{price.price}</TableCell>
                                        <TableCell>{price.description}</TableCell>
                                        <TableCell>
                                            {editingPrice === price.price ? (
                                                <Input
                                                    type="number"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(Number(e.target.value))}
                                                    className="w-24"
                                                />
                                            ) : (
                                                price.value
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {editingPrice === price.price ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleCancelEdit()}>
                                                        <X className="h-4 w-4" />
                                                        <span className="sr-only">Annuler</span>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleSavePrice(price.price)}>
                                                        <Save className="h-4 w-4" />
                                                        <span className="sr-only">Enregistrer</span>
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button variant="ghost" size="icon" onClick={() => handleEditPrice(price)}>
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Modifier</span>
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

