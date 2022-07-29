import { useState, useEffect } from 'react'
import axios from 'axios'
import { Divider } from 'antd'
import checkAgent from '@/scripts/checkAgent'
import logo from '@/images/logo.png'
import Ju from '@/images/Ju.png'

export default function Display() {
    let wallet = sessionStorage.getItem("address")
    let userInfo = { address: wallet }

    const [verse, setVerse] = useState("")
    const [verseId, setVerseId] = useState(0)
    const [backSize, setBackSize] = useState("")

    useEffect(() => {
        let size = checkAgent()
        setBackSize(size)
    })

    useEffect(() => {
        let url = '/api/view'
        axios({
            url: url,
            method: 'post',
            data: userInfo
        }).then((res) => {
            if (res.data.code == 200 && res.data.message) {
                setVerse(res.data.message.verse)
                setVerseId(res.data.message.verId)
            } else {
                setVerse("404 Not Found")
            }
        }).catch((err) => {
            confirm(err)
        })
    },)

    return (
        <div className="h-full bg-slightHeatDisp bg-no-repeat bg-center text-[#2f4f4f] text-base" style={{ backgroundSize: backSize }}>
            <div className="w-[300px] h-full m-auto relative">
                <div className="h-12 pt-4 text-center font-[Times] font-medium border-b border-black">
                    Ju&nbsp;&nbsp;Protocol
                </div>
                <div className="w-5 h-24 absolute top-[3.75rem] right-[7.5rem] bottom-0 left-0 m-auto font-medium">
                    <span>大<br />暑</span>
                    <p className="mt-1 mb-0 font-[Times] text-[19px]">#</p>
                    <p className="tracking-[-0.1rem] text-[15px] leading-tight font-normal">&nbsp;{ verseId }</p>
                </div>
                <p className="inline-block w-[100px] h-[150px] absolute bottom-[150px] top-0 inset-x-0 leading-[50px] m-auto text-[30px] tracking-[12px] font-[cursive] font-medium" style={{ writingMode: 'vertical-rl', wordBreak: 'keep-all' }}>
                    { verse }
                </p>
                <div className="w-full absolute bottom-9">
                    <img src={Ju} alt="Ju" className="w-[78px] m-auto" />
                    <img src={logo} alt="conflux" className="w-20 h-5 mx-auto mt-3" />
                </div>
            </div>
        </div>
    )
}