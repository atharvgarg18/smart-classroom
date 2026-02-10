import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Wifi, Bluetooth, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Attendance() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "success">("idle");
  const [step, setStep] = useState(0);

  const steps = [
    { icon: Wifi, label: "Checking Campus Wi-Fi..." },
    { icon: Bluetooth, label: "Scanning Bluetooth Beacon..." },
    { icon: ShieldCheck, label: "Verifying Identity..." }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    
    setStatus("verifying");
    setStep(0);
  };

  useEffect(() => {
    if (status === "verifying") {
      const timer = setInterval(() => {
        setStep((s) => {
          if (s >= steps.length - 1) {
            clearInterval(timer);
            setTimeout(() => setStatus("success"), 500);
            return s;
          }
          return s + 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Attendance Portal</CardTitle>
                <CardDescription>
                  Enter the 6-digit session code provided by your instructor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex justify-center">
                    <Input
                      type="text"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="0 0 0 0 0 0"
                      className="text-center text-3xl font-black tracking-[1em] h-16 w-full max-w-[280px]"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold"
                    disabled={code.length !== 6}
                  >
                    Mark Attendance
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {status === "verifying" && (() => {
          const StepIcon = steps[step]?.icon;
          return (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center space-y-8 py-12"
            >
              <div className="relative flex items-center justify-center">
                <Loader2 className="h-24 w-24 text-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {StepIcon && <StepIcon className="h-10 w-10 text-primary" />}
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">
                  {steps[step]?.label}
                </h2>
                <p className="text-muted-foreground text-sm">
                  Please stay close to the classroom beacon
                </p>
              </div>
            </motion.div>
          );
        })()}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-12"
          >
            <div className="flex justify-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-full">
                <CheckCircle2 className="h-24 w-24 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Attendance Verified!</h2>
              <p className="text-muted-foreground">
                Your presence has been successfully recorded for Room 101.
              </p>
            </div>
            <Button variant="outline" onClick={() => { setStatus("idle"); setCode(""); }}>
              Done
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
