import React, { useState, useEffect, useContext, createContext } from "react";
import { home } from "react-icons-kit/icomoon/home";
import { androidSearch } from "react-icons-kit/ionicons/androidSearch";
import { ic_border_color } from "react-icons-kit/md/ic_border_color";
import { ic_person } from "react-icons-kit/md/ic_person";
import { Icon } from "react-icons-kit";
import CreatePost from "./CreatePost/CreatePost";
import {
  Link,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import RenderHomePage from "./Home/RenderHomePage";
import Profile from "./Profile/Profile";
import Search from "./Search";
import { profileContext } from "../App";
import { BASE_URL } from "../App";
import data from "../Tag_List.json";

export const mainContext = createContext();

function Home() {
  const [activeUserId, setActiveUserId] = useState();
  const [listOfPosts, setListOfPosts] = useState([]);
  const [commentListener, setCommentListener] = useState([]);
  const [postListener, setPostListener] = useState([]);
  const [deleteListener, setDeleteListener] = useState([]);
  const [userList, setUserList] = useState({});
  const [postList, setPostList] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postToUpdate, setPostToUpdate] = useState();
  const [commentToUpdate, setCommentToUpdate] = useState();
  const [searchTrigger, setSearchTrigger] = useState(false);
  const [postToShow, setPostToShow] = useState();

  const [voteListener, setVoteListener] = useState([]);

  const props = useContext(profileContext);
  const profile = props.profile;
  const setProfile = props.setProfile;

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const onSearchTagClick = (tag) => {
    setSearchQuery(tag);
    document.getElementById("searchbar").focus();
  };

  const handleClick = (e) => {
    e.preventDefault();
    setSearchTrigger(!searchTrigger);
    if (!searchQuery) {
      console.log("");
      window.localStorage.setItem("searchQuery", searchQuery);
    } else {
      if (location.pathname === "/Search") {
        navigate(0);
        window.localStorage.setItem("searchQuery", searchQuery);
      } else {
        window.localStorage.setItem("searchQuery", searchQuery);
        navigate("/Search", { replace: true });
      }
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    setPostToShow();
    setCurrentPage(1);
    navigate("/", { replace: true });
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    setPostToUpdate();
    setCommentToUpdate();
    navigate("/Profile", { replace: true });
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
    window.localStorage.setItem("token", null);
    window.localStorage.setItem("isLoggenIn", false);
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
        <div className="log-out--button-container">
          <button className="log-out--button" onClick={logOut}>
            Log Out
          </button>
        </div>

        <div className="navbar--link-container">
          <Link
            to="/"
            onClick={handleHomeClick}
            style={{ textDecoration: "none" }}
          >
            <span className="navbar--link">
              <Icon size={32} icon={home} />{" "}
              <span className="home-link">Home</span>
            </span>
          </Link>
          <Link to="/CreatePost" style={{ textDecoration: "none" }}>
            <span className="navbar--link">
              <Icon size={32} icon={ic_border_color} />
              <span className="home-link">Create Post</span>
            </span>
          </Link>
          <Link
            to="/Profile"
            onClick={handleProfileClick}
            style={{ textDecoration: "none" }}
          >
            <span className="navbar--link">
              <Icon size={32} icon={ic_person} />
              <span className="home-link">Profile</span>
            </span>
          </Link>
        </div>
        <div className="search--container">
          <form className="search-form" onSubmit={handleClick}>
            <div className="row">
              <input
                type="search"
                placeholder="Search for tags..."
                onChange={handleChange}
                value={searchQuery}
                required
              />
              <span className="lupa">
                <Icon onClick={handleClick} icon={androidSearch} size={32} />
              </span>
            </div>
            <div className="dropdown-search">
              {data
                .filter((item) => {
                  let searchTerm = "";
                  if (searchQuery.split(" ").length === 1) {
                    searchTerm = searchQuery;
                  } else {
                    searchTerm = searchQuery.split(" ").at(-1);
                  }
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
                    onClick={() => onSearchTagClick(item.tagName)}
                    className="dropdown-row"
                    key={item.tagName}
                  >
                    {item.tagName}
                  </div>
                ))}
            </div>
          </form>
        </div>
      </nav>
      <div className="main--container">
        <mainContext.Provider
          value={{
            list: { ofPost: listOfPosts, setOfPost: setListOfPosts },
            post: {
              toShow: postToShow,
              setToShow: setPostToShow,
              list: postList,
              toUpdate: postToUpdate,
              setToUpdate: setPostToUpdate,
            },
            query: { searchQuery: searchQuery, setSearchQuery: setSearchQuery },
            user: { list: userList, id: activeUserId },
            listener: { ear: postListener, mouth: setPostListener },
            delete: { ear: deleteListener, mouth: setDeleteListener },
            comment: {
              ear: commentListener,
              mouth: setCommentListener,
              toUpdate: commentToUpdate,
              setToUpdate: setCommentToUpdate,
            },
            vote: { ear: voteListener, mouth: setVoteListener },
            page: { ear: currentPage, mouth: setCurrentPage },
          }}
        >
          <Routes>
            <Route
              path="/Search"
              element={<Search searchTrigger={searchTrigger} />}
            />
            <Route path="/CreatePost" element={<CreatePost />} />
            <Route path="/" element={<RenderHomePage />} />
            <Route path="/Profile" element={<Profile />} />
          </Routes>
        </mainContext.Provider>
      </div>
    </>
  );
}

export default Home;
