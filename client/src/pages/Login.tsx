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
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 duration-300">
      <AuthForm isLogin />
      <p className="text-center text-sm mt-4 text-gray-700 dark:text-gray-300 duration-300">
        Don’t have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600 dark:text-blue-400 hover:underline duration-300"
        >
          Register here
        </Link>
      </p>
    </div>
  );
}
