import mongoose from "mongoose";

export interface INote extends mongoose.Document {
  title: string;
  content: string;
  tags: string[];
  userId: mongoose.Types.ObjectId;
  isPinned: boolean; // ✅ Added
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new mongoose.Schema<INote>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isPinned: { type: Boolean, default: false }, // ✅ Added
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Note = mongoose.model<INote>("Note", noteSchema);
export default Note;