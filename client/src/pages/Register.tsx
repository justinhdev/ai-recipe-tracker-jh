import AuthForm from "./AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Register() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/generate");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 transition-colors duration-300">
      <div className="max-w-md w-full px-4 sm:px-0 mx-auto">
        <AuthForm />
        <p className="text-center text-sm sm:text-base mt-4 text-gray-700 dark:text-gray-300 transition-colors duration-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="block sm:inline text-blue-600 dark:text-blue-400 hover:underline transition duration-300"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
