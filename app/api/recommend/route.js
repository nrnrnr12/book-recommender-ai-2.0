import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { answers } = await req.json()
    const prompt = generatePrompt(answers)

    const res = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt,
        max_tokens: 700,
        temperature: 0.7,
      }),
    })

    const data = await res.json()
    const rawText = data.generations?.[0]?.text || ''

    const jsonStart = rawText.indexOf('[')
    const jsonEnd = rawText.lastIndexOf(']')
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('❌ Invalid result:', rawText)
      return NextResponse.json({ error: 'AI ตอบกลับไม่ถูกต้อง' }, { status: 500 })
    }

    const jsonText = rawText.slice(jsonStart, jsonEnd + 1).replace(/\r?\n|\r/g, '')
    let parsed = []

    try {
      parsed = JSON.parse(jsonText)
    } catch (err) {
      console.error('❌ Failed to parse JSON:', err)
      return NextResponse.json({ error: 'AI ตอบกลับผิดรูปแบบ JSON' }, { status: 500 })
    }

    parsed = parsed.slice(0, 3)

    for (let book of parsed) {
      const query = encodeURIComponent(book.title + ' book')  // เพิ่มคำค้นให้แม่นยำขึ้น
      const gRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${query}&orderBy=relevance&printType=books&maxResults=5`)
      const gData = await gRes.json()

      const matched = gData.items?.find(item =>
        item.volumeInfo?.title?.toLowerCase().includes(book.title.toLowerCase())
      )

      const imageLinks = matched?.volumeInfo?.imageLinks || {}
      const rawImage =
        imageLinks.extraLarge ||
        imageLinks.large ||
        imageLinks.medium ||
        imageLinks.thumbnail ||
        ''

      book.image = rawImage.startsWith('http://')
        ? rawImage.replace('http://', 'https://')
        : rawImage || 'https://via.placeholder.com/300x400?text=No+Image'


      if (matched?.volumeInfo?.description && book.description.length < 40) {
        book.description = matched.volumeInfo.description.slice(0, 300) + '...'
      }
    }

    return NextResponse.json({ result: JSON.stringify(parsed) })

  } catch (err) {
    console.error('🔥 Server error:', err)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดฝั่งเซิร์ฟเวอร์' }, { status: 500 })
  }
}

function generatePrompt(answers) {
  return `
ผู้ใช้ตอบแบบสอบถามว่า:
${Object.values(answers).join(', ')}

กรุณาแนะนำหนังสือที่เหมาะกับบุคลิกนี้ จำนวน 3 เล่ม พร้อมคำอธิบายแต่ละเล่มยาวประมาณ 2-3 บรรทัด

❗ กรุณาส่งกลับในรูปแบบ JSON array **เท่านั้น** ไม่มีคำอธิบายอื่นนอก array

[
  {
    "title": "Book name",
    "description": "2-3 line of Description",
    "image": "https://example.com/book.jpg"
  }
]
  `
}
