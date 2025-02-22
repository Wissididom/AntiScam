import { Message } from "discord.js";

export default async function handle(message: Message) {
  if (message.channel.isDMBased()) return false;
  const links: string[] = message.content.match(
    /(?:https?:\/\/)?(?:www\.)?(?:(?:discord(?:app)?|dsc)\.(?:gg|io|me|li|com\/invite|dsc\.gg))\/[^\s/]+/g,
  ) ?? [];
  if (links.length > 0) {
    try {
      await message.delete();
      await message.member?.timeout(10 * 60 * 1000, "Posted an invite link");
    } catch (err) {
      console.log(
        `[invite] Failed to delete and timeout (${message.channel.name})`,
      );
      console.log(err);
    }
    return true;
  }
  return false;
}
