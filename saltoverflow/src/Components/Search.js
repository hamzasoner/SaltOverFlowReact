import React, { useContext, useEffect, useState } from "react";
import { mainContext } from "./Home";
import { BASE_URL } from "../App";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import "../Loading.css";

function Search({ searchTrigger }) {
  const props = useContext(mainContext);
  const userList = props.user.list;
  const setPostToShow = props.post.setToShow;
  const searchQuery =
    props.query.searchQuery || localStorage.getItem("searchQuery");
  const setSearchQuery = props.query.setSearchQuery;
  const [searchResult, setSearchResult] = useState();
  const [stackSearchResult, setStackSearchResult] = useState();

  const navigate = useNavigate();

  const getSearchResults = async (queries) => {
    await fetch(BASE_URL + `/api/search/${queries}`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        contentType: "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        return response
          .json()
          .then((searchResponse) => setSearchResult(searchResponse));
      } else if (response.status === 404) {
        getStackResults(queries);
      } else {
        return Promise.reject("Error" + response.status);
      }
    });
  };

  const getStackResults = async (queries) => {
    const stackQueries = queries.replace(" ", ";");
    await fetch(
      `https://api.stackexchange.com/2.3/search/advanced?pagesize=10&order=desc&sort=votes&accepted=True&key=O4hwhHv*l)6fRqi8G4V3FQ((&tagged=${stackQueries}&site=stackoverflow`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          contentType: "application/json; ",
        },
      }
    )
      .then((response) => response.json())
      .then((result) => setStackSearchResult(result.items));
  };

  const handleClick = (e, key, id) => {
    e.preventDefault();
    e.preventDefault();
    navigate("/", { replace: true });
    setPostToShow({ postId: key, userId: id });
    setSearchResult();
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

  useEffect(() => {
    getSearchResults(searchQuery);
    setSearchQuery("");
    setSearchResult();
  }, [searchTrigger]);

  if (!searchResult && !stackSearchResult) {
    return (
      <>
        <h3 className="nothing-found-text">
          Sorry! Nothing was found. Maybe try another word?
        </h3>
        <ReactLoading
          type={"spinningBubbles"}
          color="#FF7960"
          height={60}
          width={60}
          className="loading"
        />
      </>
    );
  }

  if (searchResult && !stackSearchResult) {
    return (
      <>
        <div>
          <h3 className="profile--your-posts-text">
            {" "}
            posts found: {searchResult && searchResult.length}
          </h3>
        </div>
        {searchResult &&
          searchResult.map((post) => {
            if (!post.content.includes("````")) {
              return (
                <div
                  className="post-item--container search-post--container"
                  onClick={(event) =>
                    handleClick(event, post.postId, post.userId)
                  }
                  key={post.postId}
                >
                  <div className="profile-posts-item--vote-container search--vote-container">
                    <h3 className="profile-posts-item--vote">
                      Votes: {post.vote}
                    </h3>
                  </div>
                  <div className="post-item--right-container">
                    <h3 className="post-item--title">{post.title}</h3>
                    <p className="post-item--content">{post.content}</p>
                    {post.image && (
                      <img
                        className="post--img"
                        src={`data:image/jpeg;base64,${post.image}`}
                      ></img>
                    )}
                    <div className="post-item--right--bottom-right-container">
                      <div>
                        {post.tags.split(" ").map((tag) => (
                          <small
                            className="post-item--tags"
                            key={post.postId + tag}
                          >
                            {tag}
                          </small>
                        ))}
                      </div>
                      <small className="post-item--small">
                        Posted at: {post.createdAt}
                      </small>
                      <small className="post-item--small">
                        Posted by: <b>{userList[post.userId]}</b>
                      </small>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  className="post-item--container search-post--container"
                  onClick={(event) =>
                    handleClick(event, post.postId, post.userId)
                  }
                  key={post.postId}
                >
                  <div className="profile-posts-item--vote-container search--vote-container">
                    <h3 className="profile-posts-item--vote">
                      Votes: {post.vote}
                    </h3>
                  </div>
                  <div className="post-item--right-container">
                    <h3 className="post-item--title">{post.title}</h3>
                    <div className="post-item--content">
                      {postContentParser(post.content)}
                    </div>
                    {post.image && (
                      <img
                        className="post--img"
                        src={`data:image/jpeg;base64,${post.image}`}
                      ></img>
                    )}
                    <div className="post-item--right--bottom-right-container">
                      <div>
                        {post.tags.split(" ").map((tag) => (
                          <small
                            className="post-item--tags"
                            key={post.postId + tag}
                          >
                            {tag}
                          </small>
                        ))}
                      </div>
                      <small className="post-item--small">
                        Posted at: {post.createdAt}
                      </small>
                      <small className="post-item--small">
                        Posted by: <b>{userList[post.userId]}</b>
                      </small>
                    </div>
                  </div>
                </div>
              );
            }
          })}
      </>
    );
  }

  return (
    <div>
      <h3 className="nothing-found-text">
        Nothing was fount in SaltOverflow. But maybe these suggestions from
        Stack Overflow can help you?
      </h3>
      {stackSearchResult &&
        stackSearchResult.map((post) => (
          <div
            className="post-item--container stack-post"
            key={post.creation_date}
          >
            <h3 className="post-item--title">
              {post.title
                .replace(/&#39;/g, "'")
                .replace(/&quot;/g, '"')
                .replace(/&amp;/g, "&")}
            </h3>
            <div className="profile-posts--bottom-container search-link-container">
              <a
                className="edit-button update-comment--edit-button search-link"
                href={post.link}
              >
                View post
              </a>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Search;
