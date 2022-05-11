import '../styles/globals.css'
import { WebBundlr } from "@bundlr-network/client"
import { MainContext } from '../context'
import { useState, useRef } from 'react'
import { providers, utils } from 'ethers'

import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  const [bundlrInstance, setBundlrInstance] = useState()
  const [balance, setBalance] = useState()
  const bundlrRef = useRef()
  async function initialiseBundlr() {
    await window.ethereum.enable()
  
    const provider = new providers.Web3Provider(window.ethereum);
    await provider._ready()
  
    const bundlr = new WebBundlr("https://node1.bundlr.network", "matic", provider)
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
      <nav style={navStyle}>
        <Link href="/">
          <a>
            <div style={homeLinkStyle}>
            <img src="/icon.svg" style={iconStyle} />
            <p style={homeLinkTextStyle}>
              PERMA
            </p>
            </div>
          </a>
        </Link>
      </nav>
      <div style={containerStyle}>
        <MainContext.Provider value={{
          initialiseBundlr,
          bundlrInstance,
          balance,
          fetchBalance
        }}>
          <Component {...pageProps} />
        </MainContext.Provider>
      </div>
      <footer style={footerStyle}>
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

const navStyle = {
  height: `${navHeight}px`,
  padding: '40px 100px',
  borderBottom: '1px solid #ededed',
  display: 'flex',
  alignItems: 'center',
}

const iconStyle = {
  width: '52px',
  transform: 'rotate(-90deg)',
}

const homeLinkStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}

const homeLinkTextStyle = {
  fontWeight: 200,
  fontSize: 28,
  letterSpacing: '7px'
}

const footerStyle = {
  borderTop: '1px solid #ededed',
  height: `${footerHeight}px`,
  padding: '0px 40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 200,
  letterSpacing: '1px',
  fontSize: '14px'
}

const containerStyle = {
  minHeight: `calc(100vh - ${navHeight + footerHeight}px)`,
  width: '900px',
  margin: '0 auto',
  padding: '40px'
}

export default MyApp
