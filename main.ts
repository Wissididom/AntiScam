import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import handleScam from "./scam-handler.ts";
import handleInvite from "./invite-handler.ts";
import handleExplicitContent from "./explicit-content-handler.ts";
const DC_TOKEN = Deno.env.get("DISCORD_TOKEN");
const IPQS_API_KEY = Deno.env.get("IPQS_API_KEY");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
  ],
});

client.on(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (await handleInvite(message)) return;
  if (await handleExplicitContent(message)) return;
  if (!IPQS_API_KEY) return;
  if (await handleScam(message, IPQS_API_KEY)) return;
});

if (!DC_TOKEN || !IPQS_API_KEY) {
  console.log(
    "Tokens not found! You have to set at least DISCORD_TOKEN and IPQS_API_KEY env variables!",
  );
} else {
  client.login(DC_TOKEN);
}
