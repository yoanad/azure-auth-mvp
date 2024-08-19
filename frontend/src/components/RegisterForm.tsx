"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { generateToken, authenticatedFetch, registerUser } from "../lib/auth";
import { User } from "../types";

const RegisterForm: React.FC = () => {
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [secureData, setSecureData] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Generate JWT token using client secret
      await generateToken();

      // Register the user
      const response = await registerUser(user);
      setMessage(response.message);

      // Fetch secure data using the generated JWT token
      const secureResponse = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/secure-data`
      );
      setSecureData(secureResponse.message);
    } catch (error) {
      setMessage("Registration failed.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleChange}
          placeholder="Username"
          className="input"
        />
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
          className="input"
        />
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          placeholder="Password"
          className="input"
        />
        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
      {message && <p>{message}</p>}
      {secureData && <p>Secure Data: {secureData}</p>}
    </div>
  );
};

export default RegisterForm;
