// lib/permissions.ts
import { Role } from "@prisma/client";

type Permission = 
  | "project:create"
  | "project:update"
  | "project:delete"
  | "task:create"
  | "task:update"
  | "task:delete"
  | "member:invite"
  | "member:remove"
  | "subscription:manage";

const rolePermissions: Record<Role, Permission[]> = {
  OWNER: [
    "project:create",
    "project:update",
    "project:delete",
    "task:create",
    "task:update",
    "task:delete",
    "member:invite",
    "member:remove",
    "subscription:manage",
  ],
  ADMIN: [
    "project:create",
    "project:update",
    "task:create",
    "task:update",
    "task:delete",
    "member:invite",
  ],
  MEMBER: [
    "task:create",
    "task:update",
  ],
  VIEWER: [],
};

export const hasPermission = (role: Role, permission: Permission): boolean => {
  return rolePermissions[role]?.includes(permission) ?? false;
};

export const checkPermission = async (
  userId: string,
  organizationId: string,
  permission: Permission
): Promise<boolean> => {
  const member = await prisma.member.findFirst({
    where: { userId, organizationId },
  });

  if (!member) return false;
  return hasPermission(member.role, permission);
};