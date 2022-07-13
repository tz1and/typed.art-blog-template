import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import ReactMarkdown from 'react-markdown'
import { fetchTypedArtPost, ipfsUriTransformer, TypedArtPost,
    typedArtPostLink, typedArtPostTitle, typedArtUserLink } from './TypedArtUtils';


export const TypedArtBlogPost: React.FC<{}> = (props) => {
    const params = useParams();

    const [id, setId] = useState(parseInt(params.id!));
    const [post, setPost] = useState<TypedArtPost>();
    const [error, setError] = useState<string>();

    // Set tag state when prop changes.
    useEffect(() => {
        setId(parseInt(params.id!));
    }, [params.id]);

    // Fetch new posts when tag stage changes.
    useEffect(() => {
        fetchTypedArtPost(id).then(res => {
            setPost(res);
        }).catch(reason => {
            setError(reason.message);
        });
    }, [id]);

    let postElement: JSX.Element | undefined;

    if (post) {
        const title = `Blog - ${typedArtPostTitle(post)}`;

        postElement =
            <div className='mt-3 mb-5' key={post.token_id}>
                <Helmet>
                    <title>{title}</title>
                    {/* NOTE: twitter cards don't really work without SSR, twitter crawler doesn't run react apps. */}
                    {/*<meta name="twitter:card" content="summary" />
                    <meta name="twitter:site" content="@someone" />
                    <meta name="twitter:title" content={title} />
                    <meta name="twitter:description" content={post.description.substring(0, 15)} />
                    <meta name="twitter:image" content="https://..." />*/}
                </Helmet>
                <div className="mb-4">Post by {typedArtUserLink(post)} - {post.editions} Editions - {typedArtPostLink(post)}</div>
                <div>
                    <ReactMarkdown transformImageUri={ipfsUriTransformer} components={{
                        // eslint-disable-next-line jsx-a11y/alt-text
                        img: ({node, ...props}) => <img className="img-fluid" {...props} />}}>
                        {post.description}
                    </ReactMarkdown>
                </div>
            </div>;
    } else {
        if (error)
            postElement =
                <div>
                    <Helmet>
                        <title>Blog - Post not found</title>
                    </Helmet>
                    <h1>Not found</h1>{error}
                </div>
    }

    return (
        <main className="container px-4 py-4">
            {postElement}
        </main>
    );
}