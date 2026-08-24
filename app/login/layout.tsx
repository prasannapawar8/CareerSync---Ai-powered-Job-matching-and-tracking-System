/**
 * Login page has its own layout that hides the global Navbar,
 * since the login screen is a full-bleed standalone design.
 */
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
