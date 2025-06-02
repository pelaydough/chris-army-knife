import { Menu } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

export function NavSheet({
  routes,
}: {
  routes: { path: string; title: string }[];
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="focus:outline-none cursor-pointer"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-dark-700 border-r-0" side="left">
        <SheetHeader>
          <SheetTitle>Tools</SheetTitle>
        </SheetHeader>
        {routes.map((route) => (
          <SheetClose asChild key={route.path}>
            <Link href={route.path} className="pb-4 pl-4">
              {route.title}
            </Link>
          </SheetClose>
        ))}
      </SheetContent>
    </Sheet>
  );
}
