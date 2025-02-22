import { Message } from "discord.js";

export default async function handle(message: Message) {
  if (message.channel.isDMBased()) return false;
  const lists: string[] = [
    "https://raw.githubusercontent.com/RPiList/specials/refs/heads/master/Blocklisten/pornblock1",
    "https://raw.githubusercontent.com/RPiList/specials/refs/heads/master/Blocklisten/pornblock2",
    "https://raw.githubusercontent.com/RPiList/specials/refs/heads/master/Blocklisten/pornblock3",
    "https://raw.githubusercontent.com/RPiList/specials/refs/heads/master/Blocklisten/pornblock4",
    "https://raw.githubusercontent.com/RPiList/specials/refs/heads/master/Blocklisten/pornblock5",
    "https://raw.githubusercontent.com/RPiList/specials/refs/heads/master/Blocklisten/pornblock6",
  ];
  for (const list of lists) {
    const content = await (await fetch(list)).text();
    for (let line of content.split("\n")) {
      if (line.startsWith("#")) continue;
      if (line.startsWith("||")) line = line.substring(2);
      if (message.content.includes(line)) {
        try {
          await message.delete();
          await message.member?.timeout(
            10 * 60 * 1000,
            "Posted an explicit link",
          );
        } catch (err) {
          console.log(
            `[explicit] Failed to delete and timeout (${message.channel.name})`,
          );
          console.log(err);
        }
        return true;
      }
    }
  }
  return false;
}
