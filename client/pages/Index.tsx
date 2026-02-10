import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Zap, 
  DoorOpen, 
  ShieldCheck, 
  AlertTriangle, 
  Info,
  Power,
  TrendingUp,
  X
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
  Cell
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock Data
const attendanceData = [
  { day: "Mon", r101: 38, r102: 40, r103: 35, r104: 39, r105: 37 },
  { day: "Tue", r101: 40, r102: 38, r103: 32, r104: 40, r105: 35 },
  { day: "Wed", r101: 35, r102: 39, r103: 38, r104: 37, r105: 40 },
  { day: "Thu", r101: 39, r102: 35, r103: 40, r104: 38, r105: 36 },
  { day: "Fri", r101: 37, r102: 37, r103: 39, r104: 35, r105: 38 },
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

const classrooms = [
  { id: "101", name: "Room 101", status: "Active", students: 38, resources: { projector: true, ac: true, light: true } },
  { id: "102", name: "Room 102", status: "Active", students: 40, resources: { projector: true, ac: true, light: true } },
  { id: "103", name: "Room 103", status: "Anomaly", students: 0, resources: { projector: true, ac: false, light: true }, alert: "Projector running outside hours" },
  { id: "104", name: "Room 104", status: "Active", students: 39, resources: { projector: true, ac: true, light: true } },
  { id: "105", name: "Room 105", status: "Active", students: 37, resources: { projector: false, ac: false, light: true } },
];

export default function Index() {
  const [energySaved, setEnergySaved] = useState(1240);
  const [rooms, setRooms] = useState(classrooms);
  const [showGuide, setShowGuide] = useState(false);

  const toggleResource = (roomId: string, resource: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        const newState = !room.resources[resource as keyof typeof room.resources];
        if (!newState) {
          // If turning off, increment energy saved
          setEnergySaved(s => s + 5);
        }
        return {
          ...room,
          resources: { ...room.resources, [resource]: newState },
          status: room.id === "103" && resource === "projector" && !newState ? "Active" : room.status,
          alert: room.id === "103" && resource === "projector" && !newState ? undefined : room.alert
        };
      }
      return room;
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header with Title and Guide Toggle */}
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

      {/* Pulse Row */}
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

      {/* Data Visualization Core */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Attendance Heatmap Density */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Attendance Density Heatmap
            </CardTitle>
            <CardDescription>Classroom population distribution across the work week</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="r101" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 0, 0]} opacity={0.9} />
                <Bar dataKey="r102" stackId="a" fill="hsl(var(--primary))" opacity={0.7} />
                <Bar dataKey="r103" stackId="a" fill="hsl(var(--primary))" opacity={0.5} />
                <Bar dataKey="r104" stackId="a" fill="hsl(var(--primary))" opacity={0.3} />
                <Bar dataKey="r105" stackId="a" fill="hsl(var(--primary))" opacity={0.1} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resource Utilization Radar */}
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

        {/* Peak Power Graph */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Peak Power Management
            </CardTitle>
            <CardDescription>Real-time energy consumption and automated peak shaving</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
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
          </CardContent>
        </Card>
      </div>

      {/* Resource Tracker Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Resource Tracker</h2>
          <Badge variant="outline" className="gap-1 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Live Hardware Feed
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card key={room.id} className={cn(
              "overflow-hidden transition-all hover:shadow-md",
              room.status === "Anomaly" ? "border-destructive/50 ring-1 ring-destructive/20" : ""
            )}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                  <Badge variant={room.status === "Anomaly" ? "destructive" : "secondary"}>
                    {room.status}
                  </Badge>
                </div>
                <CardDescription>{room.students} Students present</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {room.alert && (
                  <div className="flex items-center gap-2 p-2 rounded-md bg-destructive/10 text-destructive text-xs font-semibold">
                    <AlertTriangle className="h-3 w-3" />
                    {room.alert}
                  </div>
                )}
                <div className="space-y-3">
                  <ResourceToggle 
                    label="Projector" 
                    isActive={room.resources.projector} 
                    onToggle={() => toggleResource(room.id, "projector")}
                  />
                  <ResourceToggle 
                    label="Air Conditioning" 
                    isActive={room.resources.ac} 
                    onToggle={() => toggleResource(room.id, "ac")}
                  />
                  <ResourceToggle 
                    label="Smart Lighting" 
                    isActive={room.resources.light} 
                    onToggle={() => toggleResource(room.id, "light")}
                  />
                </div>
                {room.status === "Anomaly" && (
                  <Button 
                    variant="destructive" 
                    className="w-full mt-2"
                    onClick={() => toggleResource(room.id, "projector")}
                  >
                    Force Shutdown
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Demo Guide Overlay */}
      <AnimatePresence>
        {showGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
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
                    description="The authorized Wi-Fi requirement ensures students are physically present. The system cross-references IP leases with student IDs."
                  />
                  <GuideItem 
                    title="Hardware Integration" 
                    description="Cloud backend integrates the central timetable with hardware power states. Projectors and ACs are automatically gated by class schedules."
                  />
                  <GuideItem 
                    title="Peak Power Shaving" 
                    description="AI-driven optimization reduces energy spikes by staggering appliance start times across the 5 demonstration rooms."
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
      {/* Decorative pulse effect */}
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

function ResourceToggle({ label, isActive, onToggle }: { label: string, isActive: boolean, onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <Switch checked={isActive} onCheckedChange={onToggle} />
    </div>
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
