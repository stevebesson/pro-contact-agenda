import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { Appointment } from '@/types';

export const useAppointments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rendez_vous')
        .select('*')
        .order('date_debut', { ascending: true });

      if (error) throw error;
      return data as Appointment[];
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (appointment: {
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
    }) => {
      const { data, error } = await supabase
        .from('rendez_vous')
        .insert([appointment])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Rendez-vous créé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la création du rendez-vous');
      console.error(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...appointment }: Partial<Appointment> & { id: string }) => {
      const { data, error } = await supabase
        .from('rendez_vous')
        .update(appointment)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Rendez-vous modifié avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la modification du rendez-vous');
      console.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rendez_vous')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Rendez-vous supprimé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression du rendez-vous');
      console.error(error);
    },
  });

  return {
    appointments,
    isLoading,
    createAppointment: createMutation.mutate,
    updateAppointment: updateMutation.mutate,
    deleteAppointment: deleteMutation.mutate,
  };
};
