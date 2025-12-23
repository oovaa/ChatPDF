import supabase from './supabase.js'

async function addUser(username, email, password) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ username, email, password }])
    .select('id, username, email') // Return only non-sensitive fields
    .single()

  if (error) {
    console.error('Error adding user:', error)
    throw error
  }
  return data
}

async function getUserByUsername(username) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  if (error?.code === 'PGRST116') return null // No rows found
  if (error) throw error
  return data
}

async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return data
}

async function getUserById(id) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return data
}

async function deleteUser(id) {
  const { error } = await supabase.from('users').delete().eq('id', id)

  if (error) {
    console.error('Error deleting user:', error)
    throw error
  }
  return { success: true }
}

async function listUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, email')
    .order('id', { ascending: false })

  if (error) throw error
  return data
}

console.log(await listUsers())

export {
  addUser,
  getUserByEmail,
  getUserByUsername,
  deleteUser,
  getUserById,
  listUsers,
}
