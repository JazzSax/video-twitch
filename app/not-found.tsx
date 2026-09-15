import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const NotFoundPage = () => {
  return (
    <div className="h-full flex flex-col space-y-4 items-center justify-center text-center text-muted-foreground pt-20">
      <h1 className="text-4xl">404</h1>
     
      <p className="text-sm">We couldn&apos;t find the page you were looking for.</p>
      <Link href="/" className={cn(buttonVariants({ variant: "secondary" }))}>Go back to the home page</Link>
    </div>
  )
}
export default NotFoundPage;