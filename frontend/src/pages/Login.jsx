import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin() {

    try {

      setLoading(true);

      const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/auth/login`,
  {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data =
        await res.json();

      if (!data.success) {

        alert(
          data.message ||
          "Login failed"
        );

        return;
      }

      localStorage.setItem(
        "adminToken",
        data.token
      );

      localStorage.setItem(
        "adminUsername",
        data.username
      );

      navigate("/admin");

    } catch (error) {

      console.error(error);

      alert(
        "Unable to login"
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
      "
    >

      <div
        className="
          bg-white
          p-8
          rounded-2xl
          shadow-xl
          w-full
          max-w-md
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            mb-6
            text-center
          "
        >
          Admin Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          className="
            w-full
            border
            p-3
            rounded-lg
            mb-4
          "
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="
            w-full
            border
            p-3
            rounded-lg
            mb-6
          "
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            w-full
            bg-green-600
            text-white
            py-3
            rounded-lg
            font-bold
          "
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

      </div>

    </div>
  );
}

export default Login;