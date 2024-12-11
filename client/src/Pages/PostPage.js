// Import necessary hooks and modules from React and React Router
import {useContext, useEffect, useState} from "react"; // useContext for accessing context, useEffect for side effects, useState for managing component state
import {useParams} from "react-router-dom"; // useParams to get URL parameters (specifically the post ID)
import {formatISO9075} from "date-fns"; // formatISO9075 to format the date into a readable format
import {UserContext} from "../usercontext"; // Import UserContext to access the logged-in user's information
import {Link} from 'react-router-dom'; // Link component for navigation without full page reload

// Define the PostPage component, responsible for displaying a single blog post
export default function PostPage() {

  const [postInfo, setPostInfo] = useState(null);
  
  // Access the global user information from UserContext
  const {userInfo} = useContext(UserContext); // 'userInfo' provides the current user's information
  
  // id is our post id that was parsed in ../Post.js file and referenced as ":id" in the route in ../App.js file that we use to access the post.
  // this ":id" is what is being called as "id" here
  const {id} = useParams(); // useParams() is able to display the parameters of the current route and at this line, we are simply in the PostPage after clicking a post and id is the only params at this line

  // useEffect to fetch the post data when the component loads or when the 'id' changes
  useEffect(() => {
    fetch(`http://localhost:3001/post/${id}`) // Fetch the post data from the backend using the post ID
      .then(response => {
        response.json().then(postInfo => {
          setPostInfo(postInfo); // Update 'postInfo' state with the retrieved post data
        });
      });
  }, [id]); // The effect runs when the component mounts or when 'id' changes

  // Return an empty string while post data is still loading
  if (!postInfo) return ''; // If the post data has not been loaded yet, return an empty string

  // Render the post content once the data is loaded
  return (
    <div className="post-page">
      {/* Display the post title */}
      <h1>{postInfo.title}</h1>

      {/* Display the creation date of the post, formatted using formatISO9075 */}
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>

      {/* Display the author of the post */}
      <div className="author">by @{postInfo.author.username}</div>

      {/* If the logged-in user is the author of the post, show the edit button */}
      {userInfo.id === postInfo.author._id && ( // Check if the current user is the author of the post
        <div className="edit-row">
          {/* Link to the edit post page for this post */}
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            {/* Display an SVG icon next to the "Edit this post" button */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Edit this post
          </Link>
        </div>
      )}

      {/* Display the cover image of the post */}
      <div className="image">
        <img src={`http://localhost:3001/${postInfo.cover}`} alt="Post Cover" /> {/* Dynamically load the image using the 'cover' property */}
      </div>

      {/* Display the post content using dangerouslySetInnerHTML to render HTML */}
      {/* Be careful when using dangerouslySetInnerHTML, as it can expose to XSS vulnerabilities */}
      {/* 'content' is gotten from our form in ./Pages/CreatePost.js, the dangerously...., is to hide the html tag that was printed with it*/}
      <div className="content" dangerouslySetInnerHTML={{__html: postInfo.content}} />
    </div>
  );
}