"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calendar, User, MessageSquare, FileText, BarChart3, CreditCard } from "lucide-react"
import { getKnowledges, getProfile, getProfileUsageData, KnowledgeLevel, ProfileUsage, updateProfile, UsageData } from "@/actions/profile"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Progress } from "@/components/ui/progress"

const formSchema = z.object({
  knowledgeLevel: z.string().default("intermediate"),
});

export default function ProfileLayout() {
  const [knowledgeLevels, setKnowledgeLevels] = useState<KnowledgeLevel[]>([]);
  const [selectedKnowledgeLevel, setSelectedKnowledgeLevel] = useState("intermediate");
  const [usageData, setUsageData] = useState<UsageData>();
  const [isLoading, setIsLoading] = useState(true)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      knowledgeLevel: "intermediate",
    },
  });

  useEffect(() => {
    const fetchKnowledgeLevels = async () => {
      const levels = await getKnowledges();
      if (levels.length > 0) {
        setKnowledgeLevels(levels);
      }
    };
    fetchKnowledgeLevels();
  }, []);

  useEffect(() => {
    const fetchUserLevel = async () => {
      const profile = await getProfile();
      if (profile && profile.profile) {
        setSelectedKnowledgeLevel(profile.profile.level);
        form.setValue("knowledgeLevel", profile.profile.level);
      }
    };
    fetchUserLevel();
    const loadData = async () => {
      try {
        const data = await fetchUsageData()
        if (data?.usage) {
          setUsageData(data)
        }
      } catch (error) {
        console.error("Failed to fetch usage data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSaveKnowledgeLevel = async () => {
    const response = await updateProfile(selectedKnowledgeLevel)
    console.log(response, selectedKnowledgeLevel)
    if (response) {
      alert(response.message)
    }
  }

  const fetchUsageData = async () => {
    const usage = await getProfileUsageData()
    return usage
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-FR", { year: "numeric", month: "long" })
  }

  const chartData = Array.isArray(usageData?.usage)
    ? usageData.usage.map((item: ProfileUsage) => ({
      month: formatDate(item.month),
      messages: item.total_messages,
      documents: item.total_docs,
      reports: item.total_reports,
      credits: item.used_credits,
    }))
    : [];

  const displayData = chartData.length > 0 ? chartData : [{ month: "No Data", messages: 0, documents: 0, reports: 0, credits: 0 }];

  const CreditCircle = ({ percentage }: { percentage: number }) => {
    const validPercentage = Math.min(Math.max(percentage, 0), 100); // Assurer que le pourcentage est entre 0 et 100

    // Définition de la couleur en fonction du pourcentage
    let strokeColor = "#22c55e"; // Vert par défaut
    if (validPercentage < 20) strokeColor = "#ef4444"; // Rouge
    else if (validPercentage < 50) strokeColor = "#f97316"; // Orange
    else if (validPercentage < 80) strokeColor = "#3b82f6"; // Bleu

    // Définition du message en fonction du pourcentage
    let usageMessage = "Utilisation élevée";
    if (validPercentage < 20) usageMessage = "Faible utilisation";
    else if (validPercentage < 50) usageMessage = "Utilisation modérée";
    else if (validPercentage < 80) usageMessage = "Bonne utilisation";

    return (
      <div className="relative flex flex-col items-center justify-center space-y-2">
        <svg className="w-24 h-24" viewBox="0 0 100 100">
          {/* Cercle de fond */}
          <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
          {/* Cercle du pourcentage */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={`${(2 * Math.PI * 40 * validPercentage) / 100} ${2 * Math.PI * 40 * (1 - validPercentage / 100)}`}
            strokeDashoffset={2 * Math.PI * 40 * 0.25}
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dasharray 0.5s ease-in-out" }}
          />
          {/* Texte affichant le pourcentage */}
          <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="bold" fill="currentColor">
            {validPercentage}%
          </text>
        </svg>
        {/* Ajout d'un texte explicatif en dessous du cercle */}
        <span className="text-sm font-semibold text-gray-700">{usageMessage}</span>
      </div>
    );
  };


  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <User className="h-8 w-8" /> User Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Knowledge Level</h3>
                <RadioGroup value={selectedKnowledgeLevel} onValueChange={setSelectedKnowledgeLevel} className="space-y-3">
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
              Save Preferences
            </Button>
          </CardFooter>
        </Card>

        {/* Usage Statistics Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> Usage Statistics
            </CardTitle>
            <CardDescription>View your platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chart">Chart View</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              <TabsContent value="chart" className="pt-4">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="messages" fill="#8884d8" name="Messages" />
                      <Bar dataKey="documents" fill="#82ca9d" name="Documents" />
                      <Bar dataKey="reports" fill="#ffc658" name="Reports" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="summary">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" /> Total Messages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{displayData[0]?.messages || 0}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Total Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{displayData[0]?.documents || 0}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" /> Total Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{displayData[0]?.reports || 0}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Last Active
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-medium">{displayData[0]?.month || "March 2025"}</p>
                    </CardContent>
                  </Card>
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <CreditCard className="h-4 w-4" /> Credits Usage
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Used Credits</span>
                          <span className="text-sm font-medium">{displayData[0]?.credits || 0}</span>
                        </div>
                        <Progress value={displayData[0]?.credits || 0} className="h-4" />

                        <div className="grid grid-cols-3 gap-4 mt-6">
                          <CreditCircle percentage={Math.min(usageData?.usage[0]?.used_credits ?? 0, 100)} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}