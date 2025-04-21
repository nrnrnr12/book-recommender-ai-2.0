'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import styles from '../../../../styles/Result.module.css'

export default function EditBookPage() {
  const router = useRouter()
  const params = useParams()
  const bookId = params?.id
  const [formData, setFormData] = useState({ title: '', description: '', image_url: '' })

  useEffect(() => {
    if (bookId) {
      fetch(`/api/books/${bookId}`)
        .then(res => res.json())
        .then(data => setFormData(data))
        .catch(err => alert('ไม่สามารถโหลดข้อมูลหนังสือได้'))
    }
  }, [bookId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/books/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    if (res.ok) {
      router.push('/admin/books')
    } else {
      alert('เกิดข้อผิดพลาดในการบันทึก')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapperBox + ' mt-6'}>
        <h1 className={styles.title}>✏️ Edit Book</h1>
        <form onSubmit={handleSubmit} className={styles.formVertical}>
          <label className={styles.inputLabel}>Book Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={styles.inputField}
            required
          />

          <label className={styles.inputLabel}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={styles.inputField}
            rows={4}
            required
          />

          <label className={styles.inputLabel}>Image URL</label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className={styles.inputField}
            required
          />

          <div className={styles.btnGroup}>
            <button type="submit" className={styles.btnEdit}>Update</button>
            <button type="button" onClick={() => router.push('/admin/books')} className={styles.btnDelete}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
