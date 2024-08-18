import { useState } from "react";
import { registerUser, fetchSecureData } from "../lib/auth";
import Layout from "../components/layout";

export default function Home() {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [secureData, setSecureData] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(user);
      setMessage(response.message);

      // Fetch secure data with the received token
      const secureResponse = await fetchSecureData(response.access_token);
      setSecureData(secureResponse.message);
    } catch (error) {
      setMessage("Registration failed.");
      console.error("Registration error:", error);
    }
  };

  return (
    <Layout>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
      {secureData && <p>Secure Data: {secureData}</p>}
    </Layout>
  );
}
