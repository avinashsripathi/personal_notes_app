import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify"; // ✅ import toast

// ✅ Validation Schema
const schema = yup.object({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
});

interface FormData {
  title: string;
  content: string;
}

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const note = res.data;
        setValue("title", note.title);
        setValue("content", note.content);
      } catch (err) {
        console.error("Error loading note:", err);
        toast.error("❌ Failed to load note.");
      }
    };

    fetchNote();
  }, [id, token, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await axios.put(`http://localhost:5000/api/notes/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("✅ Note updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("❌ Failed to update note.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Note</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            {...register("title")}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Content</label>
          <textarea
            {...register("content")}
            className="w-full px-3 py-2 border rounded min-h-[120px]"
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Update Note
        </button>
      </form>
    </div>
  );
}

export default EditNote;
