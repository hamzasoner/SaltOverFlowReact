import React, { useEffect, useState, useContext } from "react";
import { BASE_URL, profileContext } from "../../App";
import { mainContext } from "../Home";
import UpdatePost from "./UpdatePost";
import UpdateComment from "./UpdateComment";
import ProfileComments from "./ProfileComments";
import ProfilePosts from "./ProfilePosts";

function Profile() {
  const [userPosts, setUserPosts] = useState();
  const [userComments, setUserComments] = useState();
  const [trigger, setTrigger] = useState(false);

  const profile = useContext(profileContext);
  const props = useContext(mainContext);

  const postToUpdate = props.post.toUpdate;
  const setPostToUpdate = props.post.setToUpdate;
  const commentToUpdate = props.comment.toUpdate;
  const setCommentToUpdate = props.comment.setToUpdate;
  const userList = props.user.list;
  const activeUserId = props.user.id || localStorage.getItem("activeUserId");

  const getUserComments = async (userId) => {
    const response = await fetch(BASE_URL + `/api/comment/user/${userId}`, {
      method: "get",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const getUserCommentsResponse = await response.json();
    setUserComments(getUserCommentsResponse);
  };

  const getUserPosts = async (userId) => {
    const response = await fetch(BASE_URL + `/api/Post/user/${userId}`, {
      method: "get",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const getUserPostsResponse = await response.json();
    setUserPosts(getUserPostsResponse);
  };

  useEffect(() => {
    getUserPosts(activeUserId);
    getUserComments(activeUserId);
  }, []);

  useEffect(() => {
    getUserPosts(activeUserId);
    getUserComments(activeUserId);
  }, [trigger]);

  if (commentToUpdate) {
    return (
      <>
        <UpdateComment
          commentToUpdate={commentToUpdate}
          setCommentToUpdate={setCommentToUpdate}
          trigger={trigger}
          setTrigger={setTrigger}
        />
      </>
    );
  }

  if (postToUpdate) {
    return (
      <>
        <UpdatePost
          PostToUpdate={postToUpdate}
          setPostToUpdate={setPostToUpdate}
          trigger={trigger}
          setTrigger={setTrigger}
        />
      </>
    );
  }

  if (!postToUpdate && !commentToUpdate) {
    return (
      <>
        <div className="profile-information--container">
          <div className="profile--image-continer">
            <img
              className="profile--image"
              src={profile.profile.picture}
              alt="profile image"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="profile--userinfo-container">
            <h3 className="profile--user-name">{userList[activeUserId]}</h3>
            <h4 className="profile--user-email">{profile.profile.email}</h4>
          </div>
        </div>
        <h3 className="profile--your-posts-text">Your Posts:</h3>
        <ProfilePosts
          setPostToUpdate={setPostToUpdate}
          trigger={trigger}
          setTrigger={setTrigger}
          userPosts={userPosts}
        />
        <h2 className="profile--your-posts-text"> Your Comments: </h2>
        <div className="profile-comments-component">
          <ProfileComments
            setCommentToUpdate={setCommentToUpdate}
            trigger={trigger}
            setTrigger={setTrigger}
            userComments={userComments}
          />
        </div>
      </>
    );
  }
}

export default Profile;
