import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared-ui/components/ui/card";
import { LayoutDashboard, UserCheck, ArrowRight, ShieldCheck, Users } from "lucide-react";
import { Button } from "@shared-ui/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12 py-12">
      <div className="text-center space-y-4 max-w-2xl">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight"
        >
          Welcome to <span className="text-primary">IET DAVV</span> Smart Campus
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground"
        >
          Choose your destination to continue. Access the administrator dashboard for campus management or the student portal for attendance.
        </motion.p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 w-full max-w-4xl px-4">
        {/* Admin Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/admin" className="block group">
            <Card className="h-full border-2 transition-all hover:border-primary/50 hover:shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <LayoutDashboard size={120} />
              </div>
              <CardHeader className="relative">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold">Admin Command Center</CardTitle>
                <CardDescription>
                  For IT Department and Faculty. Monitor resource optimization, campus presence, and hardware health.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button className="w-full gap-2 group-hover:gap-3 transition-all">
                  Access Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* Student Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/attendance" className="block group">
            <Card className="h-full border-2 transition-all hover:border-primary/50 hover:shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <UserCheck size={120} />
              </div>
              <CardHeader className="relative">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold">Student Attendance Portal</CardTitle>
                <CardDescription>
                  For Students. Verify your presence in the classroom using session codes and campus network verification.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button variant="outline" className="w-full gap-2 group-hover:gap-3 transition-all border-primary text-primary hover:bg-primary/5">
                  Record Attendance <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-6 text-sm text-muted-foreground font-medium grayscale opacity-60"
      >
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          Hardware Verified
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          Cloud Synchronized
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
          End-to-End Encrypted
        </div>
      </motion.div>
    </div>
  );
}
