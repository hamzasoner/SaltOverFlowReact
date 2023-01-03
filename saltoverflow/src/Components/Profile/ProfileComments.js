import React, { useContext } from "react";
import { mainContext } from "../Home";
import { BASE_URL } from "../../App";
import { useNavigate } from "react-router-dom";

function ProfileComments({
  setCommentToUpdate,
  trigger,
  setTrigger,
  userComments,
}) {
  const props = useContext(mainContext);
  const postList = props.post.list;
  const deleteListener = props.delete.ear;
  const setDeleteListener = props.delete.mouth;
  const setPostToShow = props.post.setToShow;
  const navigate = useNavigate();

  const handleDeleteCommentClick = (e, commentId) => {
    e.preventDefault();
    deleteComment(commentId);
  };

  const handleEditCommentClick = (e, comment) => {
    e.preventDefault();
    setCommentToUpdate(comment);
  };

  const handleGoToClick = (e, key, id) => {
    e.preventDefault();
    navigate("/", { replace: true });
    setPostToShow({ postId: key, userId: id });
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

  const deleteComment = async (commentId) => {
    const response = await fetch(BASE_URL + `/api/comment/${commentId}`, {
      method: "delete",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const deleteCommentResponse = await response.json();
    setTrigger(!trigger);
    setDeleteListener([...deleteListener, deleteCommentResponse]);
  };

  return (
    <>
      {userComments &&
        userComments.map((comment) => {
          if (!comment.text.includes("````")) {
            return (
              <div
                className="profile-comments-container"
                key={comment.commentId}
              >
                <small className="post-item--small">Post title: </small>
                <h3 className="profile-posts--title">
                  {postList[comment.postId]}
                </h3>
                <p className="profile-posts--content">{comment.text}</p>
                <small className="post-item--small">
                  Commented at: {comment.createdAt.split("T")[0]}
                </small>
                <div className="profile-comments--button-container">
                  <div>
                    <button
                      className="delete-button"
                      onClick={(event) => {
                        handleDeleteCommentClick(event, comment.commentId);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="edit-comment--button">
                    <button
                      className="edit-button"
                      onClick={(event) => {
                        handleEditCommentClick(event, comment);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="">
                    <button
                      className="edit-button show-post--button"
                      onClick={(event) =>
                        handleGoToClick(event, comment.postId, comment.userId)
                      }
                    >
                      Go to post
                    </button>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div
                className="profile-comments-container"
                key={comment.commentId}
              >
                <small className="post-item--small">Post title: </small>
                <h3 className="profile-posts--title">
                  {postList[comment.postId]}
                </h3>
                <div className="profile-posts--content">
                  {postContentParser(comment.text)}
                </div>
                <small className="post-item--small">
                  Commented at: {comment.createdAt.split("T")[0]}
                </small>
                <div className="profile-comments--button-container">
                  <div>
                    <button
                      className="delete-button"
                      onClick={(event) => {
                        handleDeleteCommentClick(event, comment.commentId);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="edit-comment--button">
                    <button
                      className="edit-button"
                      onClick={(event) => {
                        handleEditCommentClick(event, comment);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="">
                    <button
                      className="edit-button show-post--button"
                      onClick={(event) =>
                        handleGoToClick(event, comment.postId, comment.userId)
                      }
                    >
                      Go to post
                    </button>
                  </div>
                </div>
              </div>
            );
          }
        })}
    </>
  );
}

export default ProfileComments;
