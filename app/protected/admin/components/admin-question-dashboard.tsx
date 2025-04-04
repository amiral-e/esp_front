"use client"

import { useState, useEffect } from "react"
import { Search, Edit, Trash, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  getPredifinedQuestions,
  createPredifinedQuestion,
  modifyPredifinedQuestions,
  deletePredifinedQuestion,
} from "@/app/actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Question {
  id: number
  question: string
  level: string
}

export default function QuestionsDashboard() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [newQuestion, setNewQuestion] = useState("")
  const [newLevel, setNewLevel] = useState("facile")
  const { toast } = useToast()

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    setIsLoading(true)
    try {
      const questionData = await getPredifinedQuestions()
      console.log("Fetched questions:", questionData)
      setQuestions(questionData)
    } catch (error) {
      toast({
        title: "Erreur lors de la récupération des questions",
        description: "Il y a eu un problème lors du chargement des questions prédéfinies.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) {
      toast({
        title: "Erreur",
        description: "Le texte de la question ne peut pas être vide.",
        variant: "destructive",
      })
      return
    }

    try {
      const message = await createPredifinedQuestion(newQuestion, newLevel)

      // Refresh the questions list
      await fetchQuestions()

      toast({
        title: "Question ajoutée",
        description: message || "La question a été ajoutée avec succès.",
      })

      // Reset form and close dialog
      setNewQuestion("")
      setNewLevel("facile")
      setIsAddDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erreur lors de l'ajout de la question",
        description: "Il y a eu un problème lors de l'ajout de la question.",
        variant: "destructive",
      })
    }
  }

  const handleEditQuestion = async () => {
    if (!selectedQuestion) return

    if (!newQuestion.trim()) {
      toast({
        title: "Erreur",
        description: "Le texte de la question ne peut pas être vide.",
        variant: "destructive",
      })
      return
    }

    try {
      await modifyPredifinedQuestions(newQuestion, newLevel, selectedQuestion.id)

      // Update local state
      setQuestions(
        questions.map((q) => (q.id === selectedQuestion.id ? { ...q, question: newQuestion, level: newLevel } : q)),
      )

      toast({
        title: "Question modifiée",
        description: "La question a été modifiée avec succès.",
      })

      // Reset form and close dialog
      setSelectedQuestion(null)
      setNewQuestion("")
      setNewLevel("facile")
      setIsEditDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erreur lors de la modification de la question",
        description: "Il y a eu un problème lors de la modification de la question.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteQuestion = async () => {
    if (!selectedQuestion) return

    try {
      const message = await deletePredifinedQuestion(selectedQuestion.id)

      // Update local state
      setQuestions(questions.filter((q) => q.id !== selectedQuestion.id))

      toast({
        title: "Question supprimée",
        description: message || "La question a été supprimée avec succès.",
      })

      // Reset and close dialog
      setSelectedQuestion(null)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erreur lors de la suppression de la question",
        description: "Il y a eu un problème lors de la suppression de la question.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (question: Question) => {
    setSelectedQuestion(question)
    setNewQuestion(question.question)
    setNewLevel(question.level)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (question: Question) => {
    setSelectedQuestion(question)
    setIsDeleteDialogOpen(true)
  }

  const filteredQuestions = questions.filter(
    (question) =>
      question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.level.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Questions Prédéfinies</h1>
        <div className="flex gap-2">
          <Button onClick={fetchQuestions} variant="outline" disabled={isLoading}>
            {isLoading ? "Chargement..." : "Actualiser"}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Ajouter une question
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle question</DialogTitle>
                <DialogDescription>Créez une nouvelle question prédéfinie pour les utilisateurs.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    placeholder="Entrez le texte de la question..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="level">Niveau</Label>
                  <Select value={newLevel} onValueChange={setNewLevel}>
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Sélectionnez un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facile">Facile</SelectItem>
                      <SelectItem value="moyen">Moyen</SelectItem>
                      <SelectItem value="difficile">Difficile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddQuestion}>Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher des questions..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Questions Prédéfinies</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Chargement des questions...
                  </TableCell>
                </TableRow>
              ) : filteredQuestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Aucune question trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuestions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium">{question.id}</TableCell>
                    <TableCell className="max-w-md truncate">{question.question}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          question.level === "facile"
                            ? "bg-green-100 text-green-800"
                            : question.level === "moyen"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {question.level}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(question)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(question)}>
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la question</DialogTitle>
            <DialogDescription>Modifiez le texte ou le niveau de la question.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-question">Question</Label>
              <Textarea
                id="edit-question"
                placeholder="Entrez le texte de la question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-level">Niveau</Label>
              <Select value={newLevel} onValueChange={setNewLevel}>
                <SelectTrigger id="edit-level">
                  <SelectValue placeholder="Sélectionnez un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facile">Facile</SelectItem>
                  <SelectItem value="moyen">Moyen</SelectItem>
                  <SelectItem value="difficile">Difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditQuestion}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cette question sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuestion} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

