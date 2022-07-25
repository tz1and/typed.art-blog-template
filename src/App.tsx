import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TypedArtBlog } from './TypedArtBlog/TypedArtBlog';
import { TypedArtPostType } from './TypedArtBlog/TypedArtUtils';
import { TypedArtBlogPost } from './TypedArtBlog/TypedArtBlogPost';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="" element={<TypedArtBlog tag={TypedArtPostType.Category1} />} />
            <Route path=":id" element={<TypedArtBlogPost />} />
            <Route path="featured" element={<TypedArtBlog tag={TypedArtPostType.Category2} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
