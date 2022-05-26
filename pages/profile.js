import { useState, useContext } from 'react'
import { MainContext } from '../context'
import { APP_NAME } from '../utils'
import { useRouter } from 'next/router'
import { css } from '@emotion/css'
import BigNumber from 'bignumber.js'
import Select from 'react-select'

const supportedCurrencies = {
  matic: 'matic',
  ethereum: 'ethereum',
  avalanche: 'avalanche',
  bnb: 'bnb',
  arbitrum: 'arbitrum'
}

const options = Object.keys(supportedCurrencies).map(v => {
  return {
    value: v, label: v
  }
})

export default function Profile() {
  const { balance, bundlrInstance, fetchBalance, initialiseBundlr, currency, setCurrency } = useContext(MainContext)
  const [file, setFile] = useState()
  const [image, setImage] = useState()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter()

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

  async function saveVideo() {
    if (!file) return
    const tags = [
      { name: 'Content-Type', value: 'text/plain' },
      { name: 'App-Name', value: APP_NAME }
    ]

    const video = {
      title,
      description,
      URI,
      createdAt: new Date(),
      createdBy: bundlrInstance.address,
    }

    let tx = await bundlrInstance.createTransaction(JSON.stringify(video), { tags })
    await tx.sign()
    const { data } = await tx.upload()

    console.log(`http://arweave.net/${data.id}`)
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }

  if (!bundlrInstance) {
   return  (
     <div>
        <div className={selectContainerStyle} >
          <Select
            onChange={({ value }) => setCurrency(value)}
            options={options}
            defaultValue={{ value: currency, label: currency }}
          />
          <p>Currency: {currency}</p>
        </div>
     <div className={containerStyle}>
       <button className={wideButtonStyle} onClick={initialiseBundlr}>Connect Wallet</button>
     </div>
     </div>
    )
  }

  return (
    <div>
      <h3 className={balanceStyle}>💰 Balance {Math.round(balance * 100) / 100}</h3>
      <div className={formStyle}>
        <p className={labelStyle}>Add Video</p>
        <div className={inputContainerStyle}>
        <input
          type="file"
          onChange={onFileChange}
        />
        </div>
        {
          image && (
            <video key={image} width="520" controls className={videoStyle}>
              <source src={image} type="video/mp4"/>
            </video>
          )

        }
        <button className={buttonStyle} onClick={uploadFile}>Upload Video</button>
        {
          URI && (
            <div>
               <p className={linkStyle} >
                <a href={URI}>{URI}</a>
               </p>
               <div className={formStyle}>
                 <p className={labelStyle}>Title</p>
                 <input className={inputStyle} onChange={e => setTitle(e.target.value)} placeholder='Video title' />
                 <p className={labelStyle}>Description</p>
                 <textarea placeholder='Video description' onChange={e => setDescription(e.target.value)} className={textAreaStyle}  />
                 <button className={saveVideoButtonStyle} onClick={saveVideo}>Save Video</button>
               </div>
            </div>
          )
        }
      </div>
      <div className={bottomFormStyle}>
        <p className={labelStyle}>Fund Wallet</p>
        <input placeholder='amount' className={inputStyle} onChange={e => setAmount(e.target.value)} />
        <button className={buttonStyle} onClick={fundWallet}>Send transaction</button>
      </div>
    </div>
  )
}

const selectContainerStyle = css`
  margin: 10px 0px 20px;
`

const linkStyle = css`
  margin: 15px 0px;
`

const containerStyle = css`
  padding: 10px 20px;
  display: flex;
  justify-content: center;
`

const inputContainerStyle = css`
  margin: 0px 0px 25px;
`

const videoStyle = css`
  margin-bottom: 20px;
`

const formStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 0px 0px;
`

const bottomFormStyle = css`
  ${formStyle};
  margin-top: 35px;
  border-top: 1px solid rgba(0, 0, 0, .1);
`

const labelStyle = css`
  margin: 0px 0px 5px;
`

const inputStyle = css`
  padding: 12px 20px;
  border-radius: 5px;
  border: none;
  outline: none;
  background-color: rgba(0, 0, 0, .08);
  margin-bottom: 10px;
`

const textAreaStyle = css`
  ${inputStyle};
  width: 350px;
  height: 90px;
`

const buttonStyle = css`
  background-color: black;
  color: white;
  padding: 15px 20px;
  border-radius: 50px;
  font-weight: 700;
  width: 180;
`

const saveVideoButtonStyle = css`
  ${buttonStyle};
  margin-top: 15px;
`

const wideButtonStyle = css`
  ${buttonStyle};
  width: 380px;
`

const balanceStyle = css`
  padding: 10px 25px;
  background-color: rgba(0, 0, 0, .08);
  border-radius: 30px;
  display: inline-block;
  width: 200px;
  text-align: center;
`