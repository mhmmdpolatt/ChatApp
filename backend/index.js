require('dotenv').config();
const express = require('express');

const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { pool, createMessagesTable } = require("./db");
const WebSocket = require("ws");




const app = express();

app.use(express.json());

console.log("Fonksiyon:", createMessagesTable);
createMessagesTable();

// Güvenlik önlemleri
app.use(helmet());
app.use(cors());
app.use(express.json());

// WebSocket sunucusu
const wss = new WebSocket.Server({ port: process.env.WS_PORT });
console.log(`ws çalışıyor port: ${process.env.WS_PORT}`);


 // Bağlı kullanıcılar





let users = new Set();

wss.on('connection', (ws) => {
    console.log('Yeni bir kullanıcı bağlandı.');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleMessage(ws, data);
        } catch (error) {
            console.error('Geçersiz JSON verisi:', error);
        }
    });

    ws.on('close', () => {
        handleDisconnect(ws);
    });
});

// 🔹 Gelen mesajları yönet
function handleMessage(ws, data) {
    if (data.type === 'join') {
        handleUserJoin(ws, data);
    } else if (data.type === 'message') {
        broadcastMessage(ws, data.message);
        saveMessage(ws.nickname, data.message);
    }
}

// 🔹 Kullanıcı katıldığında çalışır
function handleUserJoin(ws, data) {
    if (users.has(data.nickname)) {
        return ws.send(JSON.stringify({ type: 'error', message: 'Bu ad zaten kullanılıyor.' }));
    }

    users.add(data.nickname);
    ws.nickname = data.nickname;

    ws.send(JSON.stringify({ type: 'join', message: 'Sohbet odasına katıldınız.' }));
    sendActiveUsers(ws);
    broadcastNotification(`${data.nickname} sohbete katıldı.`, ws);
    updateActiveUsers();
}

// 🔹 Kullanıcı ayrıldığında çalışır
function handleDisconnect(ws) {
    if (ws.nickname) {
        users.delete(ws.nickname);
        broadcastNotification(`${ws.nickname} sohbetten ayrıldı.`, ws);
        updateActiveUsers();
    }
}

// 🔹 Mesajı herkese gönder
function broadcastMessage(ws, message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'message', nickname: ws.nickname, message }));
        }
    });
}

// 🔹 Bildirim mesajını herkese gönder
function broadcastNotification(message, sender) {
    wss.clients.forEach((client) => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'notification', message }));
        }
    });
}

// 🔹 Kullanıcı listesi güncellendiğinde herkese gönder
function updateActiveUsers() {
    const activeUsers = Array.from(users);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'active', users: activeUsers }));
        }
    });
}

// 🔹 Yeni bağlanan kullanıcıya aktif kullanıcıları gönder
function sendActiveUsers(ws) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'active', users: Array.from(users) }));
    }
}

// 🔹 Mesajları veritabanına kaydet
function saveMessage(username, message) {
    pool.query('INSERT INTO messages (user_name, message) VALUES ($1, $2)', [username, message], (err) => {
        if (err) console.error('Mesaj kaydedilirken hata oluştu:', err);
    });
}


// API: Mesajları getir
// app.get('/messages', async (req, res) => {
//     try {
//         const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
//         res.json(result.rows);
//     } catch (err) {
//         console.error('Mesajlar getirilirken hata oluştu:', err);
//         res.status(500).send('Sunucu hatası');
//     }
// });

port=process.env.PORT

app.listen(port, () => {
    console.log(`Backend sunucusu http://localhost:${port} üzerinde çalışıyor.`);
});