import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, GraduationCap, ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const portalOptions = [
  {
    title: "Command Center",
    description: "IT department & admin dashboard — monitor classrooms, manage resources, view analytics and system activity.",
    icon: LayoutDashboard,
    accent: "from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10",
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    border: "hover:border-blue-500/40",
    path: "/command-center",
    badge: "IT / Admin",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  {
    title: "Start a Class",
    description: "Teachers can start a class session, generate an attendance code, and allow students to mark their presence.",
    icon: GraduationCap,
    accent: "from-emerald-500/20 to-green-500/20 dark:from-emerald-500/10 dark:to-green-500/10",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    border: "hover:border-emerald-500/40",
    path: "/start-class",
    badge: "Teacher",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
];

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <BookOpen className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Smart Classroom</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          IET DAVV — Intelligent Learning Environment Management System
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 w-full">
        {portalOptions.map((option, i) => (
          <motion.div
            key={option.path}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 * (i + 1) }}
          >
            <Link to={option.path} className="block group">
              <Card className={`relative overflow-hidden border-2 transition-all duration-300 ${option.border} hover:shadow-xl cursor-pointer h-full`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${option.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <CardHeader className="relative pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${option.iconBg}`}>
                      <option.icon className="h-6 w-6" />
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${option.badgeColor}`}>
                      {option.badge}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative pt-0">
                  <div className="flex items-center text-sm font-medium text-primary gap-2 group-hover:gap-3 transition-all">
                    Continue
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
