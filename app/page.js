'use client'
import styles from './styles/Home.module.css'
import { useRouter } from 'next/navigation'
import Image from 'next/image'


export default function HomePage() {
  const router = useRouter()

  const handleStartQuiz = () => {
    router.push('/quiz')
  }

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
      <div className={styles.logo}>
  <a href="/">
    <Image src="/images/logo.png" alt="logo" width={45} height={45} />
  </a>
</div>
        <div className={styles.navRight}>
          <a href="#">Book</a>
          <a href="#">Category</a>
          <input type="text" placeholder="Search a Book" />
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        <h1 className={styles.title}>BOOK RECOMMEND</h1>
        <div className={styles.description}>
          เว็บไซต์นี้จะช่วยแนะนำหนังสือที่เหมาะกับคุณ โดยอิงจากความสนใจและบุคลิกของคุณ
          ผ่านแบบทดสอบสั้น ๆ พร้อมลิงก์ร้านหนังสือให้คุณเลือกซื้อได้ทันที
        </div>
        <button className={styles.btn} onClick={handleStartQuiz}>
          TAKE THE TEST
        </button>
      </main>
    </div>
  )
}
