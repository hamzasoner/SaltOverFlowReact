import React, { useState, useEffect, useContext, createContext } from "react";
import { GoogleLogout } from "react-google-login";
import CreatePost from "./CreatePost";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Main from "./Main";
import Profile from "./Profile/Profile";
import Search from "./Search";
import { profileContext } from "../App";
import { BASE_URL } from "../App";
import data from "./Tag_List.json";
import { compactDecrypt } from "jose";
export const mainContext = createContext();
function Home({ setProfile, clientId }) {
  const [activeUserId, setActiveUserId] = useState();
  const [listOfPosts, setListOfPosts] = useState([]);
  const [commentListener, setCommentListener] = useState([]);
  const [postListener, setPostListener] = useState([]);
  const [deleteListener, setDeleteListener] = useState([]);
  const [userList, setUserList] = useState({});
  const [postList, setPostList] = useState({});
  const [searchTag, setSearchTag] = useState("");
  const [postToShow, setPostToShow] = useState();
  const [voteListener, setVoteListener] = useState([]);
  const profile = useContext(profileContext);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setSearchTag(e.target.value);
  };
  const onSearchTag = (tag) => {
    setSearchTag(tag);
    // our api to fetch the search result
  };
  const handleClick = (e) => {
    e.preventDefault();
    if (!searchTag) {
      return alert("Please provide a search Tag");
    }
    navigate("/Search", { replace: true });
  };
  const handleHomeClick = (e) => {
    e.preventDefault();
    setPostToShow();
    navigate("/", { replace: true });
  };
  let userDictionary = {};
  let postDictionary = {};
  const getUsers = async () => {
    const response = await fetch(BASE_URL + "/api/user", {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const getUserResponse = await response.json();
    getUserResponse.map(
      (user) => (userDictionary[`${user.userId}`] = user.name)
    );
    setUserList(userDictionary);
  };
  const postNewUser = async (data = {}) => {
    const response = await fetch(BASE_URL + "/api/user", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const postNewUserResponse = await response.json();
    setActiveUserId(postNewUserResponse.userId);
    localStorage.setItem("activeUserId", postNewUserResponse.userId);
  };
  const getListOfPosts = async () => {
    const response = await fetch(BASE_URL + "/api/post", {
      method: "get",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const getListOfPostsResponse = await response.json();
    getListOfPostsResponse.map(
      (post) => (postDictionary[`${post.postId}`] = post.title)
    );
    setPostList(postDictionary);
    setListOfPosts(getListOfPostsResponse);
  };
  const logOut = () => {
    setProfile(null);
  };
  let user = {
    Email: profile.email,
    Name: profile.name,
  };
  useEffect(() => {
    postNewUser(user);
    getUsers();
    getListOfPosts();
  }, []);
  useEffect(() => {
    getListOfPosts();
  }, [postListener, deleteListener, commentListener, voteListener]);
  return (
    <>
      <nav className="navbar">
        <Link to="/" onClick={handleHomeClick}>
          Home
        </Link>
        <br />
        <Link to="/CreatePost">Create Post</Link>
        <br />
        <Link to="/Profile">Profile</Link>
        <br />
        <form>
          <input type="search" onChange={handleChange} value={searchTag} />
          <button onClick={handleClick} value="search">
            Search
          </button>
        </form>
        <div className="dropdown">
              {data
                .filter((item) => {
                  const searchTerm = searchTag.toLowerCase();
                  const fullTag = item.tagName.toLowerCase();
                  return (
                    searchTerm &&
                    fullTag.startsWith(searchTerm) &&
                    fullTag !== searchTerm
                  );
                })
                .slice(0, 10)
                .map((item) => (
                  <div
                    onClick={() => onSearchTag(item.tagName)}
                    className="dropdown-row"
                    key={item.tagName}
                  >
                    {item.tagName}
                  </div>
                ))}
            </div>
        <GoogleLogout
          clientId={clientId}
          buttonText="Log out"
          onLogoutSuccess={logOut}
        />
      </nav>
      <div className="main--container">
        <mainContext.Provider
          value={{
            list: { ofPost: listOfPosts, setOfPost: setListOfPosts },
            post: {
              toShow: postToShow,
              setToShow: setPostToShow,
              list: postList,
            },
            tag: { searchTag: searchTag, setSearchTag: setSearchTag },
            user: { list: userList, id: activeUserId },
            listener: { ear: postListener, mouth: setPostListener },
            delete: { ear: deleteListener, mouth: setDeleteListener },
            comment: { ear: commentListener, mouth: setCommentListener },
            vote: { ear: voteListener, mouth: setVoteListener },
          }}
        >
          <Routes>
            <Route path="/Search" element={<Search />} />
            <Route path="/CreatePost" element={<CreatePost />} />
            <Route path="/" element={<Main />} />
            <Route path="/Profile" element={<Profile />} />
          </Routes>
        </mainContext.Provider>
      </div>
    </>
  );
}
export default Home;


Text
````
code 
````
Text
````
code 2
````