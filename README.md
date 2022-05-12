## PERMA

![PERMA](perma.jpg)

Perma is a prototype of permanent video storage and viewing using Next.js, Arweave, and Bundlr.

Technologies used:

[Arweave](https://www.arweave.org/) - File storage
[Bundlr](https://bundlr.network/) - Multichain solution for Arweave integration
[Next.js](https://nextjs.org/) - React framework

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

2. Update the `APP_NAME` to something that is unique to your app, could be anything you'd like:

```sh
export const APP_NAME = "YOUR_UNIQUE_APP_NAME"
```

3. Run the app

```sh
npm start
```