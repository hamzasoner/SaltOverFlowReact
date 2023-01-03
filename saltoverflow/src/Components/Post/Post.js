import React, { useEffect, useState, useContext } from "react";
import PostComments from "./PostComments";
import { mainContext } from "../Home";
import { BASE_URL } from "../../App";
import ReactLoading from "react-loading";

function Post() {
  const [postInfo, setPostInfo] = useState();
  const [commentList, setCommentList] = useState([]);

  const props = useContext(mainContext);
  const activeUserId = props.user.id;
  const userList = props.user.list;
  const postToShow = props.post.toShow;
  const commentListener = props.comment.ear;
  const setCommentListener = props.comment.mouth;

  const initialFormData = Object.freeze({
    userId: "",
    text: "",
  });

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({
      userId: activeUserId,
      text: e.target.value,
    });
  };

  const handleCommentClick = (e) => {
    e.preventDefault();
    postComment(postInfo.postId, formData);
    setFormData(initialFormData);
  };

  const postComment = async (postId, comment) => {
    const response = await fetch(BASE_URL + `/api/comment/${postId}`, {
      method: "post",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });
    const postCommentResponse = await response.json();
    setCommentListener([...commentListener, postCommentResponse]);
  };

  const getPost = async (postId) => {
    const response = await fetch(BASE_URL + `/api/post/${postId}`, {
      method: "get",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const getPostResponse = await response.json();
    const postToPrint = postContentParser(getPostResponse);
    setPostInfo(postToPrint);
  };

  const postContentParser = (post) => {
    const contentSplit = post.content.split("````");
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

    const PostParsed = {
      userId: post.userId,
      title: post.title,
      content: contentObject,
      tags: post.tags,
      image: post.image,
      createdAt: post.createdAt,
      comments: post.comments,
      vote: post.vote,
      postId: post.postId,
    };

    return PostParsed;
  };

  useEffect(() => {
    getPost(postToShow.postId);
  }, []);

  if (!postInfo) {
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
        {postInfo && (
          <div className="post--item">
            <div className="profile-posts-item--vote-container">
              <h3 className="profile-posts-item--vote">
                {postInfo.vote} Votes
              </h3>
            </div>
            <h3 className="post--title">{postInfo.title}</h3>

            <div className="profile-posts--content">
              {postInfo.content &&
                Object.keys(postInfo.content).map((key) => {
                  if (key % 2 !== 0) {
                    return <p key={key}>{postInfo.content[key]}</p>;
                  }
                  if (key % 2 === 0) {
                    return (
                      <div className="code-block" key={key}>
                        <code>{postInfo.content[key]}</code>
                      </div>
                    );
                  }
                })}
            </div>
            {postInfo.image && (
              <div className="profile-posts--image-container">
                <img
                  className="profile-posts--image"
                  src={`data:image/jpeg;base64,${postInfo.image}`}
                ></img>
              </div>
            )}
            <div>
              {postInfo.tags.split(" ").map((tag) => (
                <small className="post-item--tags" key={postInfo.postId + tag}>
                  {tag}
                </small>
              ))}
            </div>
            <small className="post-item--small">
              Posted at: {postInfo.createdAt.split("T")[0]}
            </small>

            <small className="post-item--small">
              Posted by: <b>{userList[postInfo.userId]}</b>
            </small>
            <form className="post--form" method="post">
              <textarea
                className="post--form--commentarea"
                placeholder="Write your comment here..."
                value={formData.text}
                onChange={handleChange}
              />
              <div className="comment-post--button">
                <button
                  className="post--comment-button edit-button"
                  onClick={handleCommentClick}
                >
                  Comment
                </button>
              </div>
            </form>
            <PostComments
              userList={userList}
              postId={postInfo.postId}
              commentList={commentList}
              commentListener={commentListener}
              setCommentList={setCommentList}
            />
          </div>
        )}
      </>
    );
  }
}

export default Post;
