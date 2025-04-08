// app/api/auth/[...nextauth]/route.ts
import * as jsonwebtoken from 'jsonwebtoken'
import NextAuth, { AuthOptions, TokenSet } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import DiscordProvider, { DiscordProfile } from 'next-auth/providers/discord'
import GitHubProvider, { GithubProfile } from 'next-auth/providers/github'

const ALLOWED_DOMAINS = ['subspacefaucet.com', 'autonomysfaucet.com', 'autonomysfaucet.xyz']

const authOptions: AuthOptions = {
  debug: false,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  jwt: {
    encode: ({ token, secret }) => jsonwebtoken.sign(token!, secret, { algorithm: 'HS256' }),
    decode: async ({ token, secret }) => jsonwebtoken.verify(token!, secret, { algorithms: ['HS256'] }) as JWT
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      authorization: {
        params: { scope: 'read:user public_repo' }
      },
      profile: async (profile: GithubProfile, token: TokenSet) => {
        let isGitHubFollower = false

        await fetch(`https://api.github.com/users/${profile.login}/following`, {
          headers: {
            Authorization: `Bearer ${token.access_token}`
          }
        })
          .then((res) => res.json())
          .then((json) => {
            isGitHubFollower =
              json.find((user: { login: string }) => user.login === process.env.GITHUB_ACCOUNT_NAME) !== undefined
          })
          .catch((err) => console.error(err))

        return {
          id: profile.id.toString(),
          name: profile.name,
          username: profile.username,
          accountType: 'github',
          isGitHubFollower
        }
      }
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
      authorization: {
        params: { scope: 'identify guilds guilds.members.read' }
      },
      profile: async (profile: DiscordProfile, token: TokenSet) => {
        let isDiscordGuildMember = false

        await fetch('https://discord.com/api/users/@me/guilds', {
          headers: {
            Authorization: `Bearer ${token.access_token}`
          }
        })
          .then((res) => res.json())
          .then((json) => {
            isDiscordGuildMember =
              json.find((guild: { id: string }) => guild.id === process.env.DISCORD_GUILD_ID) !== undefined
          })
          .catch((err) => console.error(err))

        return {
          id: profile.id,
          name: profile.name,
          username: profile.username,
          accountType: 'discord',
          isDiscordGuildMember
        }
      }
    })
  ],
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      const isAllowedDomain = ALLOWED_DOMAINS.some((domain) => new URL(url).hostname.endsWith(domain))
      if (!isAllowedDomain) return baseUrl
      return url
    },
    jwt: async ({ token, user, account }) => {
      if (account && user) {
        token.id = user.id
        token.accountType = user.accountType
        token.isGitHubFollower = user.isGitHubFollower
        token.isDiscordGuildMember = user.isDiscordGuildMember
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : null,
          refreshToken: account.refresh_token
        }
      }
      return token
    },
    session: async ({ session, token }) => {
      session.user = token
      return session
    }
  }
}

// App Router expects exports of HTTP handlers
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
