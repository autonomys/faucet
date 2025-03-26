// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT as DefaultJWT } from 'next-auth/jwt'
declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string
    accountType: string
    isGitHubFollower?: boolean
    isDiscordGuildMember?: boolean
  }

  interface Session extends DefaultSession {
    user: User
    token: string
  }

  interface SavedUser extends User {
    createdAt: Expr
    updatedAt: Expr
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    accountType: string
    isGitHubFollower?: boolean
    isDiscordGuildMember?: boolean
  }
}
