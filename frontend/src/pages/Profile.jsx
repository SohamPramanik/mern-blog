import { useEffect, useState } from "react";
import API from "../services/api";
import PostCard from "../components/PostCard";

function Profile(){

  const [posts,setPosts] = useState([]);
  const [username,setUsername] = useState("");
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    const fetchPosts = async ()=>{

      try{

        const token = localStorage.getItem("token");

        const res = await API.get("/posts/myposts",{
          headers:{ Authorization: token }
        });

        setPosts(res.data);

        // if user has posts
        if(res.data.length > 0){
          setUsername(res.data[0].author.username);
        }

        setLoading(false);

      }catch(err){
        console.log(err);
        setLoading(false);
      }

    };

    fetchPosts();

  },[]);

  if(loading){
    return <h2 style={{textAlign:"center"}}>Loading profile...</h2>;
  }

  return(

    <div className="container">

      <h1 style={{textAlign:"center",marginBottom:"30px"}}>
        👤 {username ? username : "User"}'s Profile
      </h1>

      {posts.length === 0 ? (
        <p style={{textAlign:"center"}}>You haven't created any posts yet.</p>
      ) : (
        posts.map((post)=>(
          <PostCard key={post._id} post={post}/>
        ))
      )}

    </div>

  );

}

export default Profile;