import { User } from "src/entities/user/user.entity";
import { Archivements } from "./archivements/archivments.entity";
import { Channel } from "./channel/channel.entity";
import { MatchHistoryEntry } from "./matchHistoryEntry/matchHistoryEntry.entity";
import { Message } from "./message/message.entity";

const entities = [User, MatchHistoryEntry, Archivements, Channel, Message];

export {User};
export default entities;