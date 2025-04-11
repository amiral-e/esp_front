import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, MessageSquareText, FileText, PieChart, Shield, Zap, ArrowRight, ChevronRight, LibraryBig, BotMessageSquare, SquareTerminal, UserRoundCog } from "lucide-react"
import FeatureCard from "./components/feature-card"
import ChatDemo from "./components/chat-demo"
import { cookies } from "next/headers"
import { isAdministrator, signOutAction } from "./actions"
import { ThemeToggle } from "./components/theme-toggle"

export default async function LandingPage() {
  const cookieStore = cookies()
  const token = (await cookieStore).get("auth_token")?.value ?? null
  const isAuthenticated = !!token
  const isAdmin = isAuthenticated ? await isAdministrator() : false

  // Navigation items for authenticated users
  const navItems = [
    {
      icon: <LibraryBig className="size-4" />,
      name: "Collections",
      href: "/protected/collections/",
    },
    {
      icon: <BotMessageSquare className="size-4" />,
      name: "Chat",
      href: "/protected/chat/",
    },
    {
      icon: <SquareTerminal className="size-4" />,
      name: "Admin",
      href: "/protected/admin/",
      adminOnly: true,
    },
    {
      icon: <UserRoundCog className="size-4" />,
      name: "Profile",
      href: "/protected/profile/",
    },
  ]

  // Filter out admin routes if user is not an admin
  const filteredNavItems = navItems.filter((item) => !item.adminOnly || isAdmin)

  if (isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">ComptaCompanion IA</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="outline" asChild>
                <Link onClick={signOutAction} href={""}>Déconnexion</Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-1">

          <main className="flex-1 p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Bienvenue sur ComptaCompanion IA</h1>

              <div className={`grid ${isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-6 mb-10`}>
                {filteredNavItems.map((item, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <Link href={item.href} className="flex flex-col items-center text-center gap-4">
                        <div className="bg-secondary p-3 rounded-full">{item.icon}</div>
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        <p className="text-muted-foreground text-sm">
                          {item.name === "Collections" && "Gérez et organisez vos documents financiers"}
                          {item.name === "Chat" && "Discutez avec notre IA pour analyser vos finances"}
                          {item.name === "Admin" && "Accédez aux fonctionnalités d'administration"}
                          {item.name === "Profile" && "Gérez vos informations personnelles"}
                        </p>
                        <Button variant="outline" className="mt-2">
                          Accéder <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-secondary/50 rounded-lg p-6 mb-10">
                <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
                <p className="text-muted-foreground">
                  Vous n'avez pas encore d'activité récente. Commencez par explorer les différentes sections de
                  l'application.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Besoin d'aide ?</h2>
                <p className="text-muted-foreground mb-4">
                  Notre équipe de support est disponible pour vous aider à tirer le meilleur parti de ComptaCompanion
                  IA.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/protected/support">Contacter le support</Link>
                </Button>
              </div>
            </div>
            <br />
            <section id="how-it-works" className="w-full py-6 md:py-6 bg-muted/30">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-fit mx-auto bg-primary/10 text-primary border-primary/20">
                      Processus Simple
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      Comment fonctionne ComptaCompanion
                    </h2>
                    <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
                      Commencez en quelques minutes avec notre plateforme facile à utiliser
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  <Card className="border-none shadow-md bg-background">
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <span className="text-2xl font-bold text-primary">1</span>
                      </div>
                      <h3 className="text-xl font-bold">Téléchargez vos documents</h3>
                      <p className="text-muted-foreground">
                        Glissez-déposez vos documents financiers ou connectez-vous à votre logiciel comptable.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-md bg-background">
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <span className="text-2xl font-bold text-primary">2</span>
                      </div>
                      <h3 className="text-xl font-bold">L'IA traite tout</h3>
                      <p className="text-muted-foreground">
                        Notre IA analyse vos documents, extrait les informations clés et se prépare à répondre à vos
                        questions.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-md bg-background">
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <span className="text-2xl font-bold text-primary">3</span>
                      </div>
                      <h3 className="text-xl font-bold">Chattez et obtenez des réponses</h3>
                      <p className="text-muted-foreground">
                        Posez des questions en langage naturel et recevez des réponses instantanées et précises sur vos
                        finances.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-12 text-center">
                  <Button size="lg" asChild>
                    <Link href="/protected/chat">
                      Essayez maintenant <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
            <footer className="border-t bg-muted/40">
              <div className="container flex flex-col gap-6 py-8 md:py-12 px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                  <div className="flex items-center gap-2">
                    <MessageSquareText className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">ComptaCompanion</span>
                  </div>
                  <nav className="flex gap-4 md:gap-6 flex-wrap">
                    <Link href="#features" className="text-sm hover:underline underline-offset-4">
                      Fonctionnalités
                    </Link>
                    <Link href="#how-it-works" className="text-sm hover:underline underline-offset-4">
                      Comment ça marche
                    </Link>
                    <Link href="#pricing" className="text-sm hover:underline underline-offset-4">
                      Tarifs
                    </Link>
                    <Link href="#faq" className="text-sm hover:underline underline-offset-4">
                      FAQ
                    </Link>
                    <Link href="/privacy" className="text-sm hover:underline underline-offset-4">
                      Confidentialité
                    </Link>
                    <Link href="/terms" className="text-sm hover:underline underline-offset-4">
                      Conditions
                    </Link>
                  </nav>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} ComptaCompanion. Tous droits réservés.
                  </p>
                  <div className="flex gap-4">
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                      <span className="sr-only">Facebook</span>
                    </Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                      <span className="sr-only">Twitter</span>
                    </Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                      </svg>
                      <span className="sr-only">Instagram</span>
                    </Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect width="4" height="12" x="2" y="9"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                      <span className="sr-only">LinkedIn</span>
                    </Link>
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ComptaCompanion</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Fonctionnalités
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              Comment ça marche
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Tarifs
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:underline underline-offset-4">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link href="/sign-in">Connexion</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Inscription</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="w-fit bg-primary/10 text-primary border-primary/20">
                    Assistant Financier Propulsé par l'IA
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Simplifiez vos documents financiers avec l'IA
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Téléchargez vos documents financiers et obtenez des réponses instantanées, des analyses et de l'aide
                    grâce à notre chat intelligent.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" asChild>
                    <Link href="/sign-up">
                      Commencer gratuitement <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#how-it-works">Voir comment ça marche</Link>
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Sans carte bancaire</span>
                  <span className="mx-2">•</span>
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Version gratuite disponible</span>
                  <span className="mx-2">•</span>
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Sécurité niveau bancaire</span>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 w-full max-w-[500px] rounded-lg border bg-background p-2 shadow-lg">
                <ChatDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline" className="w-fit mx-auto bg-primary/10 text-primary border-primary/20">
                  Fonctionnalités Puissantes
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Tout ce dont vous avez besoin pour gérer vos documents financiers
                </h2>
                <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
                  Notre assistant IA vous aide à comprendre, organiser et extraire des informations de vos documents
                  financiers.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <FeatureCard
                icon={<MessageSquareText className="h-8 w-8 text-primary" />}
                title="Assistant IA par Chat"
                description="Posez des questions sur vos documents financiers en langage naturel et obtenez des réponses précises instantanément."
              />
              <FeatureCard
                icon={<FileText className="h-8 w-8 text-primary" />}
                title="Analyse de Documents"
                description="Téléchargez factures, relevés et documents fiscaux pour une analyse automatique et extraction de données."
              />
              <FeatureCard
                icon={<PieChart className="h-8 w-8 text-primary" />}
                title="Insights Financiers"
                description="Obtenez des analyses personnalisées, tendances et recommandations basées sur vos données financières."
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8 text-primary" />}
                title="Sécurisé & Confidentiel"
                description="Chiffrement niveau bancaire et contrôles de confidentialité pour protéger vos données financières."
              />
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-primary" />}
                title="Traitement Instantané"
                description="Traitez vos documents en quelques secondes grâce à notre technologie IA avancée pour une assistance immédiate."
              />
              <FeatureCard
                icon={<CheckCircle className="h-8 w-8 text-primary" />}
                title="Vérification de Conformité"
                description="Vérifiez automatiquement la conformité avec les normes comptables et réglementations fiscales."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline" className="w-fit mx-auto bg-primary/10 text-primary border-primary/20">
                  Processus Simple
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Comment fonctionne ComptaCompanion
                </h2>
                <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
                  Commencez en quelques minutes avec notre plateforme facile à utiliser
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <Card className="border-none shadow-md bg-background">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-xl font-bold">Téléchargez vos documents</h3>
                  <p className="text-muted-foreground">
                    Glissez-déposez vos documents financiers ou connectez-vous à votre logiciel comptable.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md bg-background">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-xl font-bold">L'IA traite tout</h3>
                  <p className="text-muted-foreground">
                    Notre IA analyse vos documents, extrait les informations clés et se prépare à répondre à vos
                    questions.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md bg-background">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-xl font-bold">Chattez et obtenez des réponses</h3>
                  <p className="text-muted-foreground">
                    Posez des questions en langage naturel et recevez des réponses instantanées et précises sur vos
                    finances.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-12 text-center">
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  Essayez maintenant <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col gap-6 py-8 md:py-12 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">ComptaCompanion</span>
            </div>
            <nav className="flex gap-4 md:gap-6 flex-wrap">
              <Link href="#features" className="text-sm hover:underline underline-offset-4">
                Fonctionnalités
              </Link>
              <Link href="#how-it-works" className="text-sm hover:underline underline-offset-4">
                Comment ça marche
              </Link>
              <Link href="#pricing" className="text-sm hover:underline underline-offset-4">
                Tarifs
              </Link>
              <Link href="#faq" className="text-sm hover:underline underline-offset-4">
                FAQ
              </Link>
              <Link href="/privacy" className="text-sm hover:underline underline-offset-4">
                Confidentialité
              </Link>
              <Link href="/terms" className="text-sm hover:underline underline-offset-4">
                Conditions
              </Link>
            </nav>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ComptaCompanion. Tous droits réservés.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

