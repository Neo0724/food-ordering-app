const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(bodyParser.json());

// Store all connected clients
const clients = new Set();

wss.on("connection", (ws, req) => {
  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);
      if (data.type === "identify") {
        ws.userId = data.userId;
        console.log("Identified user:", ws.userId);
      }
    } catch (err) {
      console.error("Invalid message", err);
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
  });

  clients.add(ws);
});

app.post("/update-order", (req, res) => {
  const userId = req.body.userId;
  const orderId = req.body.orderId;
  const payload = {
    userId,
    orderId,
  };

  console.log(req.query.orderId);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      console.log("User ID: " + userId + " is listening");
      if (client.userId == userId) {
        console.log(
          "Order completed for: " + client.userId + ", OrderID: " + orderId
        );
        client.send(JSON.stringify(payload));
      }
    }
  }
});

// POST endpoint to receive event and notify clients
app.post("/notify/order-completed", (req, res) => {
  const message = {
    type: "ORDER_COMPLETED",
    payload: req.body,
  };

  // Broadcast to all connected clients
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  res.status(200).json({ status: "notified" });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
