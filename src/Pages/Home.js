import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Toast from "../Toast";

const Home = () => {
  const [token, settoken] = useState(localStorage.getItem("TokenPostApp"));
  const [Posts, setPosts] = useState([]);
  const [toastMsg, settoastMsg] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
    }
  }, [token]);

  useEffect(() => {
    fetch("https://banao-mern-assignment-ayush.onrender.com/post/Posts", {
      headers: {
        "Content-Type": "application/json",
        authtoken: token,
      },
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => setPosts(data.allPosts))
      .catch((data) => console.log(data));
  }, [Posts]);

  const handleLogout = () => {
    localStorage.removeItem("TokenPostApp");
    settoken(null);
  };

  const showAddPost = () => {
    document.querySelector(".Post").style.display = "flex";
  };
  const closeAddPost = () => {
      document.querySelector(".Post").style.display = "none";
    };
  const showUpdatePost = (url, caption, id) => {
    document.querySelector(".UpdatePost").setAttribute("postID", id)
    document.querySelector("#UrlUpdate").value = url
    document.querySelector("#CapUpdate").value = caption
    document.querySelector(".UpdatePost").style.display = "flex";
  };
  const closeUpdatePost = () => {
      document.querySelector(".UpdatePost").style.display = "none";
    };
    const showCMT = () => {
        document.querySelector(".comments").classList.toggle("showCMT")
    }
    const handlelike = async (e,UserID, PostID)=> {
      let method 

      if(e.target.classList.contains("likes")) {
        e.target.classList.toggle("liked")
      }
      else if (e.target.parentElement.classList.contains("likes")){
        e.target.parentElement.classList.toggle("liked")
      }
        if(e.target.classList.contains("liked") || e.target.parentElement.classList.contains("liked")) {
            method = 'PUT'
        }
        else {
            method = 'DELETE'
        }
        const response = await fetch("https://banao-mern-assignment-ayush.onrender.com/post/users/like", {
      method: method,
      headers: {
        "Content-Type": "application/json",
        authtoken: token,
      },
      body: JSON.stringify({ UserID, PostID }),
    });
    const data = await response.json();
    if (data.success) {
      setPosts([])
    } else {
      e.target.classList.remove("liked")
      e.target.parentElement.classList.remove("liked")
      if (typeof data.errors[0].msg === "string") {
        settoastMsg(data.errors[0].msg);
      } else {
        settoastMsg(data.errors[0]);
      }
    }
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imgurl = document.querySelector("#Url").value;
    let caption = document.querySelector("#Cap").value;
    const response = await fetch("https://banao-mern-assignment-ayush.onrender.com/post/CreatePost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authtoken: token,
      },
      body: JSON.stringify({ imgurl, caption }),
    });
    const data = await response.json();
    if (data.success) {
      settoastMsg("Post Added");
      setPosts([]);
    } else {
      if (typeof data.errors[0].msg === "string") {
        settoastMsg(data.errors[0].msg);
      } else {
        settoastMsg(data.errors[0]);
      }
    }
    closeAddPost()
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    let PostID = document.querySelector(".UpdatePost").getAttribute("postID")
    let imgurl = document.querySelector("#UrlUpdate").value;
    let caption = document.querySelector("#CapUpdate").value;
    const response = await fetch("https://banao-mern-assignment-ayush.onrender.com/post/UpdatePost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authtoken: token,
      },
      body: JSON.stringify({ imgurl, caption, PostID }),
    });
    const data = await response.json();
    if (data.success) {
      settoastMsg("Post Updated");
      setPosts([]);
    } else {
      if (typeof data.errors[0].msg === "string") {
        settoastMsg(data.errors[0].msg);
      } else {
        settoastMsg(data.errors[0]);
      }
    }
    closeUpdatePost()
  };

const deletePost =async (PostID) => {
    const response = await fetch("https://banao-mern-assignment-ayush.onrender.com/post/users/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authtoken: token,
        },
        body: JSON.stringify({ PostID }),
      });
      const data = await response.json();
      if (data.success) {
        settoastMsg("Post Deleted");
        setPosts([]);
      } else {
        if (typeof data.errors[0].msg === "string") {
          settoastMsg(data.errors[0].msg);
        } else {
          settoastMsg(data.errors[0]);
        }
      }
}
  const handleCommentSubmit = async (e, UserID, PostID) => {
    e.preventDefault();
    let cmt = document.querySelector("#comment").value;
    const response = await fetch("https://banao-mern-assignment-ayush.onrender.com/post/users/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authtoken: token,
      },
      body: JSON.stringify({ UserID, PostID, cmt }),
    });
    const data = await response.json();
    if (data.success) {
      settoastMsg("Comment Added");
      setPosts([]);
    } else {
      if (typeof data.errors[0].msg === "string") {
        settoastMsg(data.errors[0].msg);
      } else {
        settoastMsg(data.errors[0]);
      }
    }
  };


  return (
    <div className="home-container">
      <nav>
        <div className="logo">
          <h1>Post App</h1>
        </div>
        <div onClick={handleLogout} className="logout">
          <button>Logout</button>
        </div>
      </nav>
      <main>
        <h3>Posts</h3>

        <div className="posts">
          {Posts[0] ? (
            Posts.map((post) => (
              <div key={post._id} className="post">
              <div className="CRUD">
                <div onClick={()=> {showUpdatePost(post.imgURL, post.caption, post._id)}} className="update">
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="18" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM325.8 139.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-21.4 21.4-71-71 21.4-21.4c15.6-15.6 40.9-15.6 56.6 0zM119.9 289L225.1 183.8l71 71L190.9 359.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z"/></svg>
                </div>
                <div onClick={()=> {deletePost(post._id)}} className="delete">
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
                </div>
              </div>
                <div className="img">
                  <p aria-hidden className="text">
                    Image N/A
                  </p>
                  <img src={post.imgURL} alt="" />
                  <div onClick={(e)=> {handlelike(e,post.userID, post._id)}} className="like">
                    <span>{post.likes.length}</span>
                    <svg
                    className={`likes ${post.likes.some((item)=> (item===localStorage.getItem("TokenPostAppUsername")))? "liked":""}`}
                      xmlns="http://www.w3.org/2000/svg"
                      height="27"
                      width="27"
                      viewBox="0 0 512 512"
                    >
                      <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                    </svg>
                  </div>
                </div>
                <div className="caption">
                  <p>{post.caption}</p>
                </div>
                <div className="comments-box">
                  <form onSubmit={(e)=> {handleCommentSubmit(e, post.userID, post._id)}}>
                    <input
                      id="comment"
                      type="text"
                      placeholder="Write A comment"
                      required
                    />
                    <button className="commentBtn">Comment</button>
                  </form>
                  <p onClick={()=>{showCMT()}} className="comments-text">
                    {post.comments.length < 1
                      ? "No Comments"
                      : post.comments.length == 1
                      ? "Show 1 comment"
                      : `Show all ${post.comments.length} comments`}
                  </p>
                  <div className="comments">
                    {post.comments.map((cmt) => (
                      <div key={cmt._id}>
                        <p>
                          <span>{cmt.CMTUser}:</span>
                          {cmt.CMT}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="Noposts">
              <span>No Posts Available</span>
            </div>
          )}
        </div>
      </main>
      <div onClick={showAddPost} className="addPost">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="30"
            width="30"
            viewBox="0 0 448 512"
          >
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
          </svg>
        </span>
      </div>

      <div className="Post modal">
        <div onClick={closeAddPost} className="closeModal">
          X
        </div>
        <h4>Add Post</h4>
        <form
          id="form"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <label htmlFor="Url">Image URL</label>
          <input id="Url" placeholder="Enter Image Url" type="text" required />
          <label htmlFor="Cap">Caption</label>
          <input
            id="Cap"
            placeholder="Write a Caption..."
            type="text"
            required
          />
          <div aria-hidden className="bar"></div>
          <button className="modalBtn">Post</button>
        </form>
      </div>

      <div className="Post UpdatePost modal">
        <div onClick={closeUpdatePost} className="closeModal">
          X
        </div>
        <h4>Update Post</h4>
        <form
          id="form"
          onSubmit={(e) => {
            handleUpdateSubmit(e );
          }}
        >
          <label htmlFor="UrlUpdate">Image URL</label>
          <input id="UrlUpdate" placeholder="Enter Image Url" type="text" required />
          <label htmlFor="CapUpdate">Caption</label>
          <input
            id="CapUpdate"
            placeholder="Write a Caption..."
            type="text"
            required
          />
          <div aria-hidden className="bar"></div>
          <button className="modalBtn">Update</button>
        </form>
      </div>
      <Toast msg={toastMsg} setmsg={settoastMsg} />
    </div>
  );
};

export default Home;
