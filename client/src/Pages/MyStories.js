// Import necessary components and hooks from React
import Post from "../Post"; // Importing the Post component to display individual posts
import {useEffect, useState} from "react"; // useEffect and useState hooks from React

// Define the IndexPage component
export default function MyStory() {
  
  // Declare a state variable 'posts' to hold an array of post data, and 'setPosts' to update it
  const [posts, setPosts] = useState([]); // Initially, the 'posts' state is set to an empty array

  // useEffect hook to fetch posts when the component is mounted
  useEffect(() => {
    // Fetch the posts data from the backend API (GET request to '/post' endpoint)
    fetch('http://localhost:3001/post')
      .then(response => {
        // Convert the response into JSON format
        response.json().then(posts => {
          // Once the posts are fetched, update the 'posts' state with the fetched data
          setPosts(posts);
        });
      });
  }, []); // The empty dependency array ensures this effect runs only once when the component is mounted

  // Return the JSX that renders the list of posts
  return (
    <>
      {/* Check if there are posts in the 'posts' state */}
      {posts.length > 0 && 
        // Map over the 'posts' array and for each post, render a Post component
        posts.map(post => (
          // Spread the post properties (title, content, etc.) into the Post component
          <Post {...post} /> // using '<Post {...post} />' instead of '<Post />' so that 'Post' will inherit every imdividual attribute of 'post'
        ))
      }
    </>
  );
}