import React, { useState, useContext } from "react";
import { up } from "react-icons-kit/entypo/up";
import { down } from "react-icons-kit/entypo/down";
import { Icon } from "react-icons-kit";
import { BASE_URL } from "../../App";
import { mainContext } from "../Home";
function Vote({ post }) {
  const postObj = post;
  const props = useContext(mainContext);
  const voteListener = props.vote.ear;
  const setVoteListener = props.vote.mouth;
  let voteCounter = post.vote;
  let voteExists;
  if (!localStorage.getItem(postObj.postId)) {
    voteExists = true;
  }
  if (localStorage.getItem(postObj.postId)) {
    voteExists = false;
  }
  const [voteUp, setVoteUp] = useState(voteExists);
  const [voteNr, setVoteNr] = useState(postObj.vote);
  const updateVote = async (postId, post) => {
    const response = await fetch(BASE_URL + `/api/post/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    const updateVoteResponse = await response.json();
    setVoteListener([...voteListener, updateVoteResponse]);
    return updateVoteResponse;
  };
  const disabled = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };
  const upvote = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setVoteUp(!voteUp);
    let voteSituation = voteNr + 1;
    if (voteUp) {
      setVoteNr(voteNr + 1);
      voteCounter = voteCounter + 1;
      localStorage.setItem(postObj.postId, JSON.stringify(true));
    }
    if (!voteUp) {
      setVoteNr(voteNr - 1);
      voteCounter = voteCounter - 1;
      voteSituation = voteNr - 1;
      localStorage.removeItem(postObj.postId);
    }
    const postToUpdate = {
      userId: postObj.userId,
      title: postObj.title,
      content: postObj.content,
      tags: postObj.tags,
      image: postObj.image,
      vote: voteSituation,
    };
    updateVote(postObj.postId, postToUpdate);
  };
  return (
    <>
      {voteExists && (
        <div>
          <Icon
            className="upvote"
            style={{ color: "rgb(203, 203, 203)" }}
            icon={up}
            size={32}
            onClick={upvote}
          />
          <h3 className="vote--counter">{voteNr}</h3>
          <Icon
            style={{ color: "rgb(255, 139, 112)" }}
            onClick={disabled}
            icon={down}
            size={32}
          />
        </div>
      )}
      {!voteExists && (
        <div>
          <Icon
            style={{ color: "rgb(255, 139, 112)" }}
            icon={up}
            size={32}
            onClick={disabled}
          />
          <h3 className="vote--counter">{voteNr}</h3>
          <Icon
            className="downvote"
            style={{ color: "rgb(203, 203, 203)" }}
            onClick={upvote}
            icon={down}
            size={32}
          />
        </div>
      )}
    </>
  );
}
export default Vote;