import { NextResponse } from 'next/server'
import { books } from '@/lib/books'

export async function POST(req) {
  try {
    const { answers } = await req.json()

    const bookListText = books.map(
      (b, i) => `${i + 1}. ${b.title} - ${b.description} (categories: ${b.category.join(', ')})`
    ).join('\n')

    const prompt = `
Based on the user's quiz answers: [${Object.values(answers).join(', ')}]

Here is a list of books:
${bookListText}

Which 5 books best match the user's personality and interests?
Return only a JSON array of 5 book titles like: ["The Alchemist", "The Book Thief", ...]
`

    const res = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt,
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    const data = await res.json()
    const reply = data.generations?.[0]?.text?.trim() || '[]'

    const titles = JSON.parse(reply)
    const matchedBooks = books.filter(book => titles.includes(book.title))

    return NextResponse.json({ books: matchedBooks })
  } catch (err) {
    console.error('Cohere error:', err)
    return NextResponse.json({ error: 'Failed to recommend books' }, { status: 500 })
  }
}


function generatePrompt(answers) {
  return `
จากคำตอบแบบสอบถามบุคลิกภาพต่อไปนี้:
${Object.values(answers).join(', ')}

กรุณาแนะนำหนังสือ 5 เล่มที่เหมาะกับบุคลิกของผู้ใช้
- ให้ชื่อหนังสือ + คำอธิบายเกี่ยวกับหนังสือ
- ชวนให้อ่าน และบอกเหตุผลว่าทำไมเหมาะ
- ใช้ภาษาไทย
- ไม่ต้องแสดงลิงก์ ถ้าผู้ใช้ต้องการสามารถค้นหาชื่อหนังสือเองได้
`
}

// 🧠 แปลงข้อความ AI → Array ของ book object
function parseBooksFromText(text) {
  const lines = text.split('\n').filter(line => line.trim().startsWith('- '))
  const books = lines.map(line => {
    const cleaned = line.replace(/^- /, '').trim()
    const [titlePart, ...descParts] = cleaned.split(' - ')
    const [title, author] = titlePart.split(' by ')
    return {
      title: title?.trim() || 'ไม่ทราบชื่อ',
      author: author?.trim() || 'ไม่ทราบผู้แต่ง',
      description: descParts.join(' - ').trim(),
    }
  })
  return books
}
