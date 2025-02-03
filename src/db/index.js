import supabase from './supabase'

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

async function listOAuthUsers() {
  const { data, error } = await supabase
    .from('auth.users') // Access the auth.users table
    .select('id, email, created_at, last_sign_in_at, raw_app_meta_data') // Select relevant fields
    .eq('raw_app_meta_data->>provider', 'google') // Filter users who signed in with Google

  if (error) throw error

  // Map the data to a more user-friendly format
  const googleOAuthUsers = data.map((user) => ({
    id: user.id,
    email: user.email,
    provider: user.raw_app_meta_data?.provider || 'unknown', // Extract the OAuth provider
    created_at: user.created_at,
    last_sign_in_at: user.last_sign_in_at,
  }))

  return googleOAuthUsers
}

// Call the function and log the result
// listOAuthUsers()
//   .then((users) => console.log(users))
//   .catch((err) => console.error(err))

export {
  addUser,
  getUserByEmail,
  getUserByUsername,
  deleteUser,
  getUserById,
  listUsers,
}
