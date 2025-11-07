import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Plus, CalendarDays } from "lucide-react";
import { AppointmentDialog } from "@/components/agenda/AppointmentDialog";
import { AppointmentList } from "@/components/agenda/AppointmentList";
import { AppointmentReminders } from "@/components/agenda/AppointmentReminders";
import type { Appointment } from "@/types";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useAppointments } from "@/hooks/useAppointments";

const Agenda = () => {
  const { appointments, isLoading, deleteAppointment } = useAppointments();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>();

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDialogOpen(true);
  };

  const filteredAppointments = selectedDate
    ? appointments.filter(
        (apt) =>
          format(parseISO(apt.date_debut), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      )
    : appointments;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos rendez-vous professionnels
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedAppointment(undefined);
            setDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouveau rendez-vous
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Chargement...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <AppointmentReminders appointments={appointments} />
          
          <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 border-border">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              className="rounded-md pointer-events-auto"
            />
          </CardContent>
        </Card>

          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  {selectedDate
                    ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })
                    : "Tous les rendez-vous"}
                </h3>
                <AppointmentList
                  appointments={filteredAppointments}
                  onEdit={handleEditAppointment}
                  onDelete={deleteAppointment}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        </>
      )}

      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedAppointment(undefined);
        }}
        appointment={selectedAppointment}
        defaultDate={selectedDate}
      />
    </div>
  );
};

export default Agenda;
