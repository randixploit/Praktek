const express = require("express");
const crypto = require("crypto");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

let users = {
    "user@example.com": { password: "securepassword" }
};

const pageTemplate = (title, content) => `
    <html>
    <head>
        <title>${title}</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            form { display: inline-block; text-align: left; padding: 20px; border: 1px solid #ccc; border-radius: 10px; background: #f9f9f9; }
            input { margin: 5px 0; padding: 8px; width: 100%; }
            button { padding: 10px; background: #007bff; color: white; border: none; cursor: pointer; }
            button:hover { background: #0056b3; }
            a { text-decoration: none; color: #007bff; }
        </style>
    </head>
    <body>
        <h2>${title}</h2>
        ${content}
    </body>
    </html>
`;

app.get("/login", (req, res) => {
    res.send(pageTemplate("Login", `
        <form action="/login" method="post">
            <label>Email:</label><input type="email" name="email" required><br>
            <label>Password:</label><input type="password" name="password" required><br>
            <button type="submit">Login</button>
        </form>
        <br>
        <a href="/reset-password">Lupa Password?</a>
    `));
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (users[email] && users[email].password === password) {
        res.send(pageTemplate("Selamat Datang", `<p>Selamat datang, ${email}!</p>`));
    } else {
        res.send(pageTemplate("Login Gagal", `<p>Email atau password salah.</p><a href="/login">Coba lagi</a>`));
    }
});

app.get("/reset-password", (req, res) => {
    res.send(pageTemplate("Reset Password", `
        <form action="/reset-password" method="post">
            <label>Email:</label><input type="email" name="email" required><br>
            <button type="submit">Reset Password</button>
        </form>
    `));
});

app.post("/reset-password", (req, res) => {
    const { email } = req.body;
    const forwardedHost = req.get("X-Forwarded-Host");
    const hostHeader = forwardedHost || req.get("Host") || "Unknown Host";
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetURL = `http://${hostHeader}/reset-password/${resetToken}`;

    res.send(pageTemplate("Instruksi Reset Password", `
        <p>Jika email <b>${email}</b> terdaftar, gunakan link berikut untuk mereset password:</p>
        <a href="${resetURL}">Klik disini</a>
    `));
});

app.get("/reset-password/:token", (req, res) => {
    res.send(pageTemplate("Setel Ulang Password", `
        <p>Token: ${req.params.token}</p>
        <form action="/reset-password/${req.params.token}" method="post">
            <label>Password baru:</label><input type="password" name="password" required><br>
            <button type="submit">Reset Password</button>
        </form>
    `));
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
