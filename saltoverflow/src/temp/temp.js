import React, { useState, useContext } from "react";
import { mainContext } from "./Home";
import { BASE_URL } from "../App";
import FileBase64 from "react-file-base64";
​
function CreatePost() {
  const [postPreview, setPostPreview] = useState({});
  const props = useContext(mainContext);
  const activeUserId = props.user.id;
  const listOfPosts = props.list.ofPost;
  const postListener = props.listener.ear;
  const setPostListener = props.listener.mouth;
​
  const initialFormData = Object.freeze({
    userId: "",
    title: "",
    content: "",
    tags: "",
    image: [],
  });
​
  const [formData, setFormData] = useState(initialFormData);
  const [img, setImg] = useState(null);
  const [inputAlert, setInputAlert] = useState(false);
​
  const PostToCreate = {
    userId: activeUserId,
    title: formData.title,
    content: formData.content,
    tags: formData.tags,
    image: img,
  };
​
  const postPost = async (PostToCreate) => {
    const response = await fetch(BASE_URL + "/api/post", {
      method: "post",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(PostToCreate),
    });
    const postResponse = await response.json();
    setPostListener([...postListener, postResponse]);
    console.log(listOfPosts);
    console.log(postPreview);
    return postResponse;
  };
​
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
​
  const handleClick = (e) => {
    e.preventDefault();
    if (!PostToCreate.title || !PostToCreate.tags || !PostToCreate.content) {
      setInputAlert(!inputAlert);
    } else {
      postPost(PostToCreate);
      setPostPreview(PostToCreate);
      setFormData(initialFormData);
    }
  };
​
  return (
    <>
      {inputAlert && (
        <div>
          <h2>All fields must be filled!</h2>
        </div>
      )}
      <div className="create-post--main-container">
        <form className="create-post--form" method="post">
          <label htmlFor="title">Question</label>
          <input
            name="title"
            type="text"
            placeholder="Question..."
            value={formData.title}
            onChange={handleChange}
          />
          <br />
​
          <label htmlFor="tags">Tags</label>
          <input
            name="tags"
            type="text"
            placeholder="Each tag seperated by space"
            value={formData.tags}
            onChange={handleChange}
          />
          <br />
​
          <FileBase64
            type="file"
            multiple={false}
            onDone={({ base64 }) => {
              let strImg = base64.split(",")[1];
              setImg(strImg);
            }}
            onChange={(e) => e.target.files[0]}
          />
​
          <label htmlFor="content">Description</label>
          <textarea
            name="content"
            placeholder="Description..."
            value={formData.content}
            onChange={handleChange}
          />
          <br />
​
          <button
            className="button--primary"
            type="submit"
            onClick={handleClick}
          >
            Post
          </button>
        </form>
      </div>
      {postPreview && (
        <div>
          <h2>{postPreview.title}</h2>
          {postPreview.image && (
            <img
              className="post--img"
              src={`data:image/jpeg;base64,${postPreview.image}`}
            ></img>
          )}
​
          <p className="post-content">{postPreview.content}</p>
        </div>
      )}
    </>
  );
}
​
export default CreatePost;