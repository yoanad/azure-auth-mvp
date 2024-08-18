"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { registerUser, getAccessToken, authenticatedFetch } from "../lib/auth";
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
      const accessToken = await getAccessToken(); // Get access token before registration
      const response = await registerUser(user);
      setMessage(response.message);

      // Fetch secure data with the received token
      const secureResponse = await authenticatedFetch("/api/secureData");
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
