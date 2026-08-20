import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Analysis, PaginatedResponse } from '../types'

export function useCreateAnalysis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (url: string) => api.createAnalysis(url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] })
    },
  })
}

export function useAnalysis(id: string | null) {
  return useQuery<Analysis>({
    queryKey: ['analysis', id],
    queryFn: () => api.getAnalysis(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'PENDING' || status === 'PROCESSING') return 2000
      return false
    },
  })
}

export function useAnalyses(page = 1, limit = 20) {
  return useQuery<PaginatedResponse<Analysis>>({
    queryKey: ['analyses', page, limit],
    queryFn: () => api.listAnalyses(page, limit),
  })
}

export function useDeleteAnalysis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteAnalysis(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] })
    },
  })
}
