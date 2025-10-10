import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useState } from "react";
import { registerServer } from "~/api/auth";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await registerServer({ data: { username, password } });
      setMessage(res.message);
      navigate({ to: "/login", replace: true });
    } catch (err: any) {
      setMessage(err?.message ?? "Something went wrong");
    }
  }

  return (
    <div className="p-6 max-w-sm mx-auto flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          placeholder="Username"
          className="border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white py-2 rounded">
          Register
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
