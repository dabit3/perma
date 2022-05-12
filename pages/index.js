import { buildQuery, arweave, createPostInfo } from '../utils'
import { useEffect, useState } from 'react'

export default function Home() {
  const [videos, setVideos] = useState([])
  useEffect(() => {
    getPostInfo()
  }, [])

  async function getPostInfo(topicFilter = null) {
    const query = buildQuery(topicFilter)
    const results = await arweave.api.post('/graphql', query)
      .catch(err => {
        console.error('GraphQL query failed')
         throw new Error(err);
      });
    const edges = results.data.data.transactions.edges
    const posts = await Promise.all(
      edges.map(async edge => await createPostInfo(edge.node))
    )
    let sorted = posts.sort((a, b) => new Date(b.request.data.createdAt) - new Date(a.request.data.createdAt))
    sorted = sorted.map(s => s.request.data)
    console.log('sorted: ', sorted)
    setVideos(sorted)
  }

  return (
    <div style={containerStyle}>
      {
        videos.map(video => (
          <div style={videoContainerStyle} key={video.URI}>
            <video key={video.URI} width="620" controls>
              <source src={video.URI} type="video/mp4"/>
            </video>
            <h3 style={titleStyle}>{video.title}</h3>
            <p style={descriptionStyle}>{video.description}</p>
          </div>
        ))
      }
    </div>
  )
}

const containerStyle = {
  width: '620px',
  margin: '0 auto',
  padding: '40px 20px',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column'
}

const videoContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  margin: '20px 0px 40px'
}

const titleStyle = {
  margin: '15px 0px 10px'
}

const descriptionStyle = {
  margin: 0
}