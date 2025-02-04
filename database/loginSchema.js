const bcrypt = require('bcrypt');
const { dynamoClient, GetCommand, PutCommand, ScanCommand } = require('./dynamoDB');
const jwt = require('jsonwebtoken');

const TABLE_NAME = 'users';

exports.signUp = async (email, password, loc) => {
    if (!email || !password) throw new Error('Email and password are required');
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        throw new Error("AWS credentials are missing. Check environment variables.");
    }
    const existingUser = await userExist(email);
    if (existingUser) throw new Error('User already exists');

    const hashPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT));

    const params = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            email: email,
            password: hashPassword,
            address: loc
        },
    });

    try {
        await dynamoClient.send(params);
        const cookies = await createCookies(email);
        return { message: 'User signed up successfully', cookies : cookies};
    } catch (err) {
        console.error('Error saving user:', err);
        throw new Error('Error signing up');
    }
};

exports.signIn = async (email, password) => {
    if (!email || !password) throw new Error("Email and password required");

    const params = new GetCommand({
        TableName: TABLE_NAME,
        Key: { email },
    });

    try {
        const res = await dynamoClient.send(params);

        if (!res.Item) throw new Error('User not found');

        const isPasswordCorrect = await bcrypt.compare(password, res.Item.password);
        if (!isPasswordCorrect) throw new Error('Invalid password');
        const cookies = await createCookies(email);
        return { message: 'Sign-in successful', cookies: `${cookies}` };
    } catch (err) {
        console.error('Error signing in:', err);
        throw new Error('Error signing in');
    }
};

const userExist = async (email) => {
    const params = new GetCommand({
        TableName: TABLE_NAME,
        Key: { email }
    });

    try {
        const res = await dynamoClient.send(params);
        return res.Item || null;
    } catch (err) {
        console.error('Error checking user existence:', err);
        throw new Error('Database error');
    }
};

const createCookies = async (email)=>{
    const cookie = await jwt.sign(email, process.env.JWT_SECRET);
    console.log(cookie)
    return cookie;
}
exports.isAuth = async (req, res, next) => {
    try {
        const token = req.body.cookies;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        const email = jwt.verify(token, process.env.JWT_SECRET);
        console.log(email)
        const params = new GetCommand({
            TableName: TABLE_NAME,
            Key: { email }
        });

        const result = await dynamoClient.send(params);
        console.log(result)
        if (result.Item) {
            req.body.auth = {
                email: result.Item.email
            }
            next();
        } else {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token", error: error.message });
    }
};
