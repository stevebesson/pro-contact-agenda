import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, MapPin, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Appointment } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AppointmentListProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}

export const AppointmentList = ({
  appointments,
  onEdit,
  onDelete,
}: AppointmentListProps) => {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun rendez-vous pour cette date
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="flex items-start justify-between p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all"
        >
          <div className="space-y-2 flex-1">
            <h4 className="font-semibold">{appointment.title}</h4>
            {appointment.description && (
              <p className="text-sm text-muted-foreground">
                {appointment.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(appointment.date, "PPP", { locale: fr })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {appointment.duration} min
              </div>
              {appointment.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {appointment.location}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(appointment)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer le rendez-vous</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette
                    action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(appointment.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
};
