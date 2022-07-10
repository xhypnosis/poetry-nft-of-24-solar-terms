const router = require('koa-router')()
const mysql = require('@mysql/services')

router
    .post('/claim', async (ctx, next) => {
        // Check address & ip
        let address
        let ip

        if (ctx.request.body.address) {
            address = ctx.request.body.address
            let userInfoByAddress = await mysql.checkUser(address)
            ip = await ctx.request.ip
            let userInfoByIp = await mysql.checkUserIp(ip)
            if (userInfoByAddress.length > 0) {
                ctx.body = { code: 403, message: "重复钱包地址无法再次领取" }
                return
            } else if (userInfoByIp.length > 0) {
                ctx.body = { code: 403, message: "重复ip地址无法再次领取" }
                return
            }
        } else {
            ctx.body = { code: 400, message: "地址不能为空" }
            return
        }

        // Get verse
        let verse
        let verId
        let verIdArray = await mysql.unoccupiedVerId()
        if (verIdArray.length > 0) {
            let index = Math.floor(Math.random() * verIdArray.length)
            let randomVerId = verIdArray[index]
            verId = randomVerId.VerId
            let verseData = await mysql.selectVerse(verId)
            verse = verseData[0].Verse
        } else {
            ctx.body = { code: 417, message: "很抱歉，本次活动全部nft已发放完毕，敬请期待下次活动" }
            return
        }

        // write packed info into database
        let isSent = false
        let arr = [address, verse, isSent, ip, verId]

        // Finally check if the verse is already occupied by others
        let occupiedData = await mysql.checkOccupancy(verId)
        let occupied = occupiedData[0].Occupied
        if (occupied === 1) {
            ctx.body = { code: 450, message: "很抱歉，您的诗句已被占用，请重新领取" }
            return
        }

        // Write user info to database
        await mysql.addUserInfo(arr)
            .then((data) => {
                if (data.affectedRows != 0) {
                    mysql.updateOccupancy(verId)
                }
                ctx.body = { code: 200, message: data }
            }).catch(error => {
                console.log(error)
                ctx.body = { code: 500, message: error }
            })
    })
    .post('/view', async (ctx, next) => {
        // Check User
        let address
        if (ctx.request.body.address) {
            address = ctx.request.body.address
        } else {
            ctx.body = { code: 400, message: "地址不能为空" }
            return
        }

        let userInfo = await mysql.checkUser(address)
        if (userInfo.length > 0) {
            let verse = userInfo[0].Verse
            let verseId = await mysql.selectVerId(verse)
            verseId = verseId[0].VerId

            verse = verse.replace(/[，、：；！。]/g, ' ')
            verse && verseId ? ctx.body = { code: 200, message: { verse: verse, verId: verseId } } : ctx.body = { code: 404, message: "抱歉，服务器未能查询到该钱包地址的信息" }
        } else {
            ctx.body = { code: 412, message: "您尚未领取节气NFT" }
        }
    })

module.exports = router