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

export async function GET(req, { params }) {
  const db = await mysql.createConnection(parseDbUrl())
  const { id } = params

  const [rows] = await db.execute('SELECT * FROM books WHERE id = ?', [id])
  await db.end()

  if (rows.length === 0) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
  }

  return Response.json(rows[0])
}


export async function PUT(req, { params }) {
  const db = await mysql.createConnection(parseDbUrl())
  const { id } = params
  const { title, description, image_url } = await req.json()

  try {
    await db.execute(
      'UPDATE books SET title = ?, description = ?, image_url = ? WHERE id = ?',
      [title, description, image_url, id]
    )
    await db.end()
    return Response.json({ message: 'Book updated successfully' })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to update book' }), { status: 500 })
  }
}

export async function DELETE(_req, { params }) {
  const db = await mysql.createConnection(parseDbUrl())
  const { id } = params

  try {
    await db.execute('DELETE FROM books WHERE id = ?', [id])
    await db.end()
    return Response.json({ message: 'Book deleted successfully' })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to delete book' }), { status: 500 })
  }
}


