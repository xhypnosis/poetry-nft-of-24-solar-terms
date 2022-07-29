import axios from 'axios'
import { abi } from './abi'
import { Conflux, format } from 'js-conflux-sdk'

const confluxJs = new Conflux({
    url: 'https://test.confluxrpc.com',
    logger: console,
    networkId: 1,
})

const contract = confluxJs.Contract({
    abi,
    address: 'cfxtest:acfwy95k9k75ads3tvxxu8t14tru34nevyrr3s50es'
})
confluxJs.provider = window.conflux

export const wallet = {
    connect: async () => {
        let accounts = await window.conflux.request({ method: "cfx_requestAccounts" })
        let account = accounts[0]
        return account
    },
    listAll: async () => {
        console.log("Start getting all users...")
        let url = '/api/admin/listAll'
        let allUsers = []
        await axios({
            url: url,
            method: 'get',
        }).then((res) => {
            if (res.data.code == 200 && res.data.message) {
                allUsers = res.data.message
            } else {
                console.log(res.data.message)
            }
        }).catch((err) => {
            console.log(err)
        })
        return allUsers
    },
    listUsersToBeSent: async () => {
        console.log("Start getting all users without an nft...")
        let usersToBeSent = []
        let url = '/api/admin/listUsersToBeSent'
        await axios({
            url: url,
            method: 'get',
        }).then((res) => {
            if (res.data.code == 200 && res.data.message) {
                usersToBeSent = res.data.message
            } else {
                console.log(res.data.message)
            }
        }).catch((err) => {
            console.log(err)
        })
        return usersToBeSent
    },
    mint: async (account) => {
        console.log(account)
        // Get users have not yet been distributed with NFTs from database
        // and write into waitedUser
        let usersToBeSent = await wallet.listUsersToBeSent()
        if (usersToBeSent.length < 1) {
            confirm('没有需要发送nft的用户')
            return
        }

        let addresses = []
        let verses = []
        let userIds = []
        let invalidAddresses = []
        let batch = []
        let uris = []
        if (usersToBeSent.length > 39) {
            batch = usersToBeSent.slice(0, 40)
        } else {
            batch = usersToBeSent
        }

        for (let info of batch) {
            try {
                try {
                    format.address(info.address, 1)
                } catch (e) {
                    invalidAddresses.push(info.id)
                    console.log(e)
                }
                userIds.push(info.id)
                addresses.push(info.address)
                verses.push(info.verse)
                uris.push(`xiaoshu/${info.verId}/`)
            } catch (e) {
                console.log(e)
            }
        }

        if (invalidAddresses.length > 0) {
            axios({
                url: '/api/admin/invalid',
                method: 'post',
                data: invalidAddresses
            }).then((res) => {
                console.log(res.data.message)
            }).catch((err) => {
                console.log(err)
            })
        }

        console.log(account)
        const txHash = await contract.batchAddItemByAddress(addresses, uris).sendTransaction({ from: account }).executed()

        axios({
            url: '/api/admin/updateUserInfo',
            method: 'post',
            data: [txHash, userIds[0], userIds[userIds.length - 1]]
        }).then((res) => {
            if (res.data.code == 200 && res.data.message) {
                console.log(res.data.message)
            }else {
                console(res.data.message)
            }
        }).catch((err) => {
            console.log(err)
        })
    }
}