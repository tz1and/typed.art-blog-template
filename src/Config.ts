function getEnvVar(key: string): string {
    const val = process.env[key];
    if (val !== undefined) return val;

    console.warn('Env var not set: ', key);
    return '';
}

export default class Conf {
    public static public_url: string = getEnvVar('PUBLIC_URL');
    public static app_version: string = getEnvVar('REACT_APP_VERSION');

    //public static ipfs_public_gateways: string[] = getEnvVar('REACT_APP_IPFS_PUBLIC_GATEWAYS').split(' ');
    public static ipfs_public_gateways: string[] = ["https://nftstorage.link", "https://ipfs.io"];
    //REACT_APP_IPFS_PUBLIC_GATEWAYS_CSP=https://nftstorage.link https://*.nftstorage.link https://ipfs.io https://cloudflare-ipfs.com https://infura-ipfs.io https://*.infura-ipfs.io
}