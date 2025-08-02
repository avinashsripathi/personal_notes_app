import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Note {
  _id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
}

function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState(() => {
    return localStorage.getItem("sortOption") || "newest"; // ✅ Load from localStorage
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sortOption", sortOption); // ✅ Save sort option when it changes
  }, [sortOption]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(res.data);
    } catch (err) {
      toast.error("❌ Error fetching notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("🗑️ Note deleted!");
      fetchNotes();
    } catch (err) {
      toast.error("❌ Failed to delete note.");
    }
  };

  const togglePin = async (id: string, isPinned: boolean) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/notes/${id}/pin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(isPinned ? "📌 Note unpinned" : "📌 Note pinned");
      fetchNotes();
    } catch (err) {
      toast.error("❌ Failed to update pin status.");
    }
  };

  const toggleTheme = () => {
    const root = window.document.documentElement;
    const isDark = root.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("👋 Logged out!");
    window.location.href = "/";
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const sortNotes = (a: Note, b: Note) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    switch (sortOption) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "az":
        return a.title.localeCompare(b.title);
      case "za":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-all">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Your Notes</h1>
          <p className="text-gray-600 text-sm dark:text-gray-300">Welcome, {user.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded text-xl bg-gray-200 dark:bg-gray-700"
            title="Toggle Theme"
          >
            🌙
          </button>
          <button
            onClick={goToProfile}
            className="text-xl px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
            title="Profile"
          >
            👤
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <Link to="/create">
        <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">
          + Create Note
        </button>
      </Link>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-96 px-4 py-2 border rounded shadow-sm dark:bg-gray-800 dark:text-white"
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="newest">🆕 Newest First</option>
          <option value="oldest">🧓 Oldest First</option>
          <option value="az">🔤 A → Z</option>
          <option value="za">🔠 Z → A</option>
        </select>
      </div>

      {notes.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No notes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...notes]
            .filter((note) =>
              note.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort(sortNotes)
            .map((note) => (
              <div
                key={note._id}
                className={`border p-4 rounded shadow-sm transition duration-300 hover:shadow-lg ${
                  note.isPinned
                    ? "bg-yellow-100 dark:bg-yellow-300"
                    : "bg-white dark:bg-gray-800"
                }`}
              >
                <div className="flex justify-between items-center">
                  <Link to={`/note/${note._id}`} className="text-lg font-semibold hover:underline">
                    {note.title}
                  </Link>
                  <button
                    onClick={() => togglePin(note._id, note.isPinned)}
                    className={`px-2 py-1 rounded text-xl ${
                      note.isPinned ? "bg-gray-300 text-black" : "bg-yellow-400 text-white"
                    }`}
                    title={note.isPinned ? "Unpin note" : "Pin note"}
                  >
                    📌
                  </button>
                </div>

                <div className="prose prose-sm max-w-none mt-2 text-gray-800 dark:text-gray-200">
                  <ReactMarkdown>{note.content}</ReactMarkdown>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Created on: {new Date(note.createdAt).toLocaleString()}
                </p>

                <div className="flex gap-2 mt-4">
                  <Link to={`/edit/${note._id}`}>
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
