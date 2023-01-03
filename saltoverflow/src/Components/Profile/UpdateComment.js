import React, { useContext, useState } from "react";
import { mainContext } from "../Home";
import { BASE_URL } from "../../App";

function UpdateComment({
  commentToUpdate,
  setCommentToUpdate,
  trigger,
  setTrigger,
}) {
  const props = useContext(mainContext);
  const setPostListener = props.listener.mouth;
  const postListener = props.listener.ear;

  const initialFormData = Object.freeze({
    text: commentToUpdate.text,
    userId: commentToUpdate.userId,
    postId: commentToUpdate.postId,
  });

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newCommentToUpdate = {
      userId: commentToUpdate.userId,
      postId: formData.postId,
      text: formData.text,
    };
    updateComment(commentToUpdate.commentId, newCommentToUpdate);
    setCommentToUpdate();
  };

  const updateComment = async (commentId, comment) => {
    const response = await fetch(BASE_URL + `/api/comment/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });
    const updateCommentResponse = await response.json();
    setTrigger(!trigger);
    setPostListener([...postListener, updateCommentResponse]);
    return updateCommentResponse;
  };

  return (
    <div className="profile-comments-container">
      <form method="post">
        <label className="update-comment--label">Edit comment:</label>
        <input
          className="post--form--commentarea"
          name="text"
          type="text"
          value={formData.text}
          onChange={handleChange}
        ></input><br/>
        <div className="profile-posts--bottom-container">
          <button  className="edit-button update-comment--edit-button" onClick={handleSubmit}>Update</button>
        </div>
        
      </form>
    </div>
  );
}

export default UpdateComment;
