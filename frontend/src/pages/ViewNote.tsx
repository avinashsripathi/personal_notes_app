import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

function ViewNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNote(res.data);
      } catch (err) {
        navigate("/404");
      }
    };

    fetchNote();
  }, [id]);

  const exportAsTxt = () => {
    if (!note) return;
    const element = document.createElement("a");
    const file = new Blob([`Title: ${note.title}\n\n${note.content}`], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const exportAsPdf = () => {
    if (!note) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(note.title, 10, 10);
    doc.setFontSize(11);
    doc.text(note.content, 10, 20);
    doc.save(`${note.title}.pdf`);
  };

  if (!note) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-3xl font-bold mb-4">{note.title}</h1>
      <p className="text-sm text-gray-500 mb-2">
        Created at: {new Date(note.createdAt).toLocaleString()}
      </p>

      <div className="prose dark:prose-invert mb-4">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>

      <div className="flex gap-3">
        <button
          onClick={exportAsTxt}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Export as .txt
        </button>
        <button
          onClick={exportAsPdf}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
}

export default ViewNote;
