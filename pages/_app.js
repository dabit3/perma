import '../styles/globals.css'
import { WebBundlr } from "@bundlr-network/client"
import { MainContext } from '../context'
import { useState, useRef } from 'react'
import { providers, utils } from 'ethers'
import { css } from '@emotion/css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  const [bundlrInstance, setBundlrInstance] = useState()
  const [balance, setBalance] = useState(0)
  const [currency, setCurrency] = useState('matic')

  const bundlrRef = useRef()
  async function initialiseBundlr() {
    await window.ethereum.enable()
  
    const provider = new providers.Web3Provider(window.ethereum);
    await provider._ready()
  
    const bundlr = new WebBundlr("https://node1.bundlr.network", currency, provider)
    await bundlr.ready()
    
    setBundlrInstance(bundlr)
    bundlrRef.current = bundlr
    fetchBalance()
  }

  async function fetchBalance() {
    const bal = await bundlrRef.current.getLoadedBalance()
    console.log('bal: ', utils.formatEther(bal.toString()))
    setBalance(utils.formatEther(bal.toString()))
  }

  return (
    <div>
      <nav className={navStyle}>
        <Link href="/">
          <a>
            <div className={homeLinkStyle}>
              <img src="/icon.svg" className={iconStyle} />
              <p className={homeLinkTextStyle}>
                PERMA
              </p>
            </div>
          </a>
        </Link>
        <div className={externalContainerLinkStyle}>
          <p className={linkParagraphStyle}>
            Built with <a target="_blank" rel="noreferrer" className={linkStyle} href="https://bundlr.network/">Bundlr</a> and <a target="_blank" rel="noreferrer" href="https://www.arweave.org/" className={linkStyle} >Arweave</a>
          </p>
        </div>
      </nav>
      <div className={containerStyle}>
        <MainContext.Provider value={{
          initialiseBundlr,
          bundlrInstance,
          balance,
          fetchBalance,
          currency,
          setCurrency
        }}>
          <Component {...pageProps} />
        </MainContext.Provider>
      </div>
      <footer className={footerStyle}>
          <Link href="/profile">
            <a>
              ADMIN
            </a>
          </Link>
      </footer>
    </div>
  )
}

const navHeight = 80
const footerHeight = 70

const navStyle = css`
  height: ${navHeight}px;
  padding: 40px 100px;
  border-bottom: 1px solid #ededed;
  display: flex;
  align-items: center;
`

const iconStyle = css`
  width: 52px;
  transform: rotate(-90deg);
`

const homeLinkStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const homeLinkTextStyle = css`
  font-weight: 200;
  font-size: 28;
  letter-spacing: 7px;
`

const footerStyle = css`
  border-top: 1px solid #ededed;
  height: ${footerHeight}px;
  padding: 0px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 200;
  letter-spacing: 1px;
  font-size: 14px;
`

const containerStyle = css`
  min-height: calc(100vh - ${navHeight + footerHeight}px);
  width: 900px;
  margin: 0 auto;
  padding: 40px;
`

const externalContainerLinkStyle = css`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`

const linkParagraphStyle = css`
  font-size: 12px;
  font-weight: 300;
`

const linkStyle = css`
  color: #0066ff;
`

export default MyApp
