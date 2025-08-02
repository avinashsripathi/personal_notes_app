import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState<any>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 rounded-lg shadow-xl bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 text-gray-800 dark:text-white">
      <h2 className="text-3xl font-extrabold text-center mb-6 border-b pb-2">
        👤 User Profile
      </h2>

      {user ? (
        <div className="space-y-6 text-lg">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold text-blue-800 dark:text-blue-300">Username:</span>
            <span>{user.name}</span>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold text-green-800 dark:text-green-300">Email:</span>
            <span className="truncate">{user.email}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-purple-800 dark:text-purple-300">Total Notes:</span>
            <span className="text-lg font-bold">{user.noteCount}</span>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300">Loading profile...</p>
      )}
    </div>
  );
}

export default Profile;
