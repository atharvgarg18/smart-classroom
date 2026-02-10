import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Clock,
  MapPin,
  Users,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  BookOpen,
  Timer,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// Mock schedule data — in production this would come from an API
const teachers = [
  { key: "dr-sharma", label: "Dr. Sharma" },
  { key: "prof-gupta", label: "Prof. Gupta" },
  { key: "dr-verma", label: "Dr. Verma" },
  { key: "prof-patel", label: "Prof. Patel" },
];

const teacherSchedules: Record<string, ScheduledClass[]> = {
  "dr-sharma": [
    { subject: "Data Structures", room: "101", section: "CS-A", time: "10:00 AM – 11:00 AM", students: 40 },
    { subject: "Algorithms", room: "102", section: "CS-B", time: "11:00 AM – 12:00 PM", students: 40 },
  ],
  "prof-gupta": [
    { subject: "Database Systems", room: "103", section: "IT-A", time: "09:00 AM – 10:00 AM", students: 40 },
    { subject: "Computer Networks", room: "104", section: "IT-B", time: "02:00 PM – 03:00 PM", students: 40 },
  ],
  "dr-verma": [
    { subject: "Engineering Mechanics", room: "105", section: "Mech", time: "10:00 AM – 11:00 AM", students: 37 },
  ],
  "prof-patel": [
    { subject: "Operating Systems", room: "101", section: "CS-A", time: "02:00 PM – 03:00 PM", students: 40 },
    { subject: "Operating Systems", room: "103", section: "IT-A", time: "03:00 PM – 04:00 PM", students: 40 },
  ],
};

interface ScheduledClass {
  subject: string;
  room: string;
  section: string;
  time: string;
  students: number;
}

interface ActiveSession {
  classInfo: ScheduledClass;
  code: string;
  startedAt: Date;
}

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function StartClass() {
  const [teacherName, setTeacherName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [schedule, setSchedule] = useState<ScheduledClass[]>([]);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [copied, setCopied] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Find schedule for teacher
  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName) return;

    const found = teacherSchedules[teacherName] || [];
    setSchedule(found);
    setSubmitted(true);
  };

  const selectedTeacherLabel = teachers.find(t => t.key === teacherName)?.label || teacherName;

  // Start a class session and generate code
  const handleStartClass = (classInfo: ScheduledClass) => {
    setActiveSession({
      classInfo,
      code: generateCode(),
      startedAt: new Date(),
    });
    setElapsed(0);
  };

  // Regenerate code
  const handleRegenerate = () => {
    if (!activeSession) return;
    setActiveSession({
      ...activeSession,
      code: generateCode(),
    });
    setCopied(false);
  };

  // Copy code to clipboard
  const handleCopy = useCallback(() => {
    if (!activeSession) return;
    navigator.clipboard.writeText(activeSession.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [activeSession]);

  // End session
  const handleEndSession = () => {
    setActiveSession(null);
    setElapsed(0);
  };

  // Timer
  useEffect(() => {
    if (!activeSession) return;
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - activeSession.startedAt.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeSession]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Reset to name entry
  const handleBack = () => {
    setSubmitted(false);
    setTeacherName("");
    setSchedule([]);
    setActiveSession(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <AnimatePresence mode="wait">
        {/* ─── Step 1: Teacher Name Entry ─── */}
        {!submitted && (
          <motion.div
            key="name-entry"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2 shadow-xl">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <GraduationCap className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">Start a Class</CardTitle>
                <CardDescription>
                  Select your name to view your scheduled classes for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLookup} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Select Teacher</Label>
                    <Select onValueChange={setTeacherName} value={teacherName}>
                      <SelectTrigger className="h-12 text-lg">
                        <SelectValue placeholder="Choose your name" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((t) => (
                          <SelectItem key={t.key} value={t.key}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={!teacherName}>
                    View My Schedule
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ─── Step 2: Schedule List ─── */}
        {submitted && !activeSession && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Welcome, <span className="text-primary">{selectedTeacherLabel}</span>
                </h2>
                <p className="text-muted-foreground text-sm">
                  {schedule.length > 0
                    ? `You have ${schedule.length} class${schedule.length > 1 ? "es" : ""} scheduled today`
                    : "No classes found for today"}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleBack}>
                Change Name
              </Button>
            </div>

            {schedule.length === 0 && (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
                  <p className="text-muted-foreground">
                    No scheduled classes found. Please check your name or contact the admin.
                  </p>
                </CardContent>
              </Card>
            )}

            {schedule.map((cls, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-2 hover:border-primary/30 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold">{cls.subject}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            Room {cls.room} ({cls.section})
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {cls.time}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            {cls.students} students
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleStartClass(cls)}
                        className="gap-2 shrink-0"
                      >
                        <GraduationCap className="h-4 w-4" />
                        Start Class
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ─── Step 3: Active Session with Code ─── */}
        {activeSession && (
          <motion.div
            key="active-session"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <Card className="border-2 border-emerald-500/30 shadow-xl">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 gap-1.5 px-3 py-1">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Session Active
                  </Badge>
                </div>
                <CardTitle className="text-xl">{activeSession.classInfo.subject}</CardTitle>
                <CardDescription>
                  Room {activeSession.classInfo.room} ({activeSession.classInfo.section}) · {activeSession.classInfo.time}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Attendance Code */}
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground font-medium">
                    Share this code with students to mark attendance
                  </p>
                  <div className="relative inline-block">
                    <div className="text-6xl md:text-7xl font-black tracking-[0.3em] text-primary font-mono py-6 px-8 bg-primary/5 rounded-2xl border-2 border-primary/20">
                      {activeSession.code}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCopy}
                    className="gap-2 w-full sm:w-auto"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Code
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRegenerate}
                    className="gap-2 w-full sm:w-auto"
                  >
                    <RefreshCw className="h-4 w-4" />
                    New Code
                  </Button>
                </div>

                {/* Timer */}
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Timer className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Session running for <span className="text-foreground font-bold">{formatTime(elapsed)}</span>
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* End Session */}
            <div className="flex justify-center">
              <Button
                variant="destructive"
                onClick={handleEndSession}
                className="gap-2"
              >
                End Session
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
