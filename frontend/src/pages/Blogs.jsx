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
      console.log("API URL:", import.meta.env.VITE_API_URL);

      const res = await API.get("/posts");

      console.log("Response:", res);

      console.log("Data:", res.data);

      setPosts(res.data);
    } catch (err) {
      console.log("ERROR");
      console.log(err);
      console.log(err.response);
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
