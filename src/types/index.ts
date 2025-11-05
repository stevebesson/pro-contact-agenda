export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  notes?: string;
  createdAt: Date;
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
