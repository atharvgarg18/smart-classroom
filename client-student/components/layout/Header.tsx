import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "@shared-ui/components/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none">IET DAVV</span>
            <span className="text-xs text-muted-foreground">Student Portal</span>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
