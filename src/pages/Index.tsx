import { Keyboard } from "lucide-react";
import { TypingTest } from "@/components/TypingTest";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-subtle pt-16">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <header className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/10 shadow-glow">
                <Keyboard className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                mytypingspeed
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Test your typing speed and accuracy with real-time feedback
            </p>
          </header>

          {/* Main Typing Test */}
          <main>
            <TypingTest />
          </main>

          {/* Footer */}
          <footer className="mt-16 text-center text-sm text-muted-foreground">
            <p>Practice daily to improve your typing skills</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Index;
