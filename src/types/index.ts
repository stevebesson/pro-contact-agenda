export interface Contact {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  entreprise?: string;
  poste?: string;
  notes?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  contactId?: string;
  date: Date;
  duration: number; // in minutes
  location?: string;
  reminder2Days?: boolean;
  reminder2Hours?: boolean;
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  contactId?: string;
  createdAt: Date;
  updatedAt: Date;
}
