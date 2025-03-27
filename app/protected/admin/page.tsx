"use client"

import { useState, useEffect } from "react"
import { Search, MoreHorizontal, UserPlus, UserMinus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getAllUsers, getAdmins, addAdmin, removeAdmin, type User } from "@/app/actions"

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [admins, setAdmins] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [actionType, setActionType] = useState<"promote" | "demote" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  // Récupération des utilisateurs et des administrateurs lors du montage du composant
  useEffect(() => {
    fetchUsers()
    fetchAdmins()
  }, [])

  const fetchUsers = async () => {
    try {
      const userData = await getAllUsers()
      setUsers(userData)
    } catch (error) {
      toast({
        title: "Erreur lors de la récupération des utilisateurs",
        description: "Il y a eu un problème lors du chargement de la liste des utilisateurs.",
        variant: "destructive",
      })
    }
  }

  const fetchAdmins = async () => {
    try {
      const adminData = await getAdmins()
      setAdmins(adminData)
    } catch (error) {
      toast({
        title: "Erreur lors de la récupération des administrateurs",
        description: "Il y a eu un problème lors du chargement de la liste des administrateurs.",
        variant: "destructive",
      })
    }
  }

  const handlePromoteToAdmin = async () => {
    if (!selectedUser) return

    setIsLoading(true)
    try {
      await addAdmin(selectedUser.uid)

      // Mise à jour de l'état local
      setUsers(users.filter((user) => user.uid !== selectedUser.uid))
      setAdmins([...admins, selectedUser])

      toast({
        title: "Utilisateur promu",
        description: `${selectedUser.email} est maintenant un administrateur`,
      })
    } catch (error) {
      toast({
        title: "Erreur lors de la promotion de l'utilisateur",
        description: "Il y a eu un problème pour faire de cet utilisateur un administrateur.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsConfirmDialogOpen(false)
      setSelectedUser(null)
      setActionType(null)
    }
  }

  const handleDemoteFromAdmin = async () => {
    if (!selectedUser) return

    setIsLoading(true)
    try {
      await removeAdmin(selectedUser.uid)

      // Mise à jour de l'état local
      setAdmins(admins.filter((admin) => admin.uid !== selectedUser.uid))
      setUsers([...users, selectedUser])

      toast({
        title: "Administrateur rétrogradé",
        description: `${selectedUser.email} est maintenant un utilisateur classique`,
      })
    } catch (error) {
      toast({
        title: "Erreur lors de la rétrogradation de l'administrateur",
        description: "Il y a eu un problème lors de la suppression des privilèges d'administrateur.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsConfirmDialogOpen(false)
      setSelectedUser(null)
      setActionType(null)
    }
  }

  const openConfirmDialog = (user: User, action: "promote" | "demote") => {
    setSelectedUser(user)
    setActionType(action)
    setIsConfirmDialogOpen(true)
  }

  const filteredUsers = users.filter((user) => user.email.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredAdmins = admins.filter((admin) => admin.email.toLowerCase().includes(searchQuery.toLowerCase()))

  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(filteredUsers.length / pageSize)

  const adminPage = useState(1)[0] // Nous utilisons une approche plus simple pour les administrateurs
  const paginatedAdmins = filteredAdmins.slice((adminPage - 1) * pageSize, adminPage * pageSize)
  const totalAdminPages = Math.ceil(filteredAdmins.length / pageSize)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord Administrateur</h1>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher des utilisateurs et des administrateurs..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader className="p-4 pb-0">
          <Tabs defaultValue="users">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users">Utilisateurs ({filteredUsers.length})</TabsTrigger>
              <TabsTrigger value="admins">Administrateurs ({filteredAdmins.length})</TabsTrigger>
            </TabsList>

            <CardContent className="p-4 pt-6">
              <TabsContent value="users" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>UID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          Aucun utilisateur trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedUsers.map((user) => (
                        <TableRow key={user.uid}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{user.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>{user.uid}</div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Ouvrir le menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openConfirmDialog(user, "promote")}>
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Promouvoir en Admin
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                {filteredUsers.length > 0 && (
                  <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((page) => Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      Précédent
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Page {page} sur {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((page) => Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="admins" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admin</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAdmins.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          Aucun administrateur trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedAdmins.map((admin) => (
                        <TableRow key={admin.uid}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{admin.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                Admin
                                <Badge variant="secondary" className="ml-2">
                                  Admin
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Ouvrir le menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openConfirmDialog(admin, "demote")}>
                                  <UserMinus className="mr-2 h-4 w-4" />
                                  Retirer Admin
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                {filteredAdmins.length > 0 && (
                  <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((page) => Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      Précédent
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Page {page} sur {totalAdminPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((page) => Math.min(totalAdminPages, page + 1))}
                      disabled={page === totalAdminPages}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === "promote" ? "Promouvoir en Admin" : "Retirer les privilèges d'Admin"}</DialogTitle>
            <DialogDescription>
              {actionType === "promote"
                ? `Êtes-vous sûr de vouloir faire de ${selectedUser?.email} un administrateur ? Il aura un accès complet à l'administration.`
                : `Êtes-vous sûr de vouloir retirer les privilèges d'administrateur à ${selectedUser?.email} ?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)} disabled={isLoading}>
              Annuler
            </Button>
            <Button
              onClick={actionType === "promote" ? handlePromoteToAdmin : handleDemoteFromAdmin}
              disabled={isLoading}
              variant={actionType === "promote" ? "default" : "destructive"}
            >
              {isLoading ? "En cours..." : actionType === "promote" ? "Confirmer la promotion" : "Confirmer la suppression"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}