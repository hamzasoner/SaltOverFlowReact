import Post from "../Post/Post";
import AllPosts from "./AllPosts";
import React, { useContext, useState } from "react";
import { mainContext } from "../Home";
import Pagination from "./Pagination";

function RenderHomePage() {
  const props = useContext(mainContext);
  const postToShow = props.post.toShow;
  const currentPage = props.page.ear;
  const setCurrentPage = props.page.mouth;
  const [postsPerPage] = useState(5);
  const listOfPosts = props.list.ofPost;
  const sortedListOfPosts = [...listOfPosts].sort(
    (a, b) => b.postId - a.postId
  );
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedListOfPosts.slice(
    indexOfFirstPost,
    indexOfLastPost
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  if (!postToShow) {
    return (
      <>
        <AllPosts sortedListOfPosts={currentPosts} />
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={sortedListOfPosts.length}
          paginate={paginate}
        />
      </>
    );
  }
  if (postToShow) {
    return <Post />;
  }
}
export default RenderHomePage;
