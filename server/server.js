import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import User from './models/User.js'; // Import the User model

const saltRounds = 10;

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authenticated" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is not okay" });
            } else {
                req.name = decoded.name;
                next();
            }
        });
    }
};

app.get('/', verifyUser, (req, res) => {
    return res.json({ Status: "Success", name: req.name });
});

app.post('/register', async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, saltRounds);
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
        return res.json({ Status: "Success" });
    } catch (err) {
        console.error("Error inserting data in server:", err);
        return res.json({ Error: "Error inserting data in server" });
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (user) {
            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
            if (isPasswordValid) {
                const token = jwt.sign({ name: user.name }, "jwt-secret-key", { expiresIn: '1d' });
                res.cookie('token', token);
                return res.json({ Status: "Success" });
            } else {
                return res.json({ Error: "Incorrect Password" });
            }
        } else {
            return res.json({ Error: "Unregistered user" });
        }
    } catch (err) {
        return res.json({ Error: "Login error in server" });
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
});

app.listen(8081, () => {
    console.log("Running... at port 8081");
});
