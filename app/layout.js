import './globals.css'
import { Tinos } from 'next/font/google'

const tinos = Tinos({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-tinos',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={tinos.variable}>
      <body>{children}</body>
    </html>
  )
}