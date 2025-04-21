'use client'
import { useState } from 'react'
import styles from '../styles/Quiz.module.css'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// คำถามพร้อมคำแปล
const questions = [
  { text: "I enjoy learning complex new ideas.", translation: "ฉันสนุกกับการเรียนรู้แนวคิดใหม่ ๆ ที่ซับซ้อน" },
  { text: "I often follow current events and world news.", translation: "ฉันมักจะติดตามข่าวสารบ้านเมืองอยู่เสมอ" },
  { text: "I’m fascinated by stories that explore the human mind and psychology.", translation: "ฉันชอบเรื่องราวเกี่ยวกับจิตวิทยาและความคิดของมนุษย์" },
  { text: "I love reading about futuristic or imaginary worlds.", translation: "ฉันหลงใหลในเรื่องราวที่เกิดขึ้นในโลกอนาคตหรือจินตนาการ" },
  { text: "Historical stories and past events interest me.", translation: "ฉันชอบอ่านเรื่องราวเกี่ยวกับประวัติศาสตร์หรือเหตุการณ์ในอดีต" },
  { text: "I’m interested in business and personal development topics.", translation: "ฉันสนใจในเรื่องของธุรกิจและการพัฒนาตนเอง" },
  { text: "I enjoy adventure, mystery, or action-packed stories.", translation: "ฉันชอบการผจญภัยที่เต็มไปด้วยแอ็กชันหรือความลึกลับ" },
  { text: "I like reading about philosophy and life’s big questions.", translation: "ฉันมักจะเลือกอ่านหนังสือที่เกี่ยวข้องกับปรัชญาหรือความหมายของชีวิต" },
  { text: "I enjoy romance or emotionally-driven narratives.", translation: "ฉันเพลิดเพลินกับการอ่านเรื่องความรักหรือดราม่าในชีวิตประจำวัน" },
  { text: "I like books that take me to new cultures or travel experiences.", translation: "ฉันชอบเรื่องราวที่เกี่ยวกับการเดินทางหรือวัฒนธรรมต่างถิ่น" },
  { text: "I prefer short books that are quick to finish.", translation: "ฉันชอบอ่านหนังสือเล่มบาง อ่านจบไว" },
  { text: "I enjoy deep and thought-provoking content.", translation: "ฉันชอบหนังสือที่มีเนื้อหาเข้มข้น และต้องใช้สมาธิในการอ่าน" },
  { text: "Books with visuals or illustrations appeal to me.", translation: "ฉันชอบหนังสือที่มีภาพประกอบหรือกราฟิก" },
  { text: "I can spend hours reading without feeling bored.", translation: "ฉันสามารถอ่านหนังสือได้วันละหลายชั่วโมงโดยไม่เบื่อ" },
  { text: "I usually read before bed or during my evening free time.", translation: "ฉันมักจะอ่านหนังสือก่อนนอนหรือในเวลาว่างตอนเย็น" },
  { text: "I read to gain new knowledge.", translation: "ฉันอ่านหนังสือเพื่อหาความรู้ใหม่ ๆ" },
  { text: "I read mainly for entertainment and relaxation.", translation: "ฉันอ่านเพื่อความบันเทิงและผ่อนคลาย" },
  { text: "I want to improve myself through reading.", translation: "ฉันอยากเปลี่ยนแปลงตัวเองและพัฒนาตนผ่านหนังสือ" },
  { text: "I look for inspiration or creative ideas in books.", translation: "ฉันอ่านเพื่อจุดประกายความคิดสร้างสรรค์หรือแรงบันดาลใจ" },
  { text: "I enjoy books that change how I see the world.", translation: "ฉันอยากได้หนังสือที่ทำให้ฉันมองโลกในมุมใหม่" },
]

const questionsPerPage = 5
const totalPages = Math.ceil(questions.length / questionsPerPage)

export default function QuizPage() {
  const [answers, setAnswers] = useState({})
  const [page, setPage] = useState(0)
  const router = useRouter()

  const handleSelect = (questionIndex, value) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: value }))
  }

  const handlePrevious = () => {
    if (page > 0) setPage(page - 1)
  }

  const handleNext = () => {
    if (!isPageAnswered()) {
      alert('Please answer all questions before continuing.')
      return
    }
    setPage(prev => prev + 1)
  }

  const handleSubmit = () => {
    if (!isPageAnswered()) {
      alert('Please answer all questions before submitting.')
      return
    }
    sessionStorage.setItem('quizAnswers', JSON.stringify(answers))
    router.push('/result')
  }

  const isPageAnswered = () => {
    const start = page * questionsPerPage
    return Array.from({ length: questionsPerPage }, (_, i) => start + i).every(
      index => answers[index] !== undefined
    )
  }

  const renderQuestions = () => {
    const start = page * questionsPerPage
    return questions.slice(start, start + questionsPerPage).map((q, i) => {
      const qIndex = start + i
      return (
        <div key={qIndex} className={styles.questionBlock}>
          <p className={styles.question} data-tooltip={q.translation}>
            {q.text}
          </p>
          <div className={styles.options}>
            {[1, 2, 3, 4, 5].map(value => (
              <label key={value} className={styles.option}>
                <input
                  type="radio"
                  name={`question-${qIndex}`}
                  value={value}
                  checked={answers[qIndex] === value}
                  onChange={() => handleSelect(qIndex, value)}
                />
                <span className={`${styles.circle} ${value <= 3 ? styles.green : styles.purple}`}></span>
              </label>
            ))}
          </div>
          <div className={styles.scaleLabels}>
            <span>Agree</span>
            <span>Disagree</span>
          </div>
        </div>
      )
    })
  }

  return (
    <div className={styles.container}>
      {/* Top Navbar */}
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
          <button className={styles.closeBtn}>✕</button>
        </div>
      </nav>

      {/* Quiz Box */}
      <div className={styles.quizWrapper}>
        <div className={styles.quizBox}>
          {renderQuestions()}
          <div className={styles.buttonGroup}>
  {/* เงื่อนไข: หน้าแรก แสดงเฉพาะ Next ด้านขวา */}
  {page === 0 && (
    <div style={{ marginLeft: 'auto' }}>
      <button className={styles.submitButton} onClick={handleNext}>
        Next
      </button>
    </div>
  )}

  {/* เงื่อนไข: หน้ากลางๆ แสดงทั้ง Previous ซ้าย + Next ขวา */}
  {page > 0 && page < totalPages - 1 && (
    <>
      <button className={styles.submitButton} onClick={handlePrevious}>
        Previous
      </button>
      <button className={styles.submitButton} onClick={handleNext}>
        Next
      </button>
    </>
  )}

  {/* เงื่อนไข: หน้าสุดท้าย แสดง Previous ซ้าย + Submit ขวา */}
  {page === totalPages - 1 && (
    <>
      <button className={styles.submitButton} onClick={handlePrevious}>
        Previous
      </button>
      <button className={styles.submitButton} onClick={handleSubmit}>
        Submit
      </button>
    </>
  )}
</div>
        </div>
      </div>
    </div>
  )
}
