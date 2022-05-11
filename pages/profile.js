import { useState, useContext } from 'react'
import { MainContext } from '../context'

export default function Profile() {
  const { balance, bundlrInstance, fetchBalance, initialiseBundlr } = useContext(MainContext)
  const [file, setFile] = useState()
  const [image, setImage] = useState()

  const [URI, setURI] = useState()
  const [amount, setAmount] = useState()

  async function fundWallet() {
    if (!amount) return
    const amountParsed = parseInput(amount)
    let response = await bundlrInstance.fund(amountParsed)
    console.log('Wallet funded: ', response)
    fetchBalance()
  }

  function parseInput (input) {
    const conv = new BigNumber(input).multipliedBy(bundlrInstance.currencyConfig.base[1])
    if (conv.isLessThan(1)) {
      console.log('error: value too small')
      return
    } else {
      return conv
    }
  }

  function onFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      const image = URL.createObjectURL(file)
      setImage(image)
      let reader = new FileReader()
      reader.onload = function () {
        if (reader.result) {
          setFile(Buffer.from(reader.result))
          console.log('file set...')
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }

  async function uploadFile() {
    if (!file) return
    const tags = [{ name: 'Content-Type', value: 'video/mp4' }];
    let tx = await bundlrInstance.uploader.upload(file, tags)
    console.log('tx: ', tx)
    setURI(`http://arweave.net/${tx.data.id}`)
  }

  if (!bundlrInstance) {
   return  (
     <div style={containerStyle}>
       <button style={wideButtonStyle} onClick={initialiseBundlr}>Connect Wallet</button>
     </div>
    )
  }

  async function saveVideo() {

  }

  return (
    <div>
      <h3 style={balanceStyle}>💰 Balance {Math.round(balance * 100) / 100}</h3>
      <div style={formStyle}>
        <p style={labelStyle}>Add Video</p>
        <div style={inputContainerStyle}>
        <input
          type="file"
          onChange={onFileChange}
        />
        </div>
        {
          image && (
            <video width="320" height="240" controls style={videoStyle}>
              <source src={image} type="video/mp4"/>
            </video>
          )

        }
        <button style={buttonStyle} onClick={uploadFile}>Upload Video</button>
        {
          URI && (
            <div>
               <p style={linkStyle} >
                <a href={URI}>{URI}</a>
               </p>
               <div style={formStyle}>
                 <p style={labelStyle}>Video Title</p>
                 <input style={inputStyle} />
                 <p style={labelStyle}>Video Description</p>
                 <textarea style={inputStyle}  />
                 <button style={saveVideoButtonStyle} onClick={saveVideo}>Save Video</button>
               </div>
            </div>
          )
        }
      </div>
      <div style={bottomFormStyle}>
        <p style={labelStyle}>Fund Wallet</p>
        <input placeholder='amount' style={inputStyle} onChange={e => setAmount(e.target.value)} />
        <button style={buttonStyle} onClick={fundWallet}>Send transaction</button>
      </div>
    </div>
  )
}

const linkStyle = {
  margin: '15px 0px'
}

const containerStyle = {
  padding: '100px 20px',
  display: 'flex',
  justifyContent: 'center'
}

const inputContainerStyle = {
  margin: '0px 0px 25px'
}

const videoStyle = {
  marginBottom: '20px'
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '20px 0px 0px'
}

const bottomFormStyle = {
  ...formStyle,
  marginTop: '35px',
  borderTop: '1px solid rgba(0, 0, 0, .1)'
}

const labelStyle = {
  margin: '0px 0px 5px'
}

const inputStyle = {
  padding: '12px 20px',
  borderRadius: '5px',
  border: 'none',
  outline: 'none',
  backgroundColor: 'rgba(0, 0, 0, .08)',
  marginBottom: '10px'
}

const buttonStyle = {
  backgroundColor: 'black',
  color: 'white',
  padding: '15px 20px',
  borderRadius: '50px',
  fontWeight: 700,
  width: 180
}

const saveVideoButtonStyle = {
  ...buttonStyle,
  marginTop: '15px'
}

const wideButtonStyle = {
  ...buttonStyle,
  width: '380px'
}

const balanceStyle = {
  padding: '10px 25px',
  backgroundColor: 'rgba(0, 0, 0, .08)',
  borderRadius: '30px',
  display: 'inline-block',
  width: 200,
  textAlign: 'center'
}