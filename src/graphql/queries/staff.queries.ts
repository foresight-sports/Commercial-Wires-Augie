import { useQuery } from "../hooks/useQuery";
import { mockUsers } from "../mocks/users.mock";
import type { User } from "../types/common.types";

/**
 * Query to get all staff members for the account.
 * In production, this would be a GraphQL query like:
 * query GetStaff { staff { ...UserFields } }
 */
export function useGetStaff() {
    return useQuery<User[]>("staff", async () => {
        // Filter to show all users (staff, managers, coaches)
        // In production, this would filter by account and exclude owner
        return mockUsers.filter((user) => user.role !== "OWNER");
    });
}


