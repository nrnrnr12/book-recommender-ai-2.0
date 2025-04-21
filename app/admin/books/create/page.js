'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../../../styles/Result.module.css'

export default function CreateBookPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ title: '', description: '', image_url: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      router.push('/admin/books')
    } else {
      alert('เกิดข้อผิดพลาดในการเพิ่มหนังสือ')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapperBox + ' mt-6'}>
        <h1 className={styles.title}>➕ Add New Book</h1>
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
            <button type="submit" className={styles.btnAdd}>Save</button>
            <button type="button" onClick={() => router.push('/admin/books')} className={styles.btnDelete}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
