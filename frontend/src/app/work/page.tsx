import { redirect } from "next/navigation";

/** Legacy route — architecture content lives at /architecture */
export default function WorkRedirect() {
  redirect("/architecture");
}
