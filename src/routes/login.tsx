import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { loginServer } from "~/api/auth";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    try {
      const res = await loginServer({ data: { username, password } });
      if ((res as any)?.ok) {
        setMsg("Login successful!");
        navigate({ to: "/notes", replace: true });
      } else {
        setMsg((res as any)?.message ?? "Login failed");
      }
    } catch (err: any) {
      setMsg(err?.message ?? "Login failed");
    }
  }

  return (
    <div className="p-6 max-w-sm mx-auto flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-2">
        <input
          value={username}
          className="border p-2 rounded"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          className="border p-2 rounded"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="bg-blue-500 text-white py-2 rounded">Login</button>
        {msg && <p>{msg}</p>}
      </form>
      <p className="text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
