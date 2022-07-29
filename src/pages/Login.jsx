import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    let navigate = useNavigate()

    function onUserChange(e) {
        setUsername(e.target.value)
    }

    function onPassChange(e) {
        setPassword(e.target.value)
    }

    function onLogin(e) {
        e.preventDefault()
        sessionStorage.setItem('username', username)
        sessionStorage.setItem('password', password)
        let url = '/api/admin/login'
        let data = {
            username: username, password: password
        }
        axios({
            url: url,
            method: 'post',
            data: data
        }).then((res) => {
            if (res.data.code == 200 && res.data.message) {
                navigate(`/admin`, { replace: true })
            } else {
                confirm('用户名或密码错误')
            }
        }).catch((err) => {
            console.log(err)
            confirm(err)
        })
    }

    return (
        <div className="flex h-full items-center">
            <div className="m-auto w-96 h-80 p-10 border-2 rounded-sm border-solid border-gray-400">
                <h1 className="text-center text-4xl text-stone-600 tracking-wide mb-8">Login</h1>
                <form autoComplete="off" onSubmit={(e) => onLogin(e)}>
                    <input type="text" required placeholder="用户名" value={username} onChange={(e) => onUserChange(e)} className="w-72 h-9 mb-3 border-2 rounded border-gray-500 p-3 outline-0 text-slate-600 text-[14px]" />
                    <input type="password" required placeholder="密码" value={password} onChange={(e) => onPassChange(e)} className="w-72 h-9 mb-6 border-2 rounded border-gray-500 p-3 outline-0 text-slate-600 text-[14px]" />
                    <button type="submit" className="w-72 h-9 bg-neutral-200 text-[20px] font-semibold text-stone-600">Log in</button>
                </form>
            </div>
        </div>
    )
}