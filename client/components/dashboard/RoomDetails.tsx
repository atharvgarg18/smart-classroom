import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { Room } from "@shared/types";
import {
  Users,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  UserMinus,
  Activity
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RoomDetailsProps {
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoomDetails({ room, open, onOpenChange }: RoomDetailsProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!room || !mounted) return null;

  const todayAttendance = room.history[room.history.length - 1];
  const yesterdayAttendance = room.history[room.history.length - 2];
  const attendanceDiff = todayAttendance.count - yesterdayAttendance.count;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {room.name} Detailed Analytics
                <Badge variant={room.status === "Anomaly" ? "destructive" : "secondary"} className="ml-2">
                  {room.status}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Comprehensive attendance and resource optimization data
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden p-6 pt-2">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">Historical Trends</TabsTrigger>
              <TabsTrigger value="students">Live Presence</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="flex-1 space-y-6 overflow-y-auto pr-2">
              <div className="grid gap-4 md:grid-cols-3">
                <StatCard 
                  title="Present Today" 
                  value={`${todayAttendance.count}/${todayAttendance.total}`}
                  description="Students currently in room"
                  icon={UserCheck}
                  trend={attendanceDiff >= 0 ? "up" : "down"}
                  trendValue={`${Math.abs(attendanceDiff)} from yesterday`}
                />
                <StatCard 
                  title="Average Monthly" 
                  value="92%"
                  description="Overall attendance rate"
                  icon={Activity}
                  trend="up"
                  trendValue="1.2% this month"
                />
                <StatCard 
                  title="Peak Usage" 
                  value="11:30 AM"
                  description="Highest daily occupancy"
                  icon={Clock}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Last 7 Days Attendance
                  </h3>
                  <div className="h-[200px] w-full bg-muted/20 rounded-lg p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={room.history.slice(-7)}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={10} />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{fill: 'hsl(var(--primary))', opacity: 0.1}}
                          contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '12px' }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Occupancy Profile
                  </h3>
                  <div className="space-y-3">
                    <ProfileItem label="Today" percentage={(todayAttendance.count/todayAttendance.total) * 100} />
                    <ProfileItem label="Yesterday" percentage={(yesterdayAttendance.count/yesterdayAttendance.total) * 100} />
                    <ProfileItem label="Past Week" percentage={88} />
                    <ProfileItem label="Past Month" percentage={91} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="flex-1 overflow-hidden">
              <div className="h-full flex flex-col space-y-4">
                <h3 className="text-sm font-medium">Long-term Attendance Growth (Last 30 Days)</h3>
                <div className="flex-1 bg-muted/20 rounded-lg p-4 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={room.history}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={10} minTickGap={30} />
                      <YAxis axisLine={false} tickLine={false} fontSize={10} />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#colorCount)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="students" className="flex-1 overflow-hidden">
              <div className="flex flex-col h-full space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Verified Student List</h3>
                  <Badge variant="outline">{room.currentStudents.length} Verified</Badge>
                </div>
                <ScrollArea className="flex-1 border rounded-md">
                  <div className="p-4 space-y-2">
                    {room.currentStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold leading-none">{student.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{student.rollNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs font-medium">{student.arrivalTime}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Arrival</p>
                          </div>
                          <Badge variant={student.status === "Present" ? "default" : "outline"} className="text-[10px]">
                            {student.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatCard({ title, value, description, icon: Icon, trend, trendValue }: any) {
  return (
    <div className="p-4 rounded-xl bg-card border shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-[10px] text-muted-foreground">{description}</p>
      {trend && (
        <div className={cn(
          "flex items-center text-[10px] font-bold mt-1",
          trend === "up" ? "text-green-500" : "text-destructive"
        )}>
          {trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
          {trendValue}
        </div>
      )}
    </div>
  );
}

function ProfileItem({ label, percentage }: { label: string, percentage: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-1000" 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
}
