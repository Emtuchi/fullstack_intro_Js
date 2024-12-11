// Import the ReactQuill component for rich text editing
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'; //if you dont put this, the reactquill will appear dis-organized

// Define the Editor component, which accepts 'value' and 'onChange' as props
export default function Editor({ value, onChange }) {

  // Define the configuration for the toolbar in the ReactQuill editor
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }], // Dropdown for headers (H1, H2, and normal text)
      ['bold', 'italic', 'underline', 'strike', 'blockquote'], // Text formatting options
      [
        { list: 'ordered' }, // Ordered (numbered) list
        { list: 'bullet' },  // Unordered (bullet) list
        { indent: '-1' },    // Decrease indentation
        { indent: '+1' },    // Increase indentation
      ],
      ['link', 'image'], // Insert link or image
      ['clean'], // Remove formatting (clean)
    ],
  };

  // Return the rendered Editor component inside a <div> with class "content"
  return (
    <div className="content">
      {/* Render the ReactQuill component with the following properties:
          - 'value': the content of the editor (passed as a prop)
          - 'theme': the visual style of the editor ('snow' is a built-in theme)
          - 'onChange': function to handle changes in the editor content (passed as a prop)
          - 'modules': toolbar configuration */}
      <ReactQuill
        value={value}  // Current editor content
        theme={'snow'} // Use the 'snow' theme for the editor
        onChange={onChange} // Handle content change events
        modules={modules} // Set up the toolbar options defined earlier
      />
    </div>
  );
}
