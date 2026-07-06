import { useEffect, useState } from "react";
import API from "../services/api";
import { useParams } from "react-router-dom";

function PostDetails() {

  const { id } = useParams();

  const [post, setPost] = useState(null);

  useEffect(() => {

    const fetchPost = async () => {

      try {

        const res = await API.get(`/posts/${id}`);

        setPost(res.data);

      } catch (error) {

        console.log(error);

      }

    };

    fetchPost();

  }, [id]);

  if (!post) {

    return <h2>Loading...</h2>;

  }

  return (

    <div style={{padding:"40px"}}>

      <h1>{post.title}</h1>

      <p>{post.content}</p>

      <p><b>Author:</b> {post.author?.username}</p>

    </div>

  );

}

export default PostDetails;