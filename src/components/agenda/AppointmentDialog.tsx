import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format, addMinutes } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types";
import { useAppointments } from "@/hooks/useAppointments";
import { useContacts } from "@/hooks/useContacts";

const appointmentSchema = z.object({
  titre: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  contact_id: z.string().optional(),
  date_debut: z.date({
    required_error: "La date est requise",
  }),
  heure_debut: z.string().min(1, "L'heure est requise"),
  duree_minutes: z.coerce.number().min(15, "Durée minimum 15 minutes"),
  lieu: z.string().optional(),
  adresse: z.string().optional(),
  type: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment;
  defaultDate?: Date;
}

export const AppointmentDialog = ({
  open,
  onOpenChange,
  appointment,
  defaultDate,
}: AppointmentDialogProps) => {
  const { createAppointment, updateAppointment } = useAppointments();
  const { contacts } = useContacts();
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      titre: "",
      description: "",
      contact_id: "",
      date_debut: defaultDate || new Date(),
      heure_debut: "09:00",
      duree_minutes: 60,
      lieu: "",
      adresse: "",
      type: "reunion",
    },
  });

  useEffect(() => {
    if (appointment) {
      const dateDebut = new Date(appointment.date_debut);
      form.reset({
        titre: appointment.titre,
        description: appointment.description || "",
        contact_id: appointment.contact_id || "",
        date_debut: dateDebut,
        heure_debut: format(dateDebut, "HH:mm"),
        duree_minutes: appointment.duree_minutes,
        lieu: appointment.lieu || "",
        adresse: appointment.adresse || "",
        type: appointment.type || "reunion",
      });
    } else {
      form.reset({
        titre: "",
        description: "",
        contact_id: "",
        date_debut: defaultDate || new Date(),
        heure_debut: "09:00",
        duree_minutes: 60,
        lieu: "",
        adresse: "",
        type: "reunion",
      });
    }
  }, [appointment, defaultDate, form]);

  const onSubmit = (data: AppointmentFormValues) => {
    const [hours, minutes] = data.heure_debut.split(':').map(Number);
    const dateDebut = new Date(data.date_debut);
    dateDebut.setHours(hours, minutes, 0, 0);
    
    const dateFin = addMinutes(dateDebut, data.duree_minutes);
    
    const appointmentData = {
      titre: data.titre,
      description: data.description,
      contact_id: data.contact_id || undefined,
      date_debut: dateDebut.toISOString(),
      date_fin: dateFin.toISOString(),
      duree_minutes: data.duree_minutes,
      lieu: data.lieu,
      adresse: data.adresse,
      type: data.type || "reunion",
      statut: "planifie",
    };
    
    if (appointment) {
      updateAppointment({ id: appointment.id, ...appointmentData });
    } else {
      createAppointment(appointmentData as any);
    }
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
          </DialogTitle>
          <DialogDescription>
            Planifiez un rendez-vous professionnel
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="titre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Réunion client" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un contact" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Aucun contact</SelectItem>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.prenom} {contact.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date_debut"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={fr}
                          className="pointer-events-auto"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="heure_debut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duree_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée (minutes) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Type de rendez-vous" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="reunion">Réunion</SelectItem>
                        <SelectItem value="appel">Appel</SelectItem>
                        <SelectItem value="visio">Visioconférence</SelectItem>
                        <SelectItem value="dejeuner">Déjeuner</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="lieu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lieu</FormLabel>
                  <FormControl>
                    <Input placeholder="Bureau, Café, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="123 rue Example, 75001 Paris" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Détails du rendez-vous..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                {appointment ? "Enregistrer" : "Créer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
