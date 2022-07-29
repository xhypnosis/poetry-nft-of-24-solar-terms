import { useState, useEffect } from 'react'
import { Button, Table } from 'antd'
import { wallet } from '@/scripts/wallet'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Admin() {
    let navigate = useNavigate()

    useEffect(() => {
        let username = sessionStorage.getItem("username")
        let password = sessionStorage.getItem("password")
        if (username && password) {
            let url = '/api/admin/login'
            let data = {
                username: username, password: password
            }
            axios({
                url: url,
                method: 'post',
                data: data
            }).then((res) => {
                if (res.data.code == 403 && res.data.message) {
                    confirm(res.data.message)
                    navigate(`/login`)
                }
            }).catch((err) => {
                confirm(`error: ${err}`)
                navigate(`/login`)
                console.log(err)
            })
            // sessionStorage.removeItem('username')
            // sessionStorage.removeItem('password')
        } else {
            confirm('请先登录')
            navigate(`/login`)
        }
    })

    useEffect(() => {
        function chainChanged(chainId) {
            let excuted = false
            if (!excuted) {
                if (chainId === '0x405') {
                    confirm("Fluent 网络错误，请切换到 Conflux 测试网")
                }
                excuted = true
            }
        }
        window.conflux.on('chainChanged', chainChanged)
    })

    const [userInfo, setUserInfo] = useState([])
    async function onListAll() {
        let info = await wallet.listAll()
        setUserInfo(info)
    }

    async function onListUsersToBeSent() {
        let info = await wallet.listUsersToBeSent()
        setUserInfo(info)
    }

    const [account, setAccount] = useState()

    async function onConnect() {
        let newAcc = await wallet.connect()
        setAccount(newAcc)
    }


    async function onMint() {
        await wallet.mint(account)
    }


    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address'
        },
        {
            title: 'VerseId',
            dataIndex: 'verId',
            key: 'verId'
        },
        {
            title: 'Verse',
            dataIndex: 'verse',
            key: 'verse'
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state'
        },
        {
            title: 'Tx Hash',
            dataIndex: 'txHash',
            key: 'hash'
        }
    ]
    return (
        <div>
            <div className="mt-10">
                <Button type="primary" size="large" className="w-28 mr-4" onClick={onConnect}>Connect</Button>
                <Button type="primary" size="large" className="w-28 mr-4" onClick={onListAll}>List all</Button>
                <Button type="primary" size="large" className="w-28 mr-4" onClick={onListUsersToBeSent}>To be sent</Button>
                <Button type="primary" size="large" className="w-28 mr-4" onClick={onMint}>Mint</Button>
            </div>
            <br />
            <div className="mx-2 px-4 border-2">
                <Table dataSource={userInfo} columns={columns} />
            </div>
        </div>
    )
}