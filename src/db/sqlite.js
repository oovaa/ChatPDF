import { Database } from 'bun:sqlite'

const db = new Database('./database.sqlite', {
  strict: true,
})

// db.run('drop table users')

function initDB() {
  return db.run(
    `create table if not exists users(
        id integer primary key autoincrement, 
        username varchar(255) not null unique, 
        email varchar(255) unique, 
        password varchar(255) not null
    )`
  )
}

// Fixed addUser function with proper error handling
function addUser(username, email, password) {
  try {
    // Start transaction
    db.exec('BEGIN TRANSACTION')

    // Insert user
    const insert = db.prepare(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
    )
    insert.run(username, email, password)

    // Get inserted user
    const select = db.prepare(
      'SELECT id, username, email FROM users WHERE username = ?'
    )
    const user = select.get(username)

    // Commit transaction
    db.exec('COMMIT')
    return user
  } catch (error) {
    db.exec('ROLLBACK')
    console.error('Error adding user:', error)
    throw error
  }
}

function getUserByUsername(username) {
  const query = db.query(`SELECT * FROM users WHERE username = $username`)
  return query.get({ username: username })
}

function getUserByEmail(email) {
  const query = db.query(`SELECT * FROM users WHERE email = $email`)
  return query.get({ email: email })
}

function getUserById(id) {
  const query = db.query(`SELECT * FROM users WHERE id = $id`)
  return query.get({ id: id })
}

function deleteUser(id) {
  const query = db.query('DELETE FROM users WHERE id = $id')
  return query.run({ id: id })
}

// List all users (without sensitive information)
function listUsers() {
  const query = db.prepare(
    'SELECT id, username, email FROM users ORDER BY id DESC'
  )
  return query.all()
}

// console.log(getUserByEmail('omar') || getUserByUsername('omar'))
initDB()

export {
  initDB,
  addUser,
  getUserByEmail,
  getUserByUsername,
  deleteUser,
  getUserById,
  listUsers,
}
