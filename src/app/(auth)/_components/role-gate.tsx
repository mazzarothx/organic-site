"use client";

import type { UserRole } from "@prisma/client";

import { useCurrentRole } from "@/app/(auth)/hooks/use-current-role";
import { FormError } from "./form-error";

interface RoleGateProps {
	children: React.ReactNode;
	allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
	const role = useCurrentRole();

	if (role !== allowedRole) {
		return <FormError message="You do not have permission to view this content!" />;
	}

	return <>{children}</>;
};
