import { useState } from "react";

interface MutationResult<T, V> {
    mutate: (variables: V) => Promise<T>;
    data: T | null;
    loading: boolean;
    error: Error | null;
}

/**
 * Mock implementation of useMutation hook that simulates GraphQL mutations.
 * This will be replaced with a real GraphQL client (Apollo, URQL, etc.) in production.
 */
export function useMutation<T, V>(mutationFn: (variables: V) => Promise<T>): MutationResult<T, V> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = async (variables: V): Promise<T> => {
        setLoading(true);
        setError(null);

        try {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 200));

            const result = await mutationFn(variables);
            setData(result);
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Unknown error");
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { mutate, data, loading, error };
}
