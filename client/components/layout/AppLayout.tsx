import { Header } from "./Header";
import { Footer } from "./Footer";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background transition-colors duration-300">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
