import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

// Protect all /admin routes except the login page
export const config = {
  matcher: ["/admin/((?!login).*)"],
};
