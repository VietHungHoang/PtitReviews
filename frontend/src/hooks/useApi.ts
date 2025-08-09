import { useState, useEffect } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  apiCall: () => Promise<{ status: number; data: T; message: string }>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall();
      if (response.status === 200) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.message,
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  useEffect(() => {
    refetch();
  }, dependencies);

  return { ...state, refetch };
}

export function useApiMutation<T, P = any>() {
  const [state, setState] = useState<UseApiState<T> & { isSubmitting: boolean }>({
    data: null,
    loading: false,
    error: null,
    isSubmitting: false,
  });

  const mutate = async (
    apiCall: (params: P) => Promise<{ status: string; data: T; message: string }>,
    params: P
  ) => {
    setState(prev => ({ ...prev, isSubmitting: true, loading: true, error: null }));
    
    try {
      const response = await apiCall(params);
      if (response.status === 'success') {
        setState({
          data: response.data,
          loading: false,
          error: null,
          isSubmitting: false,
        });
        return response;
      } else {
        setState({
          data: null,
          loading: false,
          error: response.message,
          isSubmitting: false,
        });
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        isSubmitting: false,
      });
      throw error;
    }
  };

  return { ...state, mutate };
}