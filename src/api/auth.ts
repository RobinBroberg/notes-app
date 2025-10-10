import { createServerFn } from "@tanstack/react-start";
import { db } from "~/db/db";
import { users } from "~/db/schema";
import { eq } from "drizzle-orm";
import { useAppSession } from "~/utils/session";

export const registerServer = createServerFn({ method: "POST" })
  .inputValidator((input: { username: string; password: string }) => input)
  .handler(async ({ data }) => {
    await db.insert(users).values({
      username: data.username,
      password: data.password,
    });

    return { message: "User registered!" };
  });

export const loginServer = createServerFn({ method: "POST" })
  .inputValidator((i: { username: string; password: string }) => i)
  .handler(async ({ data }) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, data.username));
    if (!user || user.password !== data.password) {
      throw new Error("Wrong username or password");
    }
    const session = await useAppSession();
    await session.update({ userId: user.id, username: user.username });
    return { ok: true, message: "Logged in!" };
  });

export const meServer = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useAppSession();
  const userId = session.data.userId ?? null;
  return { userId };
});

export const logoutServer = createServerFn({ method: "POST" }).handler(
  async () => {
    const session = await useAppSession();
    await session.clear();
    return { message: "Logged out" };
  }
);
