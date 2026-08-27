import { ReactNode } from "react"

interface SectionTitleProps {
  children: ReactNode
}

const SectionTitle = ({ children }: SectionTitleProps) => {
  return (
    <h2 className='font-bold text-2xl text-primary-900'>{children}</h2>
  )
}

export default SectionTitle