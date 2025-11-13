import { useQuery } from "../hooks/useQuery";
import { mockMembershipTiers } from "../mocks/membership.mock";
import type { MembershipTier } from "../types/membership.types";

/**
 * Query to get all membership tiers for the account.
 * In production, this would be a GraphQL query like:
 * query GetMembershipTiers { membershipTiers { ...MembershipTierFields } }
 */
export function useGetMembershipTiers() {
    return useQuery<MembershipTier[]>("membershipTiers", async () => {
        return mockMembershipTiers;
    });
}

/**
 * Query to get a specific membership tier by ID.
 */
export function useGetMembershipTier(membershipTierId: string) {
    return useQuery<MembershipTier | undefined>(`membershipTier-${membershipTierId}`, async () => {
        return mockMembershipTiers.find((tier) => tier.id === membershipTierId);
    });
}

