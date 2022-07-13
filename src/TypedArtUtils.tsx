import { uriTransformer } from "react-markdown";
import { TransformImage } from "react-markdown/lib/ast-to-react";
import Conf from "../../Config";


async function fetchGraphQL(query: string, query_name: string, variables?: any, api_url = Conf.hasura_url) {
    // NOTE:
    // HTTP caching with graphql is kinda broken, sort of. The response doesn't have the right headers set
    // for them to be cached. could maybe get around it by way of using GET requests in some cases.
    const result = await fetch(
        api_url,
        {
            method: "POST",
            body: JSON.stringify({
                query: query,
                variables: variables,
                operationName: query_name
            })
        }
    );

    const obj = await result.json();
    if(obj.errors) {
        throw new Error("Query failed: " + obj.errors);
    }

    return obj.data;
}

export const ipfsUriTransformer: TransformImage = (
    src: string,
    alt: string,
    title: string | null) => {
    if (src.startsWith('ipfs://'))
        return Conf.randomPublicIpfsGateway() + '/ipfs/' + src.slice(7);
    return uriTransformer(src);
}

export type TypedArtPost = {
    token_id: number;
    description: string;
    minter_address: string;
    editions: number;
    userprofile: {
        user_name: string;
    }
}

export enum TypedArtPostType {
    Category1 = "category1",
    Category2 = "category2"
}

const whitelist: string[] = [
    // NOTE: you could maybe have an onchain wl instead of a hardcoded one.
    "tz1...",
    "tz2..."
]

export async function fetchTypedArtPosts(postType: TypedArtPostType, limit: number = 10, offset: number = 0): Promise<TypedArtPost[]> {
    const res = await fetchGraphQL(
        `query getFeaturedPosts($tag: String!, $limit: Int!, $offset: Int!, $whitelist: [String!]) {
            tokens(order_by: {token_id: desc}, where: {minter_address: {_in: $whitelist}, editions: {_gt: 0}, tags: {tag: {_eq: $tag}}}, limit: $limit, offset: $offset) {
                token_id
                description
                minter_address
                editions
                userprofile {
                    user_name
                }
            }
        }`, 'getFeaturedPosts', { tag: postType, limit: limit, offset: offset, whitelist: whitelist }, 'https://api.typed.art/v1/graphql');

    return res.tokens;
}

export async function fetchTypedArtPost(id: number): Promise<TypedArtPost> {
    const validTags: string[] = Object.values(TypedArtPostType);

    const res = await fetchGraphQL(
        `query getFeaturedPost($id: bigint!, $whitelist: [String!], $validTags: [String!]) {
            tokens(where: {token_id: {_eq: $id}, minter_address: {_in: $whitelist}, editions: {_gt: 0}, tags: {tag: {_in: $validTags}}}) {
                token_id
                description
                minter_address
                editions
                userprofile {
                    user_name
                }
            }
        }`, 'getFeaturedPost', { id: id, whitelist: whitelist, validTags: validTags }, 'https://api.typed.art/v1/graphql');

    if (res.tokens.length > 0)
        return res.tokens[0];
    else throw new Error(`typed.art post ${id} not found or not a valid blog post`);
}

export const typedArtUserLink = (post: TypedArtPost) => {
    if (post.userprofile)
        return <a className="link-secondary" href={"https://typed.art/" + post.userprofile.user_name} target="_blank" rel="noreferrer">{post.userprofile.user_name}</a>
    else
        return <a className="link-secondary" href={"https://typed.art/" + post.minter_address} target="_blank" rel="noreferrer">{post.minter_address}</a>
}
    
export const typedArtPostLink = (post: TypedArtPost) => {
    return <a className="link-secondary" href={"https://typed.art/" + post.token_id} target="_blank" rel="noreferrer">View on typed.art</a>;
}

export const typedArtPostTitle = (post: TypedArtPost) => {
    return post.description.split('\n', 1)[0].replace('#', '').trim();
}