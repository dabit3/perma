import { buildQuery, arweave, createPostInfo } from '../utils'
import { useEffect, useState } from 'react'
import { css } from '@emotion/css'

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
    <div className={containerStyle}>
      {
        videos.map(video => (
          <div className={videoContainerStyle} key={video.URI}>
            <video key={video.URI} width="720px" height="405px" controls className={videoStyle}>
              <source src={video.URI} type="video/mp4"/>
            </video>
            <div className={titleContainerStyle}>
              <h3 className={titleStyle}>{video.title}</h3>
              <a className={iconStyle}  target="_blank" rel="noreferrer" href={video.URI}>
                <img src="/arrow.svg" />
              </a>
            </div>
            <p className={descriptionStyle}>{video.description}</p>
          </div>
        ))
      }
    </div>
  )
}


const videoStyle = css`
  background-color: rgba(0, 0, 0, .05);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  `

const containerStyle = css`
  width: 720px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
`

const iconStyle = css`
  width: 20px;
  marginLeft: 19px;
  marginTop: 14px;
`

const titleContainerStyle = css`
  display: flex;
  justify-content: flex-start;
  margin: 19px 0px 8px;
`

const videoContainerStyle = css`
  display: flex;
  flex-direction: column;
  margin: 20px 0px 40px;
`

const titleStyle = css`
  margin:  0;
  fontSize: 30px;
`

const descriptionStyle = css`
  margin: 0;
`