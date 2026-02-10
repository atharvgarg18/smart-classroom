import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared-ui/components/ui/card";
import { Input } from "@shared-ui/components/ui/input";
import { Button } from "@shared-ui/components/ui/button";
import { Label } from "@shared-ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared-ui/components/ui/select";
import { CheckCircle2, Loader2, Wifi, Bluetooth, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Attendance() {
  const [code, setCode] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "success">("idle");
  const [step, setStep] = useState(0);

  const steps = [
    { icon: Wifi, label: "Checking Campus Wi-Fi..." },
    { icon: Bluetooth, label: "Scanning Bluetooth Beacon..." },
    { icon: ShieldCheck, label: "Verifying Identity..." }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6 || !rollNumber.trim() || !roomNumber) return;

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
            <Card className="border-2 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Student Attendance Portal</CardTitle>
                <CardDescription>
                  Enter your details to record your attendance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rollNumber">Roll Number</Label>
                      <Input
                        id="rollNumber"
                        type="text"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                        placeholder="e.g. 21CS101"
                        className="text-lg font-semibold h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roomNumber">Room Number (Class)</Label>
                      <Select onValueChange={setRoomNumber} value={roomNumber}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select Classroom" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="101">101 (CS-A)</SelectItem>
                          <SelectItem value="102">102 (CS-B)</SelectItem>
                          <SelectItem value="103">103 (IT-A)</SelectItem>
                          <SelectItem value="104">104 (IT-B)</SelectItem>
                          <SelectItem value="105">105 (Mech)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">Session Code</Label>
                      <Input
                        id="code"
                        type="text"
                        value={code}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          if (val.length <= 6) setCode(val);
                        }}
                        placeholder="Enter 6-digit code"
                        className="text-center text-2xl font-bold tracking-widest h-14"
                        maxLength={6}
                        required
                      />
                      <p className="text-xs text-muted-foreground text-center">
                        Get the code from your instructor's screen
                      </p>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold"
                    disabled={code.length !== 6 || !rollNumber.trim() || !roomNumber}
                  >
                    Submit Attendance
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {status === "verifying" && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full"
          >
            <Card className="border-2 shadow-xl">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">Verifying...</CardTitle>
                <CardDescription>Please wait while we confirm your attendance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  const isActive = i === step;
                  const isDone = i < step;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.3 }}
                      className="flex items-center gap-4"
                    >
                      <div
                        className={`h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all ${
                          isDone
                            ? "bg-green-500 border-green-500 text-white"
                            : isActive
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-muted bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : isActive ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>
                      <span
                        className={`font-medium ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {s.label}
                      </span>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-full text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            >
              <div className="h-24 w-24 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Attendance Recorded!</h2>
              <p className="text-muted-foreground">
                Your presence has been successfully verified for Room {roomNumber}
              </p>
            </div>
            <Button
              onClick={() => {
                setStatus("idle");
                setCode("");
                setRollNumber("");
                setRoomNumber("");
              }}
              variant="outline"
              className="mt-6"
            >
              Submit Another
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
