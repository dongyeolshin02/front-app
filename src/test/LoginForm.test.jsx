import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router'
import LoginForm from '../pages/login/LoginForm'
import * as useLoginHook from '../hooks/useLogin'



describe('LoginForm Component', () => {
  let mockMutateAsync

  beforeEach(() => {
    // useLogin 훅 모킹
    mockMutateAsync = vi.fn()
    vi.spyOn(useLoginHook, 'useLogin').mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      isSuccess: false,
    })
  })

  it('should render login form with all fields', () => {
    render(<LoginForm />)

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByLabelText('아이디')).toBeInTheDocument()
    expect(screen.getByLabelText('패스워드')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument()
  })

  it('should show validation error when username is empty', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: '로그인' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('아이디를 입력하십시오')).toBeInTheDocument()
    })
  })

  it('should show validation error when password is empty', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const usernameInput = screen.getByLabelText('아이디')
    await user.type(usernameInput, 'testuser')

    const submitButton = screen.getByRole('button', { name: '로그인' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('패스워드를 입력하십시오')).toBeInTheDocument()
    })
  })

  it('should call login mutation with correct data when form is submitted', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValueOnce({ success: true })

    render(<LoginForm />)

    const usernameInput = screen.getByLabelText('아이디')
    const passwordInput = screen.getByLabelText('패스워드')

    await user.type(usernameInput, 'testuser')
    await user.type(passwordInput, 'password123')

    const submitButton = screen.getByRole('button', { name: '로그인' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      })
    })
  })

  it('should show alert when login fails with 401 error', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    mockMutateAsync.mockRejectedValueOnce({ status: 401 })

    render(<LoginForm />)

    const usernameInput = screen.getByLabelText('아이디')
    const passwordInput = screen.getByLabelText('패스워드')

    await user.type(usernameInput, 'wronguser')
    await user.type(passwordInput, 'wrongpassword')

    const submitButton = screen.getByRole('button', { name: '로그인' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('아이디 또는 패스워드가 일치하지 않습니다.')
    })

    alertSpy.mockRestore()
  })

  it('should show alert when login fails with 400 error', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    mockMutateAsync.mockRejectedValueOnce({ status: 400 })

    render(<LoginForm />)

    const usernameInput = screen.getByLabelText('아이디')
    const passwordInput = screen.getByLabelText('패스워드')

    await user.type(usernameInput, 'testuser')
    await user.type(passwordInput, 'test123')

    const submitButton = screen.getByRole('button', { name: '로그인' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('입력한 정보가 잘못되었습니다.')
    })

    alertSpy.mockRestore()
  })

  it('should show generic error alert for other errors', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    mockMutateAsync.mockRejectedValueOnce({ status: 500 })

    render(<LoginForm />)

    const usernameInput = screen.getByLabelText('아이디')
    const passwordInput = screen.getByLabelText('패스워드')

    await user.type(usernameInput, 'testuser')
    await user.type(passwordInput, 'test123')

    const submitButton = screen.getByRole('button', { name: '로그인' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('처리 중 오류가 발생했습니다. 다시시도 해주세요.')
    })

    alertSpy.mockRestore()
  })

  it('should accept user input in username field', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const usernameInput = screen.getByLabelText('아이디')
    await user.type(usernameInput, 'myusername')

    expect(usernameInput).toHaveValue('myusername')
  })

  it('should accept user input in password field', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const passwordInput = screen.getByLabelText('패스워드')
    await user.type(passwordInput, 'mypassword')

    expect(passwordInput).toHaveValue('mypassword')
  })
})
