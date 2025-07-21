import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

function Home() {
  useEffect(() => {
    toast.info("👋 Welcome to Personal Notes App!");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-200 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-lg text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          📝 Personal Notes App
        </h1>
        <p className="text-gray-600 mb-6 text-lg">
          Securely create, manage, and access your personal notes anytime.
        </p>

        <div className="flex justify-center gap-4">
          <Link to="/login">
            <Button variant="default" className="w-28">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary" className="w-28">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
