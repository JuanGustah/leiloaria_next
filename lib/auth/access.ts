export const ADMIN_EMAIL = "admin@admin.com";
export const USER_DASHBOARD_PATH = "/dashboard";
export const ADMIN_DASHBOARD_PATH = "/admin/dashboard";

type RoleValue = string | null | undefined;

const normalizeRole = (role: RoleValue) => (role ?? "").toUpperCase();

export const isAdminIdentity = ({
  email,
  role,
}: {
  email?: string | null;
  role?: RoleValue;
}): boolean => {
  // Regra futura: role tem prioridade sobre email.
  if (normalizeRole(role) === "ADMIN") {
    return true;
  }

  return (email ?? "").trim().toLowerCase() === ADMIN_EMAIL;
};

export const getPostAuthRedirectPath = ({
  email,
  role,
}: {
  email?: string | null;
  role?: RoleValue;
}): string => {
  return isAdminIdentity({ email, role })
    ? ADMIN_DASHBOARD_PATH
    : USER_DASHBOARD_PATH;
};
