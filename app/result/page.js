'use client'
import { useEffect, useState } from 'react'
import styles from '../styles/Result.module.css'

export default function ResultPage() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    // รับคำตอบจาก sessionStorage
    const answers = JSON.parse(sessionStorage.getItem('quizAnswers'))

    // ส่งคำตอบไปหา API ที่คุณเชื่อมกับ AI
    const fetchRecommendations = async () => {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      const data = await res.json()
      setBooks(data.books) // สมมุติว่า API ตอบกลับเป็น { books: [...] }
    }

    fetchRecommendations()
  }, [])

  return (
    <div className={styles.grid}>
  {Array.isArray(books) && books.length > 0 ? (
    books.map((book, idx) => (
      <div key={idx} className={styles.card}>
        <h2 className={styles.bookTitle}>
          {book.title} <span className={styles.author}>by {book.author}</span>
        </h2>
        <p className={styles.description}>{book.description}</p>
      </div>
    ))
  ) : (
    <p>Loading or no recommendations found.</p>
  )}
</div>
  )
}

const fetchRecommendations = async () => {
  const res = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  })
  const data = await res.json()
  console.log('API Response:', data)
  setBooks(data.books)
}
