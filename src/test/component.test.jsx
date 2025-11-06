import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// 테스트용 간단한 컴포넌트
function Button({ onClick, children }) {
  return (
    <button onClick={onClick} type="button">
      {children}
    </button>
  )
}

function Greeting({ name }) {
  return <h1>안녕하세요, {name}님!</h1>
}

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>클릭하세요</Button>)
    expect(screen.getByRole('button', { name: '클릭하세요' })).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup()
    let clicked = false
    const handleClick = () => {
      clicked = true
    }

    render(<Button onClick={handleClick}>클릭</Button>)

    const button = screen.getByRole('button', { name: '클릭' })
    await user.click(button)

    expect(clicked).toBe(true)
  })
})

describe('Greeting Component', () => {
  it('should render greeting message with name', () => {
    render(<Greeting name="홍길동" />)
    expect(screen.getByText('안녕하세요, 홍길동님!')).toBeInTheDocument()
  })

  it('should render greeting with different name', () => {
    render(<Greeting name="테스터" />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('안녕하세요, 테스터님!')
  })
})
