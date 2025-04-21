'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../../styles/Result.module.css'
import homeStyles from '../../styles/Home.module.css'
import Image from 'next/image'

export default function AdminBooksPage() {
  const router = useRouter()
  const [books, setBooks] = useState([])

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    const res = await fetch('/api/books')
    const data = await res.json()
    setBooks(data)
  }

  const handleDelete = async (id) => {
    const confirmDelete = confirm('คุณแน่ใจว่าต้องการลบหนังสือนี้?')
    if (!confirmDelete) return

    const res = await fetch(`/api/books/${id}`, { method: 'DELETE' })
    if (res.ok) fetchBooks()
  }

  return (
    <div className={styles.container}>
      <nav className={homeStyles.navbar}>
        <div className={homeStyles.logo}>
          <a href="/">
            <Image src="/images/logo.png" alt="logo" width={45} height={45} />
          </a>
        </div>
        <div className={homeStyles.navRight}>
          <a href="/book">Book</a>
          <a href="/admin/books" style={{ fontWeight: 'bold' }}>Admin</a>
        </div>
      </nav>

      <div className={styles.wrapperBox + ' mt-6'}>
        <div className={styles.adminHeader}>
          <h1 className={styles.title}>📚 Admin - Book Manager</h1>
          <button
            className={styles.btnAdd}
            onClick={() => router.push('/admin/books/create')}
          >
            + Add Book
          </button>
        </div>

        <div className={styles.grid}>
          {books.map(book => (
            <div key={book.id} className={styles.card}>
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
              <p>{book.description.slice(0, 200)}...</p>
              <div className={styles.btnGroup}>
                <button
                  onClick={() => router.push(`/admin/books/edit/${book.id}`)}
                  className={styles.btnEdit}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className={styles.btnDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}