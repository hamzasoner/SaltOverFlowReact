import React, { useState, useContext } from "react";
import { mainContext } from "../Home";
import { BASE_URL } from "../../App";
import FileBase64 from "react-file-base64";
import { infoCircle } from "react-icons-kit/fa/infoCircle";
import { Icon } from "react-icons-kit";

function CreatePost() {
  const props = useContext(mainContext);
  const activeUserId = props.user.id;
  const postListener = props.listener.ear;
  const setPostListener = props.listener.mouth;

  const initialFormData = Object.freeze({
    userId: "",
    title: "",
    content: "",
    tags: "",
    image: [],
  });

  const [formData, setFormData] = useState(initialFormData);
  const [img, setImg] = useState(null);
  const [inputAlert, setInputAlert] = useState(false);
  const [inputAlertCode, setInputAlertCode] = useState(false);

  const PostToCreate = {
    userId: activeUserId,
    title: formData.title,
    content: formData.content,
    tags: formData.tags,
    image: img,
  };

  const postPost = async (PostToCreate) => {
    const response = await fetch(BASE_URL + "/api/post", {
      method: "post",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(PostToCreate),
    });
    const postResponse = await response.json();
    setPostListener([...postListener, postResponse]);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (!PostToCreate.title || !PostToCreate.tags || !PostToCreate.content) {
      setInputAlert(!inputAlert);
    }
    if (PostToCreate.content.includes("````")) {
      if (PostToCreate.content.match(/````/g).length % 2 !== 0) {
        setInputAlertCode(!inputAlertCode);
      } else {
        postPost(PostToCreate);
        setFormData(initialFormData);
      }
    } else {
      postPost(PostToCreate);
      setFormData(initialFormData);
    }
  };

  return (
    <>
      {inputAlert && (
        <div>
          <h2>All fields must be filled!</h2>
        </div>
      )}
      {inputAlertCode && (
        <div>
          <h2>Post failed, please check code blocks!</h2>
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

          <div className="search-container">
            <div className="search-inner">
              <label htmlFor="tags">Add tags</label>
              <input
                className="margin-top-20"
                name="tags"
                id="tags-input"
                type="text"
                placeholder="seperate tags by space"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </div>

          <FileBase64
            type="file"
            multiple={false}
            onDone={({ base64 }) => {
              let strImg = base64.split(",")[1];
              setImg(strImg);
            }}
            onChange={(e) => e.target.files[0]}
          />

          <div>
            <label htmlFor="content">Description</label>
            <span
              className="infocircle"
              title="Provide a detailed explanation with your question.
            You can create code blocks by surrounding your code with “````” (four back ticks).
            You have to provide indentation yourself.
            Example: I have a problem with the following code:
            ````
            console.log(“Hello world!“);
            ````
            It does not render."
            >
              <Icon icon={infoCircle} />
            </span>
          </div>
          <textarea
            name="content"
            placeholder="Description..."
            value={formData.content}
            onChange={handleChange}
          />
          <br />
          <div className="flex-end">
            <button
              type="submit"
              className="button--primary"
              onClick={handleClick}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreatePost;
