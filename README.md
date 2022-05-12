## PERMA

![PERMA](perma.jpg)

Perma is a prototype of permanent video storage and client-side rendering using Next.js, Arweave, and Bundlr.

Technologies used:

- [Arweave](https://www.arweave.org/) - File storage
- [Bundlr](https://bundlr.network/) - Multichain solution for Arweave integration
- [Next.js](https://nextjs.org/) - React framework

### Building and running the app

To run this app, follow these steps:

1. Clone the repo, change into the directory, and install dependencies:

```sh
git clone git@github.com:dabit3/perma.git

cd perma

npm install 

# or

yarn 
```

2. Update the `APP_NAME` in __utils.js __ to something that is unique to your app, could be anything you'd like:

```sh
export const APP_NAME = "YOUR_UNIQUE_APP_NAME"
```

3. Run the app

```sh
npm run dev
```

### Limitations

1. As of a couple of weeks ago, Bundlr was missing the indexing of some transactions on Arweave causing them to drop from GraphQL query after a set amount of time (though they were still saved to Arweave). Issue [here](https://github.com/Bundlr-Network/js-client/issues/35)

2. Larger files (>100MB) have had trouble saving to Bundlr. This issue has been raised [here](https://github.com/Bundlr-Network/js-client/issues/40) and I've spoken to one of the engineers who says they are pushing out a fix (this is a Bundlr `js-client` issue)