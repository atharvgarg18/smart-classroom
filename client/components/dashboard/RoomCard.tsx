import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Room } from "@shared/types";

interface RoomCardProps {
  room: Room;
  onToggleResource: (roomId: string, resource: string) => void;
  onClick: (room: Room) => void;
}

export function RoomCard({ room, onToggleResource, onClick }: RoomCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-lg cursor-pointer group",
        room.status === "Anomaly" ? "border-destructive/50 ring-1 ring-destructive/20" : ""
      )}
      onClick={() => onClick(room)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">{room.name}</CardTitle>
          <Badge variant={room.status === "Anomaly" ? "destructive" : "secondary"}>
            {room.status}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {room.studentsCount} / {room.totalCapacity} Students present
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4" onClick={(e) => e.stopPropagation()}>
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
            onToggle={() => onToggleResource(room.id, "projector")}
          />
          <ResourceToggle 
            label="Air Conditioning" 
            isActive={room.resources.ac} 
            onToggle={() => onToggleResource(room.id, "ac")}
          />
          <ResourceToggle 
            label="Smart Lighting" 
            isActive={room.resources.light} 
            onToggle={() => onToggleResource(room.id, "light")}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ResourceToggle({ label, isActive, onToggle }: { label: string, isActive: boolean, onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <Switch 
        checked={isActive} 
        onCheckedChange={(e) => {
          onToggle();
        }} 
      />
    </div>
  );
}
