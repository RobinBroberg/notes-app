import { useSession } from "@tanstack/react-start/server";

export type SessionData = { userId?: number; username?: string };

export function useAppSession() {
  return useSession<SessionData>({
    name: "app-session",
    password: "dev-session-secret-just-for-school",
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    },
  });
}
