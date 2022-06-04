import Arweave from 'arweave'

export const arweave = Arweave.init({})
export const APP_NAME = process.env.NEXT_PUBLIC_ARWEAVE_APP_NAME || "PERMA_VIDEO_APP_TEST_NAME_3"

export const createPostInfo = async (node) => {
  const ownerAddress = node.owner.address;
  const height = node.block ? node.block.height : -1;
  const timestamp = node.block ? parseInt(node.block.timestamp, 10) * 1000 : -1;
  const postInfo = {
    txid: node.id,
    owner: ownerAddress,
    height: height,
    length: node.data.size,
    timestamp: timestamp,
  }
  
  postInfo.request = await arweave.api.get(`/${node.id}`, { timeout: 10000 })
  return postInfo;
 }

 let tags = [
  {
    name: "App-Name",
    values: [APP_NAME]
  },
  {
    name: "Content-Type",
    values: ["text/plain"]
  }
]

 export const buildQuery = (topicFilter) => {
  let stringifiedTags = [...tags]
  if (topicFilter) {
    stringifiedTags = [...tags, {
      name: "Topic",
      values: [topicFilter]
    }]
  }
  stringifiedTags = JSON.stringify(stringifiedTags).replace(/"([^"]+)":/g, '$1:')

  const queryObject = { query: `{
    transactions(
      first: 50,
      tags: ${stringifiedTags}
    ) {
      edges {
        node {
          id
          owner {
            address
          }
          data {
            size
          }
          block {
            height
            timestamp
          }
          tags {
            name,
            value
          }
        }
      }
    }
  }`}
  console.log('queryObject: ', queryObject)
  return queryObject;
}

export const tagSelectOptions = [
  { value: 'daos', label: 'DAOs' },
  { value: 'defi', label: 'DeFi' },
  { value: 'nfts', label: 'NFTs' },
  { value: 'developers', label: 'Developers' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'investing', label: 'Investing' },
  { value: 'public-goods', label: 'Public Goods' },
  { value: 'education', label: 'Education' }
]