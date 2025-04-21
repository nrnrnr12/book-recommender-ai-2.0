import mysql from 'mysql2/promise'

const parseDbUrl = () => {
  const url = new URL(process.env.DATABASE_URL)
  return {
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.replace('/', ''),
    port: Number(url.port || 4000),
    ssl: { rejectUnauthorized: true },
  }
}

export async function GET() {
  const db = await mysql.createConnection(parseDbUrl())
  const [rows] = await db.execute('SELECT * FROM books ORDER BY id DESC')
  await db.end()
  return Response.json(rows)
}

export async function POST(req) {
  const db = await mysql.createConnection(parseDbUrl())
  const { title, description, image_url } = await req.json()

  try {
    const [result] = await db.execute(
      'INSERT INTO books (title, description, image_url) VALUES (?, ?, ?)',
      [title, description, image_url]
    )
    await db.end()
    return Response.json({ id: result.insertId, message: 'Book added successfully' })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Failed to add book' }), { status: 500 })
  }
}
