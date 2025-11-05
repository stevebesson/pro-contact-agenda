import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { format, differenceInHours, differenceInDays, isPast } from "date-fns";
import { fr } from "date-fns/locale";
import type { Appointment } from "@/types";
import { toast } from "@/hooks/use-toast";

interface AppointmentRemindersProps {
  appointments: Appointment[];
}

export const AppointmentReminders = ({ appointments }: AppointmentRemindersProps) => {
  const [shownReminders, setShownReminders] = useState<Set<string>>(new Set());

  useEffect(() => {
    const now = new Date();
    
    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.date);
      
      // Skip past appointments
      if (isPast(appointmentDate)) return;
      
      const hoursUntil = differenceInHours(appointmentDate, now);
      const daysUntil = differenceInDays(appointmentDate, now);
      
      // 2 days reminder
      if (
        appointment.reminder2Days &&
        daysUntil === 2 &&
        hoursUntil <= 48 &&
        hoursUntil >= 47 &&
        !shownReminders.has(`${appointment.id}-2days`)
      ) {
        toast({
          title: "Rappel : Rendez-vous dans 2 jours",
          description: `${appointment.title} - ${format(appointmentDate, "PPP 'à' HH:mm", { locale: fr })}`,
        });
        setShownReminders((prev) => new Set(prev).add(`${appointment.id}-2days`));
      }
      
      // 2 hours reminder
      if (
        appointment.reminder2Hours &&
        hoursUntil === 2 &&
        !shownReminders.has(`${appointment.id}-2hours`)
      ) {
        toast({
          title: "Rappel : Rendez-vous dans 2 heures",
          description: `${appointment.title} - ${format(appointmentDate, "PPP 'à' HH:mm", { locale: fr })}`,
        });
        setShownReminders((prev) => new Set(prev).add(`${appointment.id}-2hours`));
      }
    });
  }, [appointments, shownReminders]);

  // Get upcoming reminders
  const upcomingReminders = appointments
    .filter((apt) => {
      const appointmentDate = new Date(apt.date);
      if (isPast(appointmentDate)) return false;
      
      const hoursUntil = differenceInHours(appointmentDate, new Date());
      const daysUntil = differenceInDays(appointmentDate, new Date());
      
      return (
        (apt.reminder2Days && daysUntil <= 2) ||
        (apt.reminder2Hours && hoursUntil <= 2)
      );
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (upcomingReminders.length === 0) return null;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Rappels à venir
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingReminders.map((appointment) => {
          const appointmentDate = new Date(appointment.date);
          const hoursUntil = differenceInHours(appointmentDate, new Date());
          const daysUntil = differenceInDays(appointmentDate, new Date());
          
          let timeText = "";
          if (daysUntil >= 2) {
            timeText = "Dans 2 jours";
          } else if (hoursUntil >= 2) {
            timeText = "Dans 2 heures";
          } else if (hoursUntil >= 1) {
            timeText = `Dans ${hoursUntil} heure${hoursUntil > 1 ? 's' : ''}`;
          } else {
            timeText = "Bientôt";
          }
          
          return (
            <div
              key={appointment.id}
              className="p-3 rounded-lg bg-muted/50 border border-border"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium">{appointment.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(appointmentDate, "PPP 'à' HH:mm", { locale: fr })}
                  </p>
                </div>
                <span className="text-xs font-medium text-primary px-2 py-1 rounded-md bg-primary/10">
                  {timeText}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
