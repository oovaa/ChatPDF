import { Router } from 'express'
import supabase from '../db/supabase'

const OauthRouter = Router()

OauthRouter.get('/auth/google', async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.SUPABASE_URL}/auth/v1/callback`,
      },
    })

    if (error) throw error
    res.redirect(data.url)
  } catch (error) {
    console.error('Google OAuth error:', error)
    res.status(500).json({ error: 'Google authentication failed' })
  }
})

OauthRouter.get('/auth/callback', async (req, res) => {
  const { code } = req.query
  if (!code) return res.status(400).json({ error: 'Missing auth code' })

  try {
    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) throw error

    // Get user info from Supabase
    const { user } = data
    const email = user.email

    // Check existing user
    let existingUser = await getUserByEmail(email)

    // Create new user if not exists
    if (!existingUser) {
      const username = email.split('@')[0]
      existingUser = await addUser(username, email, null)
    }

    // Generate JWT
    const userData = {
      id: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
    }
    const token = signJWT(userData)

    console.log(existingUser)
    res.sendStatus(200)
  } catch (error) {
    console.error('Callback error:', error)
    res.status(500).json({ error: 'Authentication failed' })
  }
})

export { OauthRouter }
