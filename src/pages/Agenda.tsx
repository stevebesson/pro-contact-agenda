import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Plus } from "lucide-react";
import { AppointmentDialog } from "@/components/agenda/AppointmentDialog";
import { AppointmentList } from "@/components/agenda/AppointmentList";
import type { Appointment } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Agenda = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>();

  const handleSaveAppointment = (appointment: Appointment) => {
    if (selectedAppointment) {
      setAppointments(appointments.map((a) => (a.id === appointment.id ? appointment : a)));
    } else {
      setAppointments([...appointments, appointment]);
    }
    setSelectedAppointment(undefined);
    setDialogOpen(false);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDialogOpen(true);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter((a) => a.id !== id));
  };

  const filteredAppointments = selectedDate
    ? appointments.filter(
        (apt) =>
          format(apt.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
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
              <h3 className="text-lg font-semibold mb-4">
                {selectedDate
                  ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })
                  : "Tous les rendez-vous"}
              </h3>
              <AppointmentList
                appointments={filteredAppointments}
                onEdit={handleEditAppointment}
                onDelete={handleDeleteAppointment}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        appointment={selectedAppointment}
        onSave={handleSaveAppointment}
        defaultDate={selectedDate}
      />
    </div>
  );
};

export default Agenda;
