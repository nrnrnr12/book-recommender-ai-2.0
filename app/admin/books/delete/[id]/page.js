'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import styles from '../../../..Result.module.css'

export default function DeleteBookPage() {
  const router = useRouter()
  const params = useParams()
  const bookId = params?.id
  const [book, setBook] = useState(null)

  useEffect(() => {
    if (bookId) {
      fetch(`/api/books/${bookId}`)
        .then(res => res.json())
        .then(data => setBook(data))
        .catch(() => alert('ไม่สามารถโหลดข้อมูลหนังสือได้'))
    }
  }, [bookId])

  const handleDelete = async () => {
    const res = await fetch(`/api/books/${bookId}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      alert('ลบหนังสือเรียบร้อยแล้ว')
      router.push('/admin/books')
    } else {
      alert('ลบไม่สำเร็จ')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapperBox + ' mt-6'}>
        <h1 className={styles.title}>❌ Delete Book</h1>
        {book ? (
          <>
            <p>คุณแน่ใจหรือไม่ว่าต้องการลบหนังสือ:</p>
            <h3 style={{ fontWeight: 'bold', margin: '12px 0' }}>{book.title}</h3>
            <div className={styles.btnGroup}>
              <button onClick={handleDelete} className={styles.btnDelete}>Confirm Delete</button>
              <button onClick={() => router.push('/admin/books')} className={styles.btnEdit}>Cancel</button>
            </div>
          </>
        ) : (
          <p>กำลังโหลดข้อมูล...</p>
        )}
      </div>
    </div>
  )
}
