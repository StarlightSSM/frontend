import React, { useState } from "react";
import { Post } from "../types/types.js";
import { Link } from "react-router-dom";

export const PostListPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(
    Array.from({ length: 20 }).map((_, i) => ({
      id: i + 1,
      title: `샘플 게시글 ${i + 1}`,
      content: `내용 ${i + 1}`,
      nickname: `작성자${i + 1}`,
      createdAt: new Date(Date.now() - i * 1000 * 60).toISOString(),
    }))
  );

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">게시글 목록</h1>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="border p-3 rounded hover:bg-gray-50">
            <Link to={`/posts/${post.id}`} className="text-blue-600 hover:underline">
              {post.title} - {post.nickname}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
