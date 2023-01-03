import React, { useEffect } from "react";
import { BASE_URL } from "../../App";

const PostComments = ({
  userList,
  postId,
  commentListener,
  setCommentList,
  commentList,
}) => {
  const getComments = async (postId) => {
    const response = await fetch(BASE_URL + `/api/comment/post/${postId}`, {
      method: "get",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    });
    const getCommentsResponse = await response.json();
    setCommentList(getCommentsResponse);
  };

  const postContentParser = (postContent) => {
    const contentSplit = postContent.split("````");
    const contentObject = {};
    for (let i = 1; i <= contentSplit.length + 1; i++) {
      if (i % 2 === 0) {
        contentObject[i] = contentSplit[i - 1];
      }
      if (i % 2 !== 0) {
        contentObject[i] = contentSplit[i - 1];
      }
    }
    Object.keys(contentObject).forEach(
      (key) => contentObject[key] === undefined && delete contentObject[key]
    );

    return Object.keys(contentObject).map((key) => {
      if (key % 2 !== 0) {
        return <p key={key}>{contentObject[key]}</p>;
      }
      if (key % 2 === 0) {
        return (
          <div className="code-block" key={key}>
            <code>{contentObject[key]}</code>
          </div>
        );
      }
    });
  };

  useEffect(() => {
    getComments(postId);
  }, []);

  useEffect(() => {
    getComments(postId);
  }, [commentListener]);

  return (
    <>
      {commentList.map((comment) => {
        if (!comment.text.includes("````")) {
          return (
            <div
              className="profile-comments-container"
              key={comment && comment.commentId}
            >
              <p className="profile-posts--content">{comment.text}</p>
              <small className="post-item--small">
                Commented at: {comment.createdAt.split("T")[0]}
              </small>
              <small className="post-item--small">
                Commented by: <b>{userList[comment.userId]}</b>
              </small>
            </div>
          );
        } else {
          return (
            <div
              className="profile-comments-container"
              key={comment && comment.commentId}
            >
              <div className="profile-posts--content">
                {postContentParser(comment.text)}
              </div>
              <small className="post-item--small">
                Commented at: {comment.createdAt.split("T")[0]}
              </small>
              <small className="post-item--small">
                Commented by: <b>{userList[comment.userId]}</b>
              </small>
            </div>
          );
        }
      })}
    </>
  );
};

export default PostComments;
