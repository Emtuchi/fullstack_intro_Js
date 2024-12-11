//info about a logged-in user should be in a context used by the entire app, so the app is aware when user logs in and doesn't log out
import { createContext, useState } from "react";

// Create a Context object for user-related information, it will be used like an artificial hook
// The default value is an empty object, which will be replaced by the actual context value
export const UserContext = createContext({});

// Define a Context Provider component to manage and provide user-related data
export function UserContextProvider({ children }) {
  // Initialize state to hold user information
  // `userInfo` holds the current user data, and `setUserInfo` is a function to update this state
  const [userInfo, setUserInfo] = useState({});

  // Return the UserContext.Provider component, which provides the context value to its children
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {/* Render the children components within this provider */}
      {/* These components will have access to the context value */}
      {children}
    </UserContext.Provider>
  );
}
