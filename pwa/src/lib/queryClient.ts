import { QueryCache, QueryClient } from '@tanstack/react-query'
import { ApiError } from '../api/client'
import { forceLogout, isAuthError } from './authSession'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof ApiError && isAuthError(error.status)) {
        forceLogout()
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError && isAuthError(error.status)) return false
        return failureCount < 1
      },
      staleTime: 30_000,
    },
  },
})
