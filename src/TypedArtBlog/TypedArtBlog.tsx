import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown'
import { fetchTypedArtPosts, ipfsUriTransformer, TypedArtPost,
    typedArtPostLink, TypedArtPostType, typedArtUserLink } from './TypedArtUtils';


type TypedArtBlogProps = {
    tag: TypedArtPostType;
}

export const TypedArtBlog: React.FC<TypedArtBlogProps> = (props) => {
    const [page, setPage] = useState(1);
    const [tag, setTag] = useState(props.tag);
    const [posts, setPosts] = useState<TypedArtPost[]>();

    const goToPage = (newPage: number) => {
        setPage(newPage);
        window.scrollTo(0, 0);
    }

    // Set tag state when prop changes.
    useEffect(() => {
        setTag(props.tag);
        setPage(1);
    }, [props.tag]);

    // Fetch new posts when tag stage changes.
    useEffect(() => {
        fetchTypedArtPosts(tag, 10, (page - 1) * 10).then((res) => {
            setPosts(res);
        });
    }, [tag, page]);

    const postElements: JSX.Element[] = [];

    const sahreLink = (post: TypedArtPost) => {
        return <Link className="link-secondary" to={"/" + post.token_id}>Share link</Link>;
    }

    if (posts)
        for (const post of posts) {
            postElements.push(
                <div className='mt-3 mb-5' key={post.token_id}>
                    <hr />
                    <div className="mb-4">Post by {typedArtUserLink(post)} - {post.editions} Editions - {typedArtPostLink(post)} - {sahreLink(post)}</div>
                    <div>
                        <ReactMarkdown transformImageUri={ipfsUriTransformer} components={{
                            //h1: 'h2', h2: 'h3', h3: 'h4', h4: 'h5', h5: 'h6', h6: 'h6',
                            // eslint-disable-next-line jsx-a11y/alt-text
                            img: ({node, ...props}) => <img className="img-fluid" {...props} />}}>
                            {post.description}
                        </ReactMarkdown>
                    </div>
                </div>);
        }

        const title = props.tag === TypedArtPostType.Category1 ? "Category1" : "Category2";

    const range1 = (n: number) => Array.from(Array(n), (_,i)=> i+1);
    console.log()

    return (
        <main className="container px-4 py-4">
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <h1 className='mb-6'>{title}</h1>
            {postElements.length > 0 ? postElements : 'No more posts found.'}

            <Pagination className='mt-4'>
                {page > 1 && <Pagination.First onClick={() => goToPage(1)} />}
                {page > 1 && <Pagination.Prev onClick={() => goToPage(page - 1)} />}

                {range1(page).map(v => <Pagination.Item onClick={() => goToPage(v)} key={v} active={v === page}>{v}</Pagination.Item>)}

                <Pagination.Ellipsis />
                <Pagination.Next onClick={() => goToPage(page + 1)} />
            </Pagination>
        </main>
    );
}