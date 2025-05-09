"use client"

import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calendar, User, MessageSquare, FileText, BarChart3, CreditCard, Shield } from "lucide-react"
import {
  getKnowledges,
  getProfile,
  getProfileUsageData,
  type KnowledgeLevel,
  type ProfileUsage,
  updateProfile,
  type UsageData,
} from "@/actions/profile"
import type { Conversation } from "@/actions/conversations"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { toast } from "react-toastify"
import { AccountSettingsCard } from "./account-settings-card"
import { updateUser } from "@/actions/oauth"

const formSchema = z.object({
  knowledgeLevel: z.string().default("intermediate"),
})

export default function ProfileLayout() {
  const [knowledgeLevels, setKnowledgeLevels] = useState<KnowledgeLevel[]>([])
  const [selectedKnowledgeLevel, setSelectedKnowledgeLevel] = useState("intermediate")
  const [usageData, setUsageData] = useState<UsageData>()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      knowledgeLevel: "intermediate",
    },
  })

  const [newEmail, setNewEmail] = useState("");

  const handleEmailUpdate = async () => {
    try {
      const result = await updateUser("user-uid", newEmail);
      console.log("Email mis à jour :", result);
      if (result) {
        toast.success("Email mis à jour avec succès !");
      }
    } catch (error) {
      console.error("Erreur de mise à jour de l'email", error);
      toast.error("Échec de la mise à jour de l'email");
    }
  };

  useEffect(() => {
    const fetchKnowledgeLevels = async () => {
      const levels = await getKnowledges()
      if (levels.length > 0) {
        setKnowledgeLevels(levels)
      }
    }
    fetchKnowledgeLevels()
  }, [])

  useEffect(() => {
    const fetchUserLevel = async () => {
      const profile = await getProfile()
      if (profile && profile.profile) {
        setSelectedKnowledgeLevel(profile.profile.level)
        form.setValue("knowledgeLevel", profile.profile.level)
      }
    }
    fetchUserLevel()
    const loadData = async () => {
      try {
        const data = await fetchUsageData()
        if (data?.usage) {
          setUsageData(data)
        }
      } catch (error) {
        console.error("Échec du chargement des données d'utilisation :", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSaveKnowledgeLevel = async () => {
    const response = await updateProfile(selectedKnowledgeLevel)
    if (response) {
      toast.success("Le niveau de connaissance a été mis à jour avec succès !")
    }
  }

  const fetchUsageData = async () => {
    const usage = await getProfileUsageData()
    return usage
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long" })
  }

  // Regrouper les conversations par mois
  const groupConversationsByMonth = (conversations: Conversation[]) => {
    const grouped = conversations.reduce(
      (acc, conversation) => {
        const month = new Date(conversation.created_at).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })
        if (!acc[month]) {
          acc[month] = 0
        }
        acc[month]++
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(grouped).map(([month, count]) => ({ month, count }))
  }

  const chartData = Array.isArray(usageData?.usage)
    ? usageData.usage.map((item: ProfileUsage) => ({
      month: formatDate(item.month),
      messages: item.total_messages,
      documents: item.total_docs,
      reports: item.total_reports,
      conversations: item.total_conversations,
    }))
    : []

  const displayData =
    chartData.length > 0
      ? chartData
      : [{ month: "Aucune donnée", messages: 0, documents: 0, reports: 0, conversations: 0 }]

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="h-8 w-8" /> Profil de l'utilisateur
        </h1>

        <Button className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <Link href="/protected/pricing">Acheter plus de crédits</Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Paramètres du compte
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeTab === "profile" && (
          <>
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Paramètres du profil</CardTitle>
                <CardDescription>Gérez les préférences de votre compte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Niveau de connaissance</h3>
                    <RadioGroup
                      value={selectedKnowledgeLevel}
                      onValueChange={setSelectedKnowledgeLevel}
                      className="space-y-3"
                    >
                      {knowledgeLevels.map((level) => (
                        <div className="flex items-center space-x-2" key={level.id}>
                          <RadioGroupItem value={level.name} id={level.name} />
                          <Label htmlFor={level.name} className="cursor-pointer">
                            {level.name.charAt(0).toUpperCase() + level.name.slice(1)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveKnowledgeLevel} className="w-full">
                  Enregistrer les préférences
                </Button>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" /> Statistiques d'utilisation
                </CardTitle>
                <CardDescription>Voir votre activité sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="chart" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chart">Vue graphique</TabsTrigger>
                    <TabsTrigger value="summary">Résumé</TabsTrigger>
                  </TabsList>
                  <TabsContent value="chart" className="pt-4">
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="conversations" fill="#66b2ff" name="Conversations" />
                          <Bar dataKey="messages" fill="#8884d8" name="Messages" />
                          <Bar dataKey="documents" fill="#82ca9d" name="Documents" />
                          <Bar dataKey="reports" fill="#ffc658" name="Rapports" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  <TabsContent value="summary">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" /> Total des messages
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{displayData[0]?.messages || 0}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4" /> Total des documents
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{displayData[0]?.documents || 0}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" /> Total des rapports
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{displayData[0]?.reports || 0}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Dernière activité
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-medium">{displayData[0]?.month || "Mars 2025"}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" /> Conversations totales
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{displayData[0]?.conversations || 0}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "stats" && (
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" /> Statistiques détaillées
              </CardTitle>
              <CardDescription>Analyse complète de votre utilisation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversations" fill="#66b2ff" name="Conversations" />
                    <Bar dataKey="messages" fill="#8884d8" name="Messages" />
                    <Bar dataKey="documents" fill="#82ca9d" name="Documents" />
                    <Bar dataKey="reports" fill="#ffc658" name="Rapports" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "settings" && (
          <>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Gérez vos informations personnelles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleEmailUpdate}>
                  Mettre à jour l'email
                </Button>
              </CardFooter>
            </Card>

            <div className="md:col-span-1">
              <AccountSettingsCard />
            </div>
          </>
        )}
      </div>
    </div>
  )
}