export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} IET DAVV - Smart Classroom Management System.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 text-xs font-medium text-destructive/80 animate-pulse uppercase tracking-wider">
          <span className="flex h-2 w-2 rounded-full bg-destructive" />
          Simulation Mode: Hardware/Network verification layers are represented via demo logic for this prototype
        </div>
      </div>
    </footer>
  );
}
