import { Account, Follower, Game, GameBody, User, } from "@prisma/client";

export type FullUserType= User & {
    account: Account[] | null
    followers: Follower[] | null
    followings: Follower[] | null
}

export type FullGameBodyType = GameBody & {
    user: User
    game: Game
}