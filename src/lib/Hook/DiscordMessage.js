"use client";

import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once("ready", (message) => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// 替換成你的 Discord Bot Token
client.login(process.env.DISCORD_TOKEN);

// 發送消息到指定頻道
export default function sendMessageToChannel(messageContent) {
  // 替換成你想要發送消息的頻道 ID
  const channelId = "1280044925613903925";
  const channel = client.channels.cache.get(channelId);

  if (channel) {
    channel
      .send(messageContent)
      .then(() => console.log(`Message sent: ${messageContent}`))
      .catch(console.error);
  } else {
    console.log("Channel not found!");
  }
}

export function sendErrorToChannel(errorMessage) {
  const errorChannelId = "1339834071236476960";
  console.log(`Attempting to send to channel: ${errorChannelId}`);
  const channel = client.channels.cache.get(errorChannelId);
  
  if (channel) {
    channel
      .send(`❌ 爬蟲錯誤通知:\n${errorMessage}`)
      .then(() => console.log(`Error message sent to channel ${errorChannelId}`))
      .catch(console.error);
  } else {
    console.log(`Error channel not found! ID: ${errorChannelId}`);
  }
}
