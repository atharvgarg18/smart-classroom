export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container flex h-14 items-center justify-between text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} IET DAVV. All rights reserved.</p>
        <p>Student Attendance System</p>
      </div>
    </footer>
  );
}
