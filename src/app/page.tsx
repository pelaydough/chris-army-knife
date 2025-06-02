import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-4xl">Hello.</h1>
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" className="font-mono">
            <Heart className="mr-2 h-4 w-4" />
            Shadcn + Lucide
          </Button>
        </div>
      </div>
    </div>
  );
}
