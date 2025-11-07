export interface Contact {
  id: string;
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
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  titre: string;
  description?: string;
  contact_id?: string;
  date_debut: string;
  date_fin: string;
  duree_minutes: number;
  lieu?: string;
  adresse?: string;
  type?: string;
  statut?: string;
  rappel_2jours_envoye?: boolean;
  rappel_2heures_envoye?: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  contactId?: string;
  createdAt: Date;
  updatedAt: Date;
}
