import { API_URL } from '@/constants';
import { fetcher } from '@/utils/fetcher';
import useSWR from 'swr';

type MeResponse = {
  ok: boolean;
  user: {
    id: string;
    email?: string;
  } | null;
};

export function useUser() {
  return useSWR<MeResponse>(API_URL + '/auth/me', fetcher);
}
