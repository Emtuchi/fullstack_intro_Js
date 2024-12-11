// Importing useState from React for managing component state and Navigate for programmatic navigation
import {useState} from "react"; 
import {Navigate} from "react-router-dom";

// Importing the custom Editor component (likely a wrapper around ReactQuill or another editor)
import Editor from "../Editor";

// CreatePost component is the default export of this file
export default function CreatePost() {
  // Defining state variables for title, summary, content, files (for file upload), and redirect (for navigation)
  const [title, setTitle] = useState('');       // Post title
  const [summary, setSummary] = useState('');   // Post summary
  const [content, setContent] = useState('');   // Post content (rich text)
  const [files, setFiles] = useState('');       // Uploaded file
  const [redirect, setRedirect] = useState(false); // Redirect state, if true, will navigate to home page

  // Async function to handle form submission (creating a new post)
  async function createNewPost(ev) {
    const data = new FormData();  // Creating a new FormData object to handle file uploads and other form fields
    data.set('title', title);     // Setting 'title' field in the form data
    data.set('summary', summary); // Setting 'summary' field in the form data
    data.set('content', content); // Setting 'content' (rich text) field in the form data
    data.set('file', files[0]);   // Adding the uploaded file (first file in case multiple files are uploaded), this 'file' is passed as a parameter to the upload function from multer
    ev.preventDefault();          // Preventing the default form submission behavior (page reload)

    // Sending POST request to the backend to create a new post, we simply want to get the status code of our request, so that we can redirect to our /MyStories page if it worked well
    const response = await fetch('http://localhost:3001/post', {
      method: 'POST',              // HTTP method set to POST
      body: data,                  // Form data (including file, title, summary, and content)
      credentials: 'include',      // Including cookies in the request (for authentication purposes)
    });

    // If the response from the server is OK (status 200), set redirect to true
    if (response.ok) {
      setRedirect(true);  // This will trigger a redirect to another page (home page in this case)
    }
  }

  // If the redirect state is true, navigate to the MyStories page
  if (redirect) {
    return <Navigate to={'/MyStories'} />;  // Programmatically navigating to the home page using Navigate from react-router-dom
  }

  // Rendering the form for creating a post
  return (
    <form className="Post" onSubmit={createNewPost}>  {/* Form submission handler */}
      {/* Input field for post title */}
      <input type="title"
             placeholder={'Title'}   // Placeholder text for title input
             value={title}           // Current value of the title state
             onChange={ev => setTitle(ev.target.value)} />  {/* Update title state on input change */}
      
      {/* Input field for post summary */}
      <input type="summary"
             placeholder={'Summary'} // Placeholder text for summary input
             value={summary}         // Current value of the summary state
             onChange={ev => setSummary(ev.target.value)} />  {/* Update summary state on input change */}
      
      {/* Input field for file upload */}
      <input type="file"
             onChange={ev => setFiles(ev.target.files)} />  {/* Update files state when a file is selected */}

      {/* Editor component for the post content (rich text) */}
      <Editor value={content} onChange={setContent} />  {/* Using the custom Editor to update content state */}
      
      {/* Submit button for creating the post */}
      <button>Create post</button>  {/* Button style adds margin to the top */}
    </form>
  );
}
