import React from "react";

const HomePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to MyApp</h1>
      <p>
        This is the homepage. Navigate to the <a href="/register">Register</a>{" "}
        page to sign up.
      </p>
    </div>
  );
};

export default HomePage;
