import * as jsonwebtoken from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { AuthOptions, TokenSet } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import DiscordProvider, { DiscordProfile } from 'next-auth/providers/discord'
import GitHubProvider, { GithubProfile } from 'next-auth/providers/github'
// import TwitterProvider, { TwitterProfile } from 'next-auth/providers/twitter'

export const authOptions = (): AuthOptions => {
  const providers: AuthOptions['providers'] = [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      authorization: {
        params: { scope: 'read:user public_repo' }
      },
      profile: async (profile: GithubProfile, token: TokenSet) => {
        let isGitHubFollower = false

        await fetch(`https://api.github.com/users/${profile.login}/following`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token.access_token}`
          }
        })
          .then((res) => res.json())
          .then((json) => {
            // Detect if user is following the GitHub account
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
      // authorization: { params: { scope: 'identify guilds' } },
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
      authorization: { params: { scope: 'identify guilds guilds.members.read' } },
      profile: async (profile: DiscordProfile, token: TokenSet) => {
        let isDiscordGuildMember = false

        await fetch(`https://discord.com/api/users/@me/guilds`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token.access_token}`
          }
          // body: JSON.stringify({
          //   target_user_id: '1382564789444964354'
          // })
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
    // TwitterProvider({
    //   version: '2.0',
    //   clientId: process.env.TWITTER_CLIENT_ID || '',
    //   clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
    //   authorization: {
    //     url: 'https://twitter.com/i/oauth2/authorize',
    //     params: { scope: 'users.read tweet.read follows.write offline.access' }
    //   },
    //   profile: async (profile: TwitterProfile) => {
    //     return {
    //       id: profile.data.id,
    //       name: profile.data.name,
    //       username: profile.data.username,
    //       accountType: 'twitter'
    //     }
    //   }
    // })
  ]
  return {
    debug: false,
    secret: process.env.NEXTAUTH_SECRET,
    providers,
    session: { strategy: 'jwt' },
    jwt: {
      encode: ({ token, secret }) => jsonwebtoken.sign(token!, secret, { algorithm: 'HS256' }),
      decode: async ({ token, secret }) => jsonwebtoken.verify(token!, secret, { algorithms: ['HS256'] }) as JWT
    },
    callbacks: {
      jwt: async ({ token, user }) => {
        if (user) {
          token.id = user.id
          token.accountType = user.accountType
          token.isGitHubFollower = user.isGitHubFollower
          token.isDiscordGuildMember = user.isDiscordGuildMember
        }
        return token
      },
      session: async ({ session, token }) => {
        session.user = token
        return session
      }
    }
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions())

export default handler
