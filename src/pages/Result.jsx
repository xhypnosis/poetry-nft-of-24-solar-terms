import { useEffect, useState } from 'react'
import checkAgent from '@/scripts/checkAgent'

export default function Result() {
    const [backSize, setBackSize] = useState("")

    useEffect(() => {
        let size = checkAgent()
        setBackSize(size)
    })

    return (
        <div className="h-full bg-slightHeatResult bg-no-repeat bg-center" style={{ backgroundSize: backSize }}>
            <div className="absolute inset-0 text-xl h-52 text-center m-auto tracking-wide text-[#696969]">
                您已成功领取
                <form action="display" method="get">
                    <input type="submit" value="点击查看" className="w-28 text-base text-[#2F4F4F] last:m-6 bg-[#f0f8ff] border-solid border-2 border-[#f0f8ff] rounded" />
                </form>
                <p>NFT即将发送，请检查您的钱包</p>
            </div>
        </div>
    )
}