"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Middleware to parse JSON bodies
const clients = new Map();
const server = app.listen(8080);
app.get("/notification", (req, res) => {
    console.log("ready!");
    const { comment, id, authorId } = req.body;
    const ws = clients.get(authorId);
    if (ws) {
        ws.send(comment);
        console.log("Comment sent", comment);
        res.status(200).json("Notification sent");
    }
    else {
        res.status(404).send("Author ain't active");
    }
});
const wss = new ws_1.WebSocketServer({
    server: server
});
wss.on("connection", (ws) => {
    console.log("ws is");
    ws.on("message", (data) => {
        const dataString = data.toString();
        const id = JSON.parse(dataString);
        clients.set(id, ws);
        console.log("THe list is", clients);
    });
    ws.send("Hey brother watis up");
    ws.on("close", () => {
        for (let [id, client] of clients) {
            if (client === ws) {
                clients.delete(id);
                console.log("client disconnected ", client);
                console.log("New list", clients);
                break;
            }
        }
    });
});
