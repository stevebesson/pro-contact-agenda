import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useContacts } from "@/hooks/useContacts";
import type { Contact } from "@/types";
import { useEffect } from "react";

const contactSchema = z.object({
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(10, "Numéro de téléphone invalide"),
  telephone_secondaire: z.string().optional(),
  entreprise: z.string().optional(),
  poste: z.string().optional(),
  adresse_ligne1: z.string().optional(),
  adresse_ligne2: z.string().optional(),
  code_postal: z.string().optional(),
  ville: z.string().optional(),
  pays: z.string().optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: Contact;
}

export const ContactDialog = ({
  open,
  onOpenChange,
  contact,
}: ContactDialogProps) => {
  const { createContact, updateContact } = useContacts();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      telephone_secondaire: "",
      entreprise: "",
      poste: "",
      adresse_ligne1: "",
      adresse_ligne2: "",
      code_postal: "",
      ville: "",
      pays: "France",
      tags: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (contact) {
      form.reset({
        prenom: contact.prenom,
        nom: contact.nom,
        email: contact.email,
        telephone: contact.telephone,
        telephone_secondaire: contact.telephone_secondaire || "",
        entreprise: contact.entreprise || "",
        poste: contact.poste || "",
        adresse_ligne1: contact.adresse_ligne1 || "",
        adresse_ligne2: contact.adresse_ligne2 || "",
        code_postal: contact.code_postal || "",
        ville: contact.ville || "",
        pays: contact.pays || "France",
        tags: contact.tags?.join(", ") || "",
        notes: contact.notes || "",
      });
    } else {
      form.reset({
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        telephone_secondaire: "",
        entreprise: "",
        poste: "",
        adresse_ligne1: "",
        adresse_ligne2: "",
        code_postal: "",
        ville: "",
        pays: "France",
        tags: "",
        notes: "",
      });
    }
  }, [contact, form]);

  const onSubmit = (data: ContactFormValues) => {
    const tagsArray = data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : undefined;
    const contactData = {
      ...data,
      tags: tagsArray,
    };
    
    if (contact) {
      updateContact({ id: contact.id, ...contactData });
    } else {
      createContact(contactData as {
        prenom: string;
        nom: string;
        email: string;
        telephone: string;
        telephone_secondaire?: string;
        entreprise?: string;
        poste?: string;
        adresse_ligne1?: string;
        adresse_ligne2?: string;
        code_postal?: string;
        ville?: string;
        pays?: string;
        tags?: string[];
        notes?: string;
      });
    }
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {contact ? "Modifier le contact" : "Nouveau contact"}
          </DialogTitle>
          <DialogDescription>
            Renseignez les informations du contact professionnel
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Jean" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Dupont" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="jean@exemple.fr"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone *</FormLabel>
                    <FormControl>
                      <Input placeholder="0601020304" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="telephone_secondaire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone secondaire</FormLabel>
                  <FormControl>
                    <Input placeholder="0601020304" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="entreprise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entreprise</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="poste"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poste</FormLabel>
                    <FormControl>
                      <Input placeholder="Directeur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Adresse</h3>
              <FormField
                control={form.control}
                name="adresse_ligne1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse ligne 1</FormLabel>
                    <FormControl>
                      <Input placeholder="123 rue Example" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adresse_ligne2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse ligne 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Appartement, étage..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code_postal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code postal</FormLabel>
                      <FormControl>
                        <Input placeholder="75001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ville"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input placeholder="Paris" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="pays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <FormControl>
                      <Input placeholder="France" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="client, partenaire, fournisseur..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informations supplémentaires..."
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
                {contact ? "Enregistrer" : "Créer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
