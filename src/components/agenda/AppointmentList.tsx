import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, MapPin, Pencil, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Appointment } from "@/types";
import { useContacts } from "@/hooks/useContacts";
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
  const { contacts } = useContacts();
  
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun rendez-vous pour cette date
      </div>
    );
  }

  const getContactName = (contactId?: string) => {
    if (!contactId) return null;
    const contact = contacts.find(c => c.id === contactId);
    return contact ? `${contact.prenom} ${contact.nom}` : null;
  };

  const getTypeBadgeColor = (type?: string) => {
    switch (type) {
      case 'reunion': return 'bg-blue-500/10 text-blue-500';
      case 'appel': return 'bg-green-500/10 text-green-500';
      case 'visio': return 'bg-purple-500/10 text-purple-500';
      case 'dejeuner': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => {
        const contactName = getContactName(appointment.contact_id);
        const dateDebut = parseISO(appointment.date_debut);
        
        return (
          <div
            key={appointment.id}
            className="flex items-start justify-between p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{appointment.titre}</h4>
                {appointment.type && (
                  <Badge variant="secondary" className={getTypeBadgeColor(appointment.type)}>
                    {appointment.type}
                  </Badge>
                )}
              </div>
              {contactName && (
                <div className="flex items-center gap-1 text-sm text-primary">
                  <User className="h-4 w-4" />
                  {contactName}
                </div>
              )}
              {appointment.description && (
                <p className="text-sm text-muted-foreground">
                  {appointment.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(dateDebut, "PPP", { locale: fr })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(dateDebut, "HH:mm")} • {appointment.duree_minutes} min
                </div>
                {appointment.lieu && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {appointment.lieu}
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
        );
      })}
    </div>
  );
};
