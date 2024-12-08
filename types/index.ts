import {
  Account,
  Comment,
  Follower,
  FriendRequest,
  Game,
  GameBody,
  Like,
  Media,
  Member,
  Notification,
  Organization,
  OrganizationFollower,
  OrganizationMember,
  Post,
  PostTag,
  Server,
  Tag,
  User,
  UserGame,
} from "@prisma/client";


import { NextApiResponse } from "next";
import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";


export type FullUserType = User & {
  account: Account[] | null;
  followers: Follower[] | null;
  followings: Follower[] | null;
  organizationFollowers: OrganizationFollower[] |null;
  friendRequestSent: FullFriendRequestType[] | [];
  friendRequestReceived: FullFriendRequestType[] | [];
  UserGames: FullUserGameType[] | []
};

export type FullFriendRequestType = FriendRequest & {
    requester: FullUserType;
    recipient: FullUserType
}

export type FullGameBodyType = GameBody & {
  user: User;
  game: Game;
};

export type FullUserGameType = UserGame & {
  user?: FullUserType;
  game?: Game
}

export type FullOrganizationType = Organization & {
  members?: OrganizationMember[];
  followers?: OrganizationFollower[];
}

export type FullLikeType = Like & {
  user?: User
}

export type FullPostType = Post & {
  user?: User;
  organization?: Organization
  attachments?: Media[];
  likes?:FullLikeType[]
}

export type FullCommentType = Comment & {
  user?: User;
  likes?:FullLikeType[]
}

export type FullTagType = Tag & {
  posts: PostTag[] 
}

export type FullNotificationType = Notification & {
  post: Post;
  actor: User
}

export interface NotificationData {
  userId: string |null; // Bildirimi alan kullanıcının ID'si
  organizationId: string |null; // Bildirimi alan kullanıcının ID'si
  type: "LIKE" | "COMMENT" | "MENTION"; // Bildirim türleri
  content?:string;
  postId?: string; // (isteğe bağlı) Post ile ilişkili ID
  commentId?: string; // (isteğe bağlı) Yorum ile ilişkili ID
}

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: User })[];
}

export type NextApiResponeServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}