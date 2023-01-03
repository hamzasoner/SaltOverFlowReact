import React, { useState, useContext } from "react";
import { mainContext } from "../Home";
import { BASE_URL } from "../../App";
import FileBase64 from "react-file-base64";

function UpdatePost({ PostToUpdate, setPostToUpdate, trigger, setTrigger }) {
  const props = useContext(mainContext);
  const setPostListener = props.listener.mouth;
  const postListener = props.listener.ear;

  const initialFormData = Object.freeze({
    userId: PostToUpdate.userId,
    title: PostToUpdate.title,
    content: PostToUpdate.content,
    tags: PostToUpdate.tags,
    image: PostToUpdate.image,
  });

  const [formData, setFormData] = useState(initialFormData);
  const [img, setImg] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newPostToUpdate = {
      userId: PostToUpdate.userId,
      title: formData.title,
      content: formData.content,
      tags: formData.tags,
      image: img,
    };
    updatePost(PostToUpdate.postId, newPostToUpdate);
    setPostToUpdate();
  };

  const updatePost = async (postId, post) => {
    const response = await fetch(BASE_URL + `/api/post/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    const updatePostResponse = await response.json();
    setPostListener([...postListener, updatePostResponse]);
    setTrigger(!trigger);
    return updatePostResponse;
  };

  return (
    <div className="create-post--main-container">
      <form className="create-post--form" method="post">
        <label>Title</label>
        <input
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
        ></input>
        <br />
        <label>Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
        >
          <br />
        </textarea>
        <label>Tags</label>
        <input
          name="tags"
          type="text"
          value={formData.tags}
          onChange={handleChange}
        ></input>
        <br />
        <FileBase64
          type="file"
          multiple={false}
          onDone={({ base64 }) => {
            let strImg = base64.split(",")[1];
            setImg(strImg);
          }}
          onChange={(e) => e.target.files[0]}
        />
        <button className="button--primary" onClick={handleSubmit}>
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdatePost;
