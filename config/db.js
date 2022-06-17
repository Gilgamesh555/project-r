const moongose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')

const connectDB = async () => {
    try {
        await moongose.connect(
            db,
            {
                useNewUrlParser: true,
                autoIndex: true,
            }
        )
        console.log('MongoDB is connected...')
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
}

module.exports = connectDB