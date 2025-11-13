import { useEffect, useState } from "react";

interface QueryResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

interface QueryOptions {
    skip?: boolean;
    pollInterval?: number;
}

/**
 * Mock implementation of useQuery hook that simulates GraphQL queries.
 * This will be replaced with a real GraphQL client (Apollo, URQL, etc.) in production.
 */
export function useQuery<T>(queryKey: string, fetcher: () => Promise<T>, options: QueryOptions = {}): QueryResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!options.skip);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        if (options.skip) return;

        setLoading(true);
        setError(null);

        try {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200));

            const result = await fetcher();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Polling support
        if (options.pollInterval) {
            const interval = setInterval(fetchData, options.pollInterval);
            return () => clearInterval(interval);
        }
    }, [queryKey, options.skip, options.pollInterval]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
}
