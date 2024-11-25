"use client";
import { FC, useState } from "react";

const UserComments: FC = () => {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");

  const addComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  return (
    <div className="w-full max-w-3xl p-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Comentarios</h2>
      <div className="mt-4 space-y-4">
        {comments.map((comment, index) => (
          <div key={index} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
            <p className="text-gray-700 dark:text-gray-200">{comment}</p>
          </div>
        ))}
        <div className="flex items-center mt-4">
          <input
            id="comment"
            name="comment"
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none dark:bg-gray-800 dark:text-white"
          />
          <button onClick={addComment} className="px-4 py-2 bg-blue-500 text-white rounded-r-md">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserComments;
