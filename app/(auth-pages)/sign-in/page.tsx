import SignIn from "./_components/sign_in"

export default async function Login(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams

  return (
    <SignIn searchParams={searchParams} />
  )
}