import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
const DC_TOKEN = Deno.env.get("DISCORD_TOKEN");
const IPQUALITYSCORE_API_KEY = Deno.env.get("IPQUALITYSCORE_API_KEY");

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
  //const links: string[] = "The link of this question: https://stackoverflow.com/questions/6038061/regular-expression-to-find-urls-within-a-string Also there are some urls: www.google.com, facebook.com, http://test.com/method?param=wasd, http://test.com/method?param=wasd&params2=kjhdkjshd The code below catches all urls in text and returns urls in list.".match(/(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-&?=%.]+/g);
  const links: string[] = message.content.match(
    /(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-&?=%.]+/g,
  ) ?? [];
  for (const link of links) {
    const response = await fetch(
      `https://www.ipqualityscore.com/api/json/url/${IPQUALITYSCORE_API_KEY}/${
        encodeURIComponent(link)
      }`,
    );
    const json = await response.json();
    if (json.unsafe) await message.delete();
  }
});

if (!DC_TOKEN || !IPQUALITYSCORE_API_KEY) {
  console.log(
    "Tokens not found! You have to set at least DISCORD_TOKEN and IPQUALITYSCORE_API_KEY env variables!",
  );
} else {
  client.login(DC_TOKEN);
}
