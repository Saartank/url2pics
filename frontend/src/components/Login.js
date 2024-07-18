import { useState } from "react";
import { loginApi } from "@/utils/authentication-apis";
import Spinner from "./Spinner";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginApi(email, password);
      router.push("/home");
    } catch (err) {
      console.log(err.message);
      setError("Incorrect password. Please try again.");
    } finally {
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      <form
        onSubmit={handleSubmit}
        className={`mb-4 ${loading ? "blur-sm" : ""}`}
      >
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-700 mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 w-full"
        >
          Log In
        </button>
      </form>
    </>
  );
};
export default Login;
