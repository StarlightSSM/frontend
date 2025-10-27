import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Post, Comment } from "../types/types.js";

// 샘플 데이터 (실제 API 대신)
const sampleComments: Comment[] = Array.from({ length: 5 }).map((_, i) => ({
  id: i + 1,
  postId: 1,
  nickname: `댓글러${i + 1}`,
  content: `이것은 샘플 댓글 ${i + 1}입니다.`,
  password: "1234",
  createdAt: new Date(Date.now() - i * 5000).toISOString(),
}));

const samplePost: Post = {
  id: 1,
  title: "샘플 게시글",
  content: "이것은 샘플 게시글 내용입니다.",
  nickname: "작성자",
  createdAt: new Date().toISOString(),
  comments: [...sampleComments],
};

const validators = {
  contentComment: (s: string) => s.trim().length > 0 && s.trim().length <= 200,
  nickname: (s: string) => /^[A-Za-z0-9가-힣]{1,10}$/.test(s.trim()),
  password: (s: string) => /^\d{4}$/.test(s.trim()),
};

export const PostDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentNickname, setCommentNickname] = useState("");
  const [commentPassword, setCommentPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // 샘플 데이터 로딩
    setPost(samplePost);
    setComments(samplePost.comments || []);
  }, [id]);

  // 댓글 생성
  const handleCreateComment = () => {
    if (submitting) return;
    if (!validators.contentComment(commentContent)) return alert("댓글은 1~200자여야 합니다.");
    if (!validators.nickname(commentNickname)) return alert("닉네임 형식이 올바르지 않습니다.");
    if (!validators.password(commentPassword)) return alert("비밀번호는 4자리 숫자여야 합니다.");

    setSubmitting(true);

    const newComment: Comment = {
      id: Date.now(), // number
      postId: post!.id,
      content: commentContent,
      nickname: commentNickname,
      password: commentPassword,
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    setCommentContent("");
    setCommentNickname("");
    setCommentPassword("");
    setSubmitting(false);
  };

  // 댓글 삭제
  const handleDeleteComment = (commentId: number) => {
    const pwd = prompt("삭제 비밀번호 4자리를 입력하세요") || "";
    if (!validators.password(pwd)) return alert("비밀번호 형식이 올바르지 않습니다.");

    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;
    if (comment.password !== pwd) return alert("비밀번호가 일치하지 않습니다.");

    setComments(comments.filter((c) => c.id !== commentId));
  };

  // 댓글 수정
  const handleEditComment = (commentId: number) => {
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;

    const newContent = prompt("수정할 내용을 입력하세요", comment.content) || "";
    const newNickname = prompt("닉네임 변경(비워두면 기존 유지)", comment.nickname) || comment.nickname;
    const pwd = prompt("비밀번호 4자리") || "";

    if (!validators.password(pwd)) return alert("비밀번호 형식이 올바르지 않습니다.");
    if (comment.password !== pwd) return alert("비밀번호가 일치하지 않습니다.");
    if (!validators.contentComment(newContent)) return alert("댓글은 1~200자여야 합니다.");
    if (!validators.nickname(newNickname)) return alert("닉네임 형식이 올바르지 않습니다.");

    setComments(
      comments.map((c) =>
        c.id === commentId ? { ...c, content: newContent, nickname: newNickname } : c
      )
    );
  };

  if (!post) return <div>로딩중...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <div className="text-sm text-gray-500 mb-4">작성자: {post.nickname}</div>
      <div className="mb-6 whitespace-pre-wrap">{post.content}</div>

      <section>
        <h3 className="font-semibold mb-2">댓글</h3>
        <div className="space-y-3 mb-4">
          {comments.length === 0 ? <div className="text-gray-500">댓글이 없습니다.</div> : null}
          {comments.map((c) => (
            <div key={c.id} className="border p-3 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{c.nickname}</div>
                  <div className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditComment(c.id)}
                    className="px-2 py-1 border rounded"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="px-2 py-1 border rounded"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <div className="mt-2">{c.content}</div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-3 rounded">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            maxLength={200}
            className="w-full p-2 border rounded mb-2"
            placeholder="댓글을 입력하세요 (200자)"
          />
          <input
            value={commentNickname}
            onChange={(e) => setCommentNickname(e.target.value)}
            maxLength={10}
            className="p-2 border rounded mr-2"
            placeholder="닉네임"
          />
          <input
            value={commentPassword}
            onChange={(e) => setCommentPassword(e.target.value)}
            maxLength={4}
            inputMode="numeric"
            pattern="\d*"
            className="p-2 border rounded mr-2"
            placeholder="비밀번호(4자리)"
          />
          <button
            onClick={handleCreateComment}
            disabled={submitting}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            {submitting ? "작성중..." : "댓글 작성"}
          </button>
        </div>
      </section>
    </div>
  );
};
