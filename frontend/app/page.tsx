import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to the buyer page as the default landing page
  redirect("/buyer")
}

