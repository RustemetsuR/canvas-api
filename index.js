const express = require("express");
const expressWs = require("express-ws");
const { nanoid } = require("nanoid");
const app = express();
expressWs(app);

const activeConnections = {};
const pixelsArray = [];

app.ws("/canvas", (ws, req) => {
    const id = nanoid();
    console.log("Client connected! id = " + id);
    activeConnections[id] = ws;

    ws.on("message", msg => {
        const decodedMessage = JSON.parse(msg);
        switch (decodedMessage.type) {
            case "GET_ALL_PIXELS":
                ws.send(JSON.stringify({ type: "ALL_PIXELS", pixelsArray }));
                break;
            case "CREATE_PIXEL":
                 Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId];
                    pixelsArray.push({
                        pixels: decodedMessage.pixels,
                    });
                     conn.send(JSON.stringify({
                        type: "NEW_PIXEL",
                        pixels: decodedMessage.pixels,
                    }));
                });

                break;
            default:
                console.log("Unknown message type:", decodedMessage.type);
        }
    });

});

app.listen(8000, () => {
    console.log("Server started at http://localhost:8000");
});

