const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
}
const comparePassword = async (password, hashPassword) => {
    const isMatch = await bcrypt.compare(password, hashPassword);
    return isMatch;
}
const createToken = (payload) => {
    const token =  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token
}
const verifyToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded
}

module.exports = { hashPassword, comparePassword, createToken, verifyToken }