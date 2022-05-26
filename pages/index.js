import { buildQuery, arweave, createPostInfo } from '../utils'
import { useEffect, useState } from 'react'

const wait = (ms) => new Promise((res) => setTimeout(res, ms))

export default function Home() {
  const [videos, setVideos] = useState([])
  useEffect(() => {
    getPostInfo()
  }, [])

  async function getPostInfo(topicFilter = null, depth = 0) {
    try {
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
    } catch (err) {
      await wait(2 ** depth * 10)
      getPostInfo(topicFilter, depth + 1)
      console.log('error: ', err)
    }
  }

  return (
    <div style={containerStyle}>
      {
        videos.map(video => (
          <div style={videoContainerStyle} key={video.URI}>
            <video key={video.URI} width="620" controls>
              <source src={video.URI} type="video/mp4"/>
            </video>
            <div style={titleContainerStyle}>
              <h3 style={titleStyle}>{video.title}</h3>
              <a  style={iconStyle}  target="_blank" rel="noreferrer" href={video.URI}>
                <img src="/arrow.svg" />
              </a>
            </div>
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

const iconStyle = {
  width: '20px',
  marginLeft: '19px',
  marginTop: '14px'
}

const titleContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-start',
  margin: '19px 0px 8px'
}

const videoContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  margin: '20px 0px 40px'
}

const titleStyle = {
  margin:  0,
  fontSize: '30px'
}

const descriptionStyle = {
  margin: 0
}