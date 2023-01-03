import React, { useContext } from "react";
import { mainContext } from "../Home";
import PostItem from "./PostItem";
import ReactLoading from "react-loading";

function AllPosts({ sortedListOfPosts }) {
  const props = useContext(mainContext);
  const userList = props.user.list;
  const setPostToShow = props.post.setToShow;

  const handleClick = (e, key, id) => {
    e.preventDefault();
    setPostToShow({ postId: key, userId: id });
  };

  if (!sortedListOfPosts) {
    return (
      <ReactLoading
        className="loading"
        type={"spinningBubbles"}
        color="#FF7960"
        height={60}
        width={60}
      />
    );
  }

  if (sortedListOfPosts) {
    return (
      <>
        {sortedListOfPosts &&
          [...sortedListOfPosts].map((post) => (
            <div
              onClick={(event) => handleClick(event, post.postId, post.userId)}
              key={post.postId}
              className="post-item--container"
            >
              <PostItem post={post} userList={userList} />
            </div>
          ))}
      </>
    );
  }
}
export default AllPosts;
