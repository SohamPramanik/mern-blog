import { useEffect, useState } from "react";
import API from "../services/api";
import PostCard from "../components/PostCard";

function Blogs() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");

      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h1>Latest Blogs</h1>

      {posts.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
}

export default Blogs;
