const {v4} = require('uuid')

const generateUniqueID = () => {
    return v4()
}

module.exports = generateUniqueID