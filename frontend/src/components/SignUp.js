import { useState } from "react";
import { signupApi } from "@/utils/authentication-apis";
import { sleep } from "@/utils/sleep";
import Spinner from "./Spinner";
const SignUp = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const result = await signupApi(name, email, password);
      console.log("Signup successful:", result);
      setLoading(false);
      onSubmit();
    } catch (err) {
      console.log(err.message);
      setLoading(false);
      setError(
        "Email id already registered, please login or use a different email id"
      );
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
            type="text"
            placeholder="Name"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <div className="mb-4">
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-700 mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 w-full"
        >
          Sign Up
        </button>
      </form>
    </>
  );
};

export default SignUp;
