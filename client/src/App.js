import { Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import Register from "./Pages/RegisterPage";
import Login from "./Pages/LoginPage";
import Layout from "./Layout";
import CreatePost from "./Pages/CreatePost";
import './App.css';
import { UserContextProvider } from "./usercontext";
import MyStory from "./Pages/MyStories";
import PostPage from "./Pages/PostPage";
import EditPost from "./Pages/EditPost";

function App() {
  return (
    <div className="App">
      <UserContextProvider> {/*a custom made context(background setting) for our app to use where ever it is */}
        <Routes>
          {/**
            * index: makes a page to be the first page displayed by the server 
            * element: a way of referring to "components" containing html for rendering
            * path=: think of it like "Route path, path for the route"
            */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} /> {/* we don't need to put "path=" because we have "index" */}
            <Route path={'/login'} element={<Login />} />
            <Route path={'/register'} element={<Register />} />
            <Route path={'/create'} element={<CreatePost />} />
            <Route path={'/MyStories'} element={<MyStory />} />
            <Route path={'/post/:id'} element={<PostPage />} />
            <Route path="/edit/:id" element={<EditPost />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </div>
  );
}

export default App;
