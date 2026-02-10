import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Zap,
  DoorOpen,
  ShieldCheck,
  Info,
  TrendingUp,
  X,
  History,
  Activity,
  ArrowRight,
  UserCheck
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { RoomCard } from "@/components/dashboard/RoomCard";
import { RoomDetails } from "@/components/dashboard/RoomDetails";
import { Room, Student, AttendanceRecord } from "@shared/types";

// Helper to generate mock attendance history
const generateHistory = (base: number, volatility: number = 5): AttendanceRecord[] => {
  return Array.from({ length: 30 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: Math.max(0, Math.min(40, base + Math.floor(Math.random() * volatility * 2) - volatility)),
      total: 40
    };
  });
};

// Helper to generate mock students
const generateStudents = (count: number, prefix: string): Student[] => {
  const names = ["Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Ishaan", "Reyansh", "Anaya", "Diya", "Sara", "Aria", "Kyra", "Zoya", "Myra"];
  return Array.from({ length: count }).map((_, i) => ({
    id: `${prefix}-${i}`,
    name: `${names[i % names.length]} ${String.fromCharCode(65 + (i % 26))}.`,
    rollNumber: `22IET${prefix}${String(i + 1).padStart(3, '0')}`,
    status: Math.random() > 0.1 ? "Present" : "Late",
    arrivalTime: `${Math.floor(Math.random() * 2) + 8}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} AM`
  }));
};

const initialRooms: Room[] = [
  {
    id: "101",
    name: "101 (CS-A)",
    status: "Active",
    studentsCount: 38,
    totalCapacity: 40,
    resources: { projector: true, ac: true, light: true },
    history: generateHistory(37),
    currentStudents: generateStudents(38, "101")
  },
  {
    id: "102",
    name: "102 (CS-B)",
    status: "Active",
    studentsCount: 40,
    totalCapacity: 40,
    resources: { projector: true, ac: true, light: true },
    history: generateHistory(38),
    currentStudents: generateStudents(40, "102")
  },
  {
    id: "103",
    name: "103 (IT-A)",
    status: "Anomaly",
    studentsCount: 0,
    totalCapacity: 40,
    resources: { projector: true, ac: false, light: true },
    alert: "Projector running outside hours",
    history: generateHistory(35),
    currentStudents: []
  },
  {
    id: "104",
    name: "104 (IT-B)",
    status: "Active",
    studentsCount: 39,
    totalCapacity: 40,
    resources: { projector: true, ac: true, light: true },
    history: generateHistory(36),
    currentStudents: generateStudents(39, "104")
  },
  {
    id: "105",
    name: "105 (Mech)",
    status: "Active",
    studentsCount: 37,
    totalCapacity: 40,
    resources: { projector: false, ac: false, light: true },
    history: generateHistory(35),
    currentStudents: generateStudents(37, "105")
  },
];

const resourceData = [
  { subject: 'Projectors', active: 85, idle: 15 },
  { subject: 'Computers', active: 65, idle: 35 },
  { subject: 'AC Units', active: 90, idle: 10 },
  { subject: 'Lighting', active: 100, idle: 0 },
  { subject: 'Sensors', active: 95, idle: 5 },
];

const powerUsageData = [
  { time: '08:00', usage: 120, baseline: 100 },
  { time: '10:00', usage: 350, baseline: 250 },
  { time: '12:00', usage: 480, baseline: 300 },
  { time: '14:00', usage: 420, baseline: 280 },
  { time: '16:00', usage: 200, baseline: 150 },
  { time: '18:00', usage: 80, baseline: 80 },
];

const activityLogs = [
  { id: 1, type: "Attendance", message: "Student 22IET101005 verified in 101 (CS-A)", time: "2 mins ago", icon: UserCheck },
  { id: 2, type: "Power", message: "HVAC auto-shutdown in 103 (IT-A) - Room empty", time: "15 mins ago", icon: Zap },
  { id: 3, type: "Security", message: "Unauthorized projector use detected in 103 (IT-A)", time: "45 mins ago", icon: ShieldCheck },
  { id: 4, type: "Network", message: "Campus Wi-Fi AP-04 load balancing active", time: "1 hour ago", icon: Activity },
  { id: 5, type: "Attendance", message: "Attendance session started for 105 (Mech)", time: "2 hours ago", icon: Users },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function CommandCenter() {
  const [energySaved, setEnergySaved] = useState(1240);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const toggleResource = (roomId: string, resource: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        const newState = !room.resources[resource as keyof typeof room.resources];
        if (!newState) {
          setEnergySaved(s => s + 5);
        }
        return {
          ...room,
          resources: { ...room.resources, [resource]: newState },
          status: room.id === "103" && resource === "projector" && !newState ? "Active" : room.status,
          alert: room.id === "103" && resource === "projector" && !newState ? undefined : room.alert
        } as Room;
      }
      return room;
    }));
  };

  const attendanceHeatmapData = [
    { day: "Mon", attendance: rooms.reduce((acc, r) => acc + r.history[r.history.length-5].count, 0) },
    { day: "Tue", attendance: rooms.reduce((acc, r) => acc + r.history[r.history.length-4].count, 0) },
    { day: "Wed", attendance: rooms.reduce((acc, r) => acc + r.history[r.history.length-3].count, 0) },
    { day: "Thu", attendance: rooms.reduce((acc, r) => acc + r.history[r.history.length-2].count, 0) },
    { day: "Fri", attendance: rooms.reduce((acc, r) => acc + r.history[r.history.length-1].count, 0) },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground">Intelligent Learning Environment Dashboard</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowGuide(true)}
          className="gap-2 self-start"
        >
          <Info className="h-4 w-4" />
          Demo Guide
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <PulseCard 
          title="Campus Presence" 
          value="88%" 
          icon={Users} 
          description="Live attendance across campus"
          trend="+2.5% from yesterday"
        />
        <PulseCard 
          title="Energy Saved" 
          value={`${energySaved}W`} 
          icon={Zap} 
          description="Total wattage saved today"
          trend="Automated optimization active"
          color="text-yellow-500"
        />
        <PulseCard 
          title="Active Rooms" 
          value="5/5" 
          icon={DoorOpen} 
          description="Rooms currently in session"
          trend="Capacity at 94%"
          color="text-blue-500"
        />
        <PulseCard 
          title="Hardware Health" 
          value="100%" 
          icon={ShieldCheck} 
          description="No unauthorized usage detected"
          trend="Security layer: Verified"
          color="text-green-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Attendance Density Heatmap
            </CardTitle>
            <CardDescription>Aggregate classroom population across the work week</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceHeatmapData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 200]} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="attendance" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.9} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Resource Utilization
            </CardTitle>
            <CardDescription>Active vs Idle time for campus assets</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={resourceData}>
                <PolarGrid strokeOpacity={0.1} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Utilization"
                  dataKey="active"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Peak Power Management
            </CardTitle>
            <CardDescription>Real-time energy consumption and automated peak shaving</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={powerUsageData}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="usage"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorUsage)"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="baseline"
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="5 5"
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-2 text-center lg:text-left">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Load Distribution</p>
                <div className="h-[150px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'HVAC', value: 45 },
                          { name: 'Computing', value: 30 },
                          { name: 'Lighting', value: 15 },
                          { name: 'Other', value: 10 },
                        ]}
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {COLORS.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">HVAC Optimization</span>
                  <span className="font-bold text-green-500">Active</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[85%]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Resource Tracker</h2>
              <p className="text-sm text-muted-foreground">Monitor and control hardware assets across classrooms</p>
            </div>
            <Badge variant="outline" className="gap-1 px-3 py-1 self-start">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live Hardware Feed
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onToggleResource={toggleResource}
                onClick={setSelectedRoom}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Activity
            </h2>
            <Button variant="ghost" size="sm" className="text-xs text-primary">View All</Button>
          </div>
          <Card className="h-[450px] shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <ScrollArea className="h-[450px] w-full">
                <div className="p-4 space-y-4">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex gap-4 p-3 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 transition-all cursor-default group">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-background border flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                        <log.icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 w-full">
                        <div className="flex items-center justify-between w-full">
                          <p className="text-xs font-bold uppercase tracking-wider text-primary">{log.type}</p>
                          <p className="text-[10px] text-muted-foreground">{log.time}</p>
                        </div>
                        <p className="text-sm font-medium leading-snug">{log.message}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full text-xs font-bold gap-2">
                    Reload Logs <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <RoomDetails 
        room={selectedRoom} 
        open={!!selectedRoom} 
        onOpenChange={(open) => !open && setSelectedRoom(null)} 
      />

      <AnimatePresence>
        {showGuide && (
          <div
            key="guide-overlay"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-card border shadow-2xl rounded-xl overflow-hidden"
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-4 top-4"
                onClick={() => setShowGuide(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Demo Guide: Smart Classroom Prototype</h2>
                  <p className="text-muted-foreground">Technical overview of the IET DAVV ecosystem</p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <GuideItem 
                    title="Wi-Fi Authentication" 
                    description="The authorized Wi-Fi requirement ensures students are physically present. The system cross-references IP leases with student IDs and Roll Numbers."
                  />
                  <GuideItem 
                    title="Hardware Integration" 
                    description="Cloud backend integrates the central timetable with hardware power states. Projectors and ACs are automatically gated by class schedules."
                  />
                  <GuideItem 
                    title="Comprehensive Analytics" 
                    description="Admins can click any room to view detailed historical data, including daily, weekly, and monthly trends with student-level verification lists."
                  />
                  <GuideItem 
                    title="Modular Architecture" 
                    description="Built using a micro-services approach, allowing IET DAVV to scale from 5 rooms to the entire campus without hardware overhead."
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={() => setShowGuide(false)}>Understood</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PulseCard({ title, value, icon: Icon, description, trend, color }: any) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", color || "text-muted-foreground")} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        <div className="mt-4 flex items-center text-xs font-semibold text-primary">
          <TrendingUp className="mr-1 h-3 w-3" />
          {trend}
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        />
      </div>
    </Card>
  );
}

function GuideItem({ title, description }: { title: string, description: string }) {
  return (
    <div className="space-y-1">
      <h3 className="font-bold text-primary">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
