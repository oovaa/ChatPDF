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

function addUser(username, email, password) {
  const query = db.query(
    'INSERT INTO users (username, email, password) VALUES ($username, $email, $password)'
  )
  return query.run({
    username: username,
    email: email,
    password: password,
  })
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

// console.log(getUserByEmail('omar') || getUserByUsername('omar'))
initDB()

export {
  initDB,
  addUser,
  getUserByEmail,
  getUserByUsername,
  deleteUser,
  getUserById,
}
