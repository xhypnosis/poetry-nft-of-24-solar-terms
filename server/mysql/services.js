const mysql = require('mysql2')
const config = require('./config')

const pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE
})

let services = {
    query: (sql, values) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if(err) {
                    reject(err)
                } else {
                    connection.query(sql, values, (err, rows) => {
                        if(err) reject(err)
                        else resolve(rows)
                        connection.release()
                    })
                }
            })
        })
    },
    listAll: () => {
        let sql = `select * from Users`
        return services.query(sql)
    },
    listUsersToBeSent: () => {
        let sql = `select * from Users where IsSent=false`
        return services.query(sql)
    },
    checkUserIp: (obj) => {
        let sql = `select UserAddress from Users where ip=?`
        return services.query(sql, obj)
    },
    addUserInfo: (obj) => {
        let sql = `insert into Users set UserAddress=?, Verse=?, IsSent=?, ip=?, VerId=?`
        return services.query(sql, obj)
    },
    addInvalidUser: (obj) => {
        let sql = `insert into InvalidUser set InvalidUserId=?`
        return services.query(sql, obj)
    },
    updateTxHash: (obj) => {
        let sql = `update Users set IsSent=?, TxHash=? where UserId between ? and ?`
        return services.query(sql, obj)
    },
    // 检查诗句是否被占用
    checkOccupancy: (obj) => {
        let sql = `select Occupied from dashu where VerId=?`
        return services.query(sql, obj)
    },
    checkUser: (obj) => {
        let sql = `select Verse from Users where UserAddress=?`
        return services.query(sql, obj)
    },
    selectVerId: (obj) => {
        let sql = `select VerId from dashu where Verse=?`
        return services.query(sql, obj)
    },
    // 根据id获取诗句
    selectVerse: (obj) => {
        let sql = `select Verse from dashu where VerId=?`
        return services.query(sql, obj)
    },
    // 获取未被领取的诗句id
    unoccupiedVerId: () => {
        let sql = `select VerId from dashu where Occupied=false`
        return services.query(sql)
    },
    // 诗句被领取后更新
    updateOccupancy: (obj) => {
        let sql = `update dashu set Occupied=true where VerId =?`
        return services.query(sql, obj)
    },
    checkAdminPass: () => {
        let sql = `select UserName, Pass, Solt from admins where UserId=1`
        return services.query(sql)
    }
}

module.exports = services