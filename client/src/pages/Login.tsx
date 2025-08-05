import AuthForm from "./AuthForm";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/generate");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 duration-300">
      <div className="max-w-md w-full px-4 sm:px-0 mx-auto">
        <AuthForm isLogin />
        <p className="text-center text-sm sm:text-base mt-4 text-gray-700 dark:text-gray-300 duration-300">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="block sm:inline text-blue-600 dark:text-blue-400 hover:underline duration-300"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
