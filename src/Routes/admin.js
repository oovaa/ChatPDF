import { Router } from 'express'
import { listUsers } from '../db/index.js'
const adminRouter = new Router()

// Example usage in a route handler
adminRouter.get('/users', (req, res) => {
  try {
    const users = listUsers()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

export { adminRouter }
