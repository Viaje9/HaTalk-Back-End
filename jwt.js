const jwt = require('jsonwebtoken')


// 設定密鑰
const SECRET = 'thisismynewproject'
// 建立 Token
const token = jwt.sign({ _id: 'hello' }, SECRET, { expiresIn: '1 day' })

console.log(token);