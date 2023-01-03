import React, { useState, createContext, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home";

export const profileContext = createContext();
export const BASE_URL = 'https://saltoverflowcli.azurewebsites.net';

export const clientId =
  "182046444155-u1n0sk6e1hoeesb2tkvhne5ea2799cl8.apps.googleusercontent.com";

function App() {
  const [profile, setProfile] = useState();
  const [falseLogin, setFalseLogin] = useState(false);

  const parseJwtAndVerifyUser = async (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    if (payload.hd === "appliedtechnology.se" || payload.hd === "salt.dev") {
      setProfile(payload);
      window.localStorage.setItem("isLoggenIn", true);
    } else {
      setFalseLogin(!falseLogin);
    }
  };

  const onSuccess = (res) => {
    console.log("success:", res);
    parseJwtAndVerifyUser(res.credential);
    window.localStorage.setItem("token", res.credential);
  };

  const onFailure = (err) => {
    console.log("failed:", err);
  };

  useEffect(() => {
    const isLoggedIn = window.localStorage.getItem("isLoggenIn");
    if (isLoggedIn) {
      const token = window.localStorage.getItem("token");
      parseJwtAndVerifyUser(token);
    }
  }, []);

  return (
    <div className="body-container">
      <div className="main--top">
        <h2 className="logo">
          <span className="logo--salt">Salt</span>
          <span className="logo--overflow">Overflow</span>
        </h2>
      </div>
      {profile ? (
        <>
          <profileContext.Provider
            value={{ profile: profile, setProfile: setProfile }}
          >
            <Routes>
              <Route
                path="*"
                element={<Home setProfile={setProfile} clientId={clientId} />}
              />
            </Routes>
          </profileContext.Provider>
        </>
      ) : falseLogin ? (
        <div className="flex-centered">
          <GoogleLogin
            className="google-login"
            buttonText="Sign in with Google"
            onSuccess={onSuccess}
            onFailure={onFailure}
            isSignedIn={true}
          />

          <h2 className="Access-denied-text">
            Access denied, only for Saltees!
          </h2>
        </div>
      ) : (
        <div className="flex-centered">
          <GoogleLogin
            className="google-login"
            buttonText="Sign in with Google"
            onSuccess={onSuccess}
            onFailure={onFailure}
            isSignedIn={true}
          />
        </div>
      )}
    </div>
  );
}

export default App;
