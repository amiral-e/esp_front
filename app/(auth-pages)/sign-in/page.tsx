import Link from "next/link"
import { signInAction } from "@/actions/oauth"
import { FormMessage, type Message } from "@/components/form-message"
import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { GithubSSO } from "@/components/github-sso"
import { ArrowRight, CheckCircle, LockKeyhole, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { toast } from "react-toastify"
import SignIn from "./_components/sign_in"

export default async function Login(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams

  return (
    <SignIn searchParams={searchParams} />
  )
}