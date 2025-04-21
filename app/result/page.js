'use client'

import { useEffect, useState } from 'react'
import styles from '../styles/Result.module.css'
import homeStyles from '../styles/Home.module.css'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ResultPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const cachedResult = localStorage.getItem('bookResult')
    if (cachedResult) {
      setBooks(JSON.parse(cachedResult))
      setLoading(false)
      return
    }

    const answers = JSON.parse(sessionStorage.getItem('quizAnswers'))

    const fetchRecommendations = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }),
        })

        const data = await res.json()

        if (!data.result || !data.result.includes('[')) {
          console.error('❌ Invalid result format:', data)
          setBooks([])
          setLoading(false)
          return
        }

        const jsonStart = data.result.indexOf('[')
        const jsonEnd = data.result.lastIndexOf(']')
        const jsonText = data.result.slice(jsonStart, jsonEnd + 1)

        const parsed = JSON.parse(jsonText)
        setBooks(parsed)
        localStorage.setItem('bookResult', JSON.stringify(parsed))  //  บันทึก cache
      } catch (e) {
        console.error('❌ Failed to parse AI response:', e)
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  const handleRetry = () => {
    localStorage.removeItem('bookResult')
    window.location.reload()
  }

  return (
    <div className={styles.container}>
      {/* 🔝 Navbar */}
      <nav className={homeStyles.navbar}>
        <div className={homeStyles.logo}>
          <a href="/">
            <Image src="/images/logo.png" alt="logo" width={45} height={45} />
          </a>
        </div>
        <div className={homeStyles.navRight}>
          <a href="/book">Book</a>
          <input type="text" placeholder="Search a Book" />
        </div>
      </nav>

      <h1 className={styles.title}>📚 Book Recommendations Just for You</h1>

      {loading ? (
        <>
          <p style={{ color: 'black' }}>Analyzing your answers with AI...</p>
          <Box sx={{ width: '25%', mt: 2 }}>
            <LinearProgress color="success" />
          </Box>
        </>
      ) : (
        <div className={styles.wrapperBox}>
          <div className={styles.grid}>
            {books.map((book, index) => (
              <div key={index} className={styles.card}>
                <img
                  src={book.image}
                  alt={book.title}
                  className={styles.bookImage}
                  onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://via.placeholder.com/300x400?text=No+Image'
                  }}
                />
                <h3>{book.title}</h3>
                <p>{book.description?.slice(0, 300)}...</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={handleRetry} className={styles.retryButton}>
              Search Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
