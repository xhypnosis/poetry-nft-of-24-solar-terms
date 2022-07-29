const router = require('koa-router')()
const mysql = require('@mysql/services')
const { format } = require('js-conflux-sdk')
const MD5 = require('@public/javascripts/md5Hash')

router.prefix('/admin')

router
    .post('/login', async (ctx, next) => {
        let username = ctx.request.body.username
        let password = ctx.request.body.password
        let adminInfo = await mysql.checkAdminPass()
        let adminName = adminInfo[0].UserName
        let adminPass = adminInfo[0].Pass
        let adminSolt = adminInfo[0].Solt
        let md5Pass = await MD5(password, adminSolt)
        if (username === adminName && md5Pass === adminPass) {
            ctx.body = { code: 200, message: "valid login" }
        } else {
            console.log("invalid login")
            ctx.body = { code: 403, message: "invalid login" }
        }
    })
    .get('/listAll', async (ctx, next) => {
        try {
            let users = await mysql.listAll()
            let pretreatedInfo = users.map(current => {
                // Decode if user address string is url encoded
                let decodeAddr = decodeURIComponent(current.UserAddress)
                // Transfer to Tethys if the address is Testnet format
                // let tethysAddr = format.address(decodeAddr, 1029)
                // current.UserAddress = tethysAddr
                let userInfo = {
                    key: current.UserId,
                    address: current.UserAddress,
                    verse: current.Verse,
                    state: current.IsSent,
                    txhash: current.TxHash
                }
                return userInfo
            })
            ctx.body = { code: 200, message: pretreatedInfo }
        } catch (error) {
            ctx.body = { code: 500, message: error }
        }
    })
    .get('/listUsersToBeSent', async (ctx, next) => {
        try {
            let usersToBeSent = await mysql.listUsersToBeSent()
            let pretreatedInfo = usersToBeSent.map(current => {
                // Decode if user address string is url encoded
                let decodeAddr = decodeURIComponent(current.UserAddress)
                // Transfer to Tethys if the address is Testnet format
                // let tethysAddr = format.address(decodeAddr, 1029)
                // current.UserAddress = tethysAddr
                let userInfo = {
                    key: current.UserId,
                    id: current.UserId,
                    address: current.UserAddress,
                    verId: current.VerId,
                    verse: current.Verse,
                    state: current.IsSent,
                    txhash: current.TxHash,
                }
                return userInfo
            })
            ctx.body = { code: 200, message: pretreatedInfo }
        } catch (error) {
            ctx.body = { code: 500, message: error }
        }
    })
    .post('/updateUserInfo', async (ctx, next) => {
        let start
        let end
        let txHash
        if (ctx.request.body.length > 0) {
            console.log(ctx.request.body)
            txHash = ctx.request.body[0].transactionHash
            start = ctx.request.body[1]
            end = ctx.request.body[2]
        } else {
            ctx.body = { code: 403, message: `transaction info cannot be empty` }
            return
        }

        let isSent = true
        let arr = []
        arr.push(isSent)
        arr.push(txHash)
        arr.push(start)
        arr.push(end)
        await mysql.updateTxHash(arr)
            .then((data) => {
                if (data.affectedRows != 0) {
                    ctx.body = { code: 200, message: `TxHash ${txHash} has been written into database` }
                }
            }).catch(error => {
                ctx.body = { code: 500, message: error }
            })
    })
    .post('/invalid', async (ctx, next) => {
        let invalidUsers = []
        if (ctx.request.body.length > 0) {
            invalidUsers = ctx.request.body
        } else {
            ctx.body = { code: 403, message: `invalid users cannot be empty` }
            return
        }
        for (user of invalidUsers) {
            mysql.addInvalidUser(user)
        }
        ctx.body = { code: 200, message: `Invalid users ${invalidUsers} has been written into database` }
    })

module.exports = router