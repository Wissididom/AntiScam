import { Message } from "discord.js";

export default async function handle(message: Message, ipqsApiKey: string) {
  if (message.channel.isDMBased()) return false;
  //const links: string[] = "The link of this question: https://stackoverflow.com/questions/6038061/regular-expression-to-find-urls-within-a-string Also there are some urls: www.google.com, facebook.com, http://test.com/method?param=wasd, http://test.com/method?param=wasd&params2=kjhdkjshd The code below catches all urls in text and returns urls in list.".match(/(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-&?=%.]+/g);
  const links: string[] = message.content.match(
    /(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-&?=%.]+/g,
  ) ?? [];
  for (const link of links) {
    const response = await fetch(
      `https://www.ipqualityscore.com/api/json/url/${ipqsApiKey}/${
        encodeURIComponent(link)
      }`,
    );
    const json = await response.json();
    if (json.unsafe) {
      try {
        await message.delete();
        await message.member?.timeout(10 * 60 * 1000, "Posted an scam link");
      } catch (err) {
        console.log(
          `[scam] Failed to delete and timeout (${message.channel.name})`,
        );
        console.log(err);
      }
      return true;
    }
    return false;
  }
}
