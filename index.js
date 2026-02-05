import express from "express";
import axios from "axios";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/production", async (req, res) => {
  try {
    const timestamp = Date.now();

    const signStr = process.env.APP_KEY + timestamp;

    const sign = crypto
      .createHmac("sha256", process.env.APP_SECRET)
      .update(signStr)
      .digest("hex");

    const response = await axios.post(
      "https://gateway.isolarcloud.eu/openapi/getPlantRealtimeData",
      {
        plantId: process.env.PLANT_ID
      },
      {
        headers: {
          appkey: process.env.APP_KEY,
          timestamp,
          sign,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);

  } catch (err) {
    res.status(500).json({ error: "API error" });
  }
});

app.listen(PORT, () => {
  console.log("Server running");
});
