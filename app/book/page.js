'use client'

import { useEffect, useState } from 'react'
import styles from '../styles/Result.module.css'
import homeStyles from '../styles/Home.module.css'
import Image from 'next/image'

export default function BookPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/books')
        const data = await res.json()
        setBooks(data)
      } catch (err) {
        console.error('❌ Failed to load books:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

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

      <h1 className={styles.title}>📚 All Books in Our Database</h1>

      {loading ? (
        <p style={{ color: 'black' }}>Loading books from database...</p>
      ) : (
        <div className={styles.wrapperBox}>
          <div className={styles.grid}>
            {books.map((book, index) => (
              <div key={index} className={styles.card}>
                <img
                  src={book.image_url}
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
        </div>
      )}
    </div>
  )
}
