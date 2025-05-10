const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Convenience as we dont have to parse the request body
app.use(bodyParser.json());

// Store connection clients and avoid duplicate clients
const clients = new Set();

// On socket connection
wss.on("connection", (ws, req) => {
  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);
      // The message is about the user identity
      if (data.type === "identify") {
        ws.userId = data.userId;
        console.log("Identified user:", ws.userId);
      }
    } catch (err) {
      console.error("Invalid message", err);
    }
  });

  // Delete the client when websocket closed
  ws.on("close", () => {
    clients.delete(ws);
  });

  // Store the client data into the set
  clients.add(ws);
});

// API end point to notify the user about their completed orders
app.post("/update-order", (req, res) => {
  // Retrieve the userId and orderId from the request body
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
      // Send the notification to client if the request userId is same as the client's userId
      if (client.userId == userId) {
        console.log(
          "Order completed for: " + client.userId + ", OrderID: " + orderId
        );
        client.send(JSON.stringify(payload));
      }
    }
  }
});

// Run the websocket connection
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
