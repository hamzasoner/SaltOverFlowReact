import React, { useEffect, useState } from "react";
import Vote from "./Vote";

function PostItem({ post, userList }) {
  const [postPreview, setPostPreview] = useState();
  const [parsedPostPreview, setParsedPostPreview] = useState();

  const postContentParser = (post) => {
    if (post.content.includes("````")) {
      const contentSplit = post.content.split("````");
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
      
      const PostParsed = {
        userId: post.userId,
        title: post.title,
        content: contentObject,
        tags: post.tags,
        image: post.image,
        postId: post.postId,
        createdAt: post.createdAt,
        comments: post.comments,
        vote: post.vote,
      };

      setPostPreview();
      setParsedPostPreview(PostParsed);
    }
    else {
      setParsedPostPreview();
      setPostPreview(post);
    }
  };

  useEffect(() => {
    postContentParser(post);
  }, []);

  return (
    <>
      <div className="post-item--vote-container">
        <Vote post={post} />
      </div>
      {parsedPostPreview && (
        <>
          <div className="post-item--right-container">
            <h3 className="post-item--title">{parsedPostPreview.title}</h3>
            <div className="post-item--content-container">
              <div className="post-item--content">
                {parsedPostPreview.content &&
                  Object.keys(parsedPostPreview.content).map((key) => {
                    if (key % 2 !== 0) {
                      return <p key={key}>{parsedPostPreview.content[key]}</p>;
                    }
                    if (key % 2 === 0) {
                      return (
                        <div className="code-block"  key={key}>
                          <code >{parsedPostPreview.content[key]}</code>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
            <div className="post-item--right--bottom-container">
              <div className="post-item--right--bottom-right-container">
                <div>
                  {parsedPostPreview.tags.split(" ").map((tag) => (
                    <small
                      className="post-item--tags"
                      key={parsedPostPreview.postId + tag}
                    >
                      {tag}
                    </small>
                  ))}
                </div>
                <small className="post-item--small">
                  Posted at: {parsedPostPreview.createdAt.split("T")[0]}
                </small>
                <small className="post-item--small">
                  Posted by: <b>{userList[parsedPostPreview.userId]}</b>{" "}
                </small>
              </div>
              <div className="post-item--comment-container">
                <small className="post-item--small">
                  Comments: {parsedPostPreview.comments.length}
                </small>
              </div>
            </div>
          </div>
        </>
      )}
      {postPreview && (
        <>
          <div className="post-item--right-container">
            <h3 className="post-item--title">{postPreview.title}</h3>
            <div className="post-item--content-container">
              <p className="post-item--content">{postPreview.content}</p>
            </div>
            <div className="post-item--right--bottom-container">
              <div className="post-item--right--bottom-right-container">
                <div>
                  {postPreview.tags.split(" ").map((tag) => (
                    <small
                      className="post-item--tags"
                      key={postPreview.postId + tag}
                    >
                      {tag}
                    </small>
                  ))}
                </div>
                <small className="post-item--small">
                  Posted at: {postPreview.createdAt.split("T")[0]}
                </small>
                <small className="post-item--small">
                  Posted by: <b>{userList[postPreview.userId]}</b>{" "}
                </small>
              </div>
              <div className="post-item--comment-container">
                <small className="post-item--small">
                  Comments: {postPreview.comments.length}
                </small>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default PostItem;
