import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { Contact } from '@/types';

export const useContacts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Contact[];
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (contact: {
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
    }) => {
      const { data, error } = await supabase
        .from('contacts')
        .insert([contact])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact créé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la création du contact');
      console.error(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...contact }: Partial<Contact> & { id: string }) => {
      const { data, error } = await supabase
        .from('contacts')
        .update(contact)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact modifié avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la modification du contact');
      console.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact supprimé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression du contact');
      console.error(error);
    },
  });

  return {
    contacts,
    isLoading,
    createContact: createMutation.mutate,
    updateContact: updateMutation.mutate,
    deleteContact: deleteMutation.mutate,
  };
};
