import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
});

function CreateNote() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const onSubmit = async (data: any) => {
    try {
      const noteData = {
        ...data,
        isPinned: false,
        tags: [],
      };

      await axios.post("http://localhost:5000/api/notes", noteData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Note created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("❌ Failed to create note");
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Create Note</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Title"
            {...register("title")}
            className="w-full border p-2 rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <textarea
            placeholder="Content"
            {...register("content")}
            className="w-full border p-2 rounded"
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Note
        </button>
      </form>
    </div>
  );
}

export default CreateNote;
