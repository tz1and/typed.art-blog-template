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
      {/* Credits, feel free to remove. */}
      <div className="credit-overlay">
        Made with <a href="https://github.com/tz1and/typed.art-blog-template" target="_blank" rel="noreferrer">typed.art-blog-template</a> by <a href="https://twitter.com/tz1and" target="_blank" rel="noreferrer">@852Kerfunkle</a> &#129293;
      </div>
    </HelmetProvider>
  );
}

export default App;
