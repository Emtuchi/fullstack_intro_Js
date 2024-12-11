// Import necessary hooks and components from React and React Router
import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "../Editor";

// Define the EditPost component
export default function EditPost() {
  // Extract 'id' from the URL parameters using useParams hook
  const {id} = useParams();

  // Define state variables to store the post's title, summary, content, files, and redirect status
  const [title, setTitle] = useState(''); // Holds the post title
  const [summary, setSummary] = useState(''); // Holds the post summary
  const [content, setContent] = useState(''); // Holds the post content (body text)
  const [files, setFiles] = useState(''); // Holds the uploaded files
  const [redirect, setRedirect] = useState(false); // Tracks if we need to redirect after updating the post

  // useEffect hook to fetch the post details when the component mounts or when 'id' changes
  useEffect(() => {
    // Fetch the post data using the post ID
    fetch('http://localhost:3001/post/'+id)
      .then(response => {
        // Convert the response to JSON and set the post info into state variables
        response.json().then(postInfo => {
          setTitle(postInfo.title); // Set the fetched post title
          setContent(postInfo.content); // Set the fetched post content
          setSummary(postInfo.summary); // Set the fetched post summary
        });
      });
  }, [id]); // The effect depends on 'id', so it runs again if 'id' changes

  // Function to handle post update when the form is submitted
  async function updatePost(ev) {
    ev.preventDefault(); // Prevent default form submission behavior

    // Create a FormData object to handle multipart form submission (including files)
    const data = new FormData();
    data.set('title', title); // Add the title to the form data
    data.set('summary', summary); // Add the summary to the form data
    data.set('content', content); // Add the content to the form data
    data.set('id', id); // Add the post ID to the form data and snd it so that it can be recieved in the backend

    // If a new file has been selected, add it to the form data
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }

    // Send a PUT request to the server to update the post with the new data
    const response = await fetch('http://localhost:3001/post', {
      method: 'PUT', // HTTP method PUT is used to update the resource
      body: data, // Attach the FormData (which includes title, summary, content, file, etc.)
      credentials: 'include', // Include cookies for authentication (JWT token might be stored in cookies)
    });

    // If the response is OK, set the redirect flag to true to trigger a page redirect
    if (response.ok) {
      setRedirect(true);
    }
  }

  // If the redirect flag is true, navigate to the updated post's page
  if (redirect) {
    return <Navigate to={'/post/'+id} />
  }

  // Return the form that allows users to edit the post
  return (
    <form onSubmit={updatePost}>
      {/* Input for the post title */}
      <input type="title"
             placeholder={'Title'}
             value={title} // Bind the input value to the title state
             onChange={ev => setTitle(ev.target.value)} /> {/* Update title state on change */}
      
      {/* Input for the post summary */}
      <input type="summary"
             placeholder={'Summary'}
             value={summary} // Bind the input value to the summary state
             onChange={ev => setSummary(ev.target.value)} /> {/* Update summary state on change */}
      
      {/* File input to upload an image or file for the post */}
      <input type="file"
             onChange={ev => setFiles(ev.target.files)} /> {/* Update the files state on file selection */}
      
      {/* Editor component for editing the post content */}
      <Editor onChange={setContent} value={content} /> {/* Set content in the editor */}
      
      {/* Submit button to update the post */}
      <button style={{marginTop:'5px'}}>Update post</button>
    </form>
  );
}