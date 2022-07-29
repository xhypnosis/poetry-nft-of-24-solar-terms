import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Row, Col } from 'antd'
import logo from '@/images/logo.png'
import { Provider } from '@idealight-labs/anyweb-js-sdk'
import checkAgent from '@/scripts/checkAgent'
console.log()
export default function Home() {
    conflux.provider = new Provider({
        logger: console,
        appId: import.meta.env.VITE_APPID
    })
    conflux.provider.on("ready", () => {
        console.log("Solarterm: AnyWeb provider is ready")
    })

    const [backSize, setBackSize] = useState("")
    const [claim, setClaim] = useState("领取")
    const [view, setView] = useState("查看")
    const [wallet, setWallet] = useState("")
    const [disabled, setDisabled] = useState(true)
    const [verse, setVerse] = useState(true)
    const [color, setColor] = useState("transparent")

    let navigate = useNavigate()

    useEffect(() => {
        let size = checkAgent()
        setBackSize(size)
    })

    useEffect(() => {
        console.log(`wallet address: ${wallet}`)
        // Save address into session storage for the use of next page
        sessionStorage.setItem("address", wallet)
        console.log(claim, view)
    }, [wallet, claim, view])

    function onApprove() {
        conflux.provider
            .request({
                method: "cfx_accounts",
                params: [{
                    availableNetwork: [1],
                    scopes: ["baseInfo", "identity"],
                }],
            })
            .then((res) => {
                const { chainId, networkId, address, code } = res
                console.log(
                    'DApp 获取到的授权结果',
                    chainId,
                    networkId,
                    address[0],
                    code
                )
                // if (res.networkId != 1029) {
                //     confirm(
                //         "网络错误，请先取消授权，然后重新授权，在AnyWeb钱包中选择正式网"
                //     )
                //     return
                // }

                // Decode if user address string is url encoded
                const decodedAddr = decodeURIComponent(address[0])
                setWallet(decodedAddr)
                setDisabled(false)
                setColor("seagreen")
            })
            .catch((e) => {
                console.error("调用失败", e)
            })
    }

    function onCancel() {
        conflux.provider
            .request({
                method: "exit_accounts",
            })
            .then(() => {
                setDisabled(true)
                setColor("transparent")
                console.log("exit success")
            })
            .catch((e) => {
                console.error("调用失败", e)
            })
    }

    function onPost(back, front) {
        if (!wallet) {
            confirm("请先授权 AnyWeb 钱包")
            return
        }

        // determine button content
        if (back == "claim") {
            setClaim("loading...")
        } else {
            setView("loading...")
        }
        
        setDisabled(true)

        let url = `/api/${back}`
        let userInfo = { address: wallet }
        axios({
            url: url,
            method: 'post',
            data: userInfo
        }).then((res) => {
            if (res.data.code == 200 && res.data.message) {
                navigate(`/${front}`, { replace: true })
            } else {
                confirm(res.data.message)
                setDisabled(false)
                if (back == "claim") {
                    setClaim("领取")
                } else {
                    setView("查看")
                }
            }
        }).catch((err) => {
            console.log(err)
            confirm(err)
        })
    }

    return (
        <div
            className="w-full h-full bg-slightHeatHome bg-no-repeat bg-center"
            style={{ backgroundSize: backSize }}
        >
            <div className="w-full fixed top-3/20 text-center">
                <img className="w-auto m-auto" src={logo} />
                <br />
                <div className="text-3xl font-cursive text-darkslategray font-medium mt-6">
                    <span>小</span>
                    <br />
                    <span>暑</span>
                </div>
                <div className="text-sea-green mt-24">
                    <button className="w-24 bg-transparent" type="button" onClick={() => onApprove()}>
                        授权
                    </button>
                    <button className="w-24 bg-transparent" type="button" onClick={() => onCancel()}>
                        取消授权
                    </button>
                    <br />
                    <br />
                    <button className="w-24 bg-transparent" type="button" disabled={disabled} onClick={() => onPost('claim', 'result')} style={{ color: color }}>
                        {claim}
                    </button>
                    <button className="w-24 bg-transparent" type="button" disabled={disabled} onClick={() => onPost('view', 'display')} style={{ color: color }}>
                        {view}
                    </button>
                </div>
            </div>
        </div>
    )
}
