import * as jsonwebtoken from 'jsonwebtoken'
import { JWT } from 'next-auth/jwt'
import { cookies } from 'next/headers'

export const verifyToken = async () => {
  if (!process.env.NEXTAUTH_SECRET) throw new Error('No secret')
  const { NEXTAUTH_SECRET } = process.env

  const { get } = await cookies()
  const sessionToken = get('__Secure-next-auth.session-token')?.value || get('next-auth.session-token')?.value
  if (!sessionToken) throw new Error('No session token')

  const session = jsonwebtoken.verify(sessionToken, NEXTAUTH_SECRET, {
    algorithms: ['HS256']
  }) as JWT

  if (session.id) return session
  else throw new Error('Invalid token')
}
