import React, { useContext } from "react";
import { mainContext } from "../Home";
import { BASE_URL } from "../../App";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";

function ProfilePosts({ setPostToUpdate, trigger, setTrigger, userPosts }) {
  const props = useContext(mainContext);
  const deleteListener = props.delete.ear;
  const setDeleteListener = props.delete.mouth;
  const setPostToShow = props.post.setToShow;
  const navigate = useNavigate();

  const handleDeletePostClick = (e, postId) => {
    e.preventDefault();
    deletePost(postId);
  };

  const handleEditPostClick = (e, post) => {
    e.preventDefault();
    setPostToUpdate(post);
  };

  const handleGoToClick = (e, key, id) => {
    e.preventDefault();
    navigate("/", { replace: true });
    setPostToShow({ postId: key, userId: id });
  };

  const deletePost = async (postId) => {
    const response = await fetch(BASE_URL + `/api/Post/${postId}`, {
      method: "delete",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const deletePostResponse = await response.json();
    setTrigger(!trigger);
    setDeleteListener([...deleteListener, deletePostResponse]);
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

  if (!userPosts) {
    return (
      <ReactLoading
        type={"spinningBubbles"}
        color="#FF7960"
        height={60}
        width={60}
        className="loading"
      />
    );
  } else {
    return (
      <>
        {userPosts &&
          userPosts.map((post) => {
            if (!post.content.includes("````")) {
              return (
                <div className="profile-posts--post" key={post.postId}>
                  <div className="profile-post">
                    <div className="profile-posts-item--vote-container">
                      <h3 className="profile-posts-item--vote">
                        {post.vote} Votes
                      </h3>
                    </div>
                    <h3 className="profile-posts--title">{post.title}</h3>
                    <div className="profile-posts--content-container">
                      <p className="profile-posts--content">{post.content}</p>
                    </div>
                    {post.image && (
                      <div className="profile-posts--image-container">
                        <img
                          className="profile-posts--image"
                          src={`data:image/jpeg;base64,${post.image}`}
                        ></img>
                      </div>
                    )}
                    <div className="">
                      {post.tags.split(" ").map((tag) => (
                        <small
                          key={post.postId + tag}
                          className="post-item--tags"
                        >
                          {tag}
                        </small>
                      ))}
                    </div>
                    <small className="post-item--small">
                      Posted at: {post.createdAt.split("T")[0]}
                    </small>

                    <div className="profile-posts--bottom-container posts-profile--button-container">
                      <div>
                        <small className="post-item--small">
                          Comments: {post.comments.length}
                        </small>
                      </div>
                      <div className="profile-posts--edit-and-delete-container">
                        <div className="delete-post--button">
                          <button
                            className="delete-button"
                            onClick={(event) => {
                              handleDeletePostClick(event, post.postId);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                        <div className="edit-post--button">
                          <button
                            className="edit-button"
                            onClick={(event) => {
                              handleEditPostClick(event, post);
                            }}
                          >
                            Edit
                          </button>
                        </div>
                        <div className="">
                          <button
                            className="edit-button show-post--button"
                            onClick={(event) =>
                              handleGoToClick(event, post.postId, post.userId)
                            }
                          >
                            Go to post
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div className="profile-posts--post" key={post.postId}>
                  <div className="profile-post">
                    <div className="profile-posts-item--vote-container">
                      <h3 className="profile-posts-item--vote">
                        {post.vote} Votes
                      </h3>
                    </div>
                    <h3 className="profile-posts--title">{post.title}</h3>
                    <div className="profile-posts--content-container">
                      <div className="profile-posts--content">
                        {postContentParser(post.content)}
                      </div>
                    </div>
                    {post.image && (
                      <div className="profile-posts--image-container">
                        <img
                          className="profile-posts--image"
                          src={`data:image/jpeg;base64,${post.image}`}
                        ></img>
                      </div>
                    )}
                    <div className="">
                      {post.tags.split(" ").map((tag) => (
                        <small
                          key={post.postId + tag}
                          className="post-item--tags"
                        >
                          {tag}
                        </small>
                      ))}
                    </div>
                    <small className="post-item--small">
                      Posted at: {post.createdAt.split("T")[0]}
                    </small>

                    <div className="profile-posts--bottom-container posts-profile--button-container">
                      <div>
                        <small className="post-item--small">
                          Comments: {post.comments.length}
                        </small>
                      </div>
                      <div className="profile-posts--edit-and-delete-container">
                        <div className="delete-post--button">
                          <button
                            className="delete-button"
                            onClick={(event) => {
                              handleDeletePostClick(event, post.postId);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                        <div className="edit-post--button">
                          <button
                            className="edit-button"
                            onClick={(event) => {
                              handleEditPostClick(event, post);
                            }}
                          >
                            Edit
                          </button>
                        </div>
                        <div className="">
                          <button
                            className="edit-button show-post--button"
                            onClick={(event) =>
                              handleGoToClick(event, post.postId, post.userId)
                            }
                          >
                            Go to post
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
      </>
    );
  }
}

export default ProfilePosts;
