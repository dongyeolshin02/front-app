import { describe, it, expect } from 'vitest'

// 간단한 유틸리티 함수 예시
function sum(a, b) {
  return a + b
}

function multiply(a, b) {
  return a * b
}

describe('Math utilities', () => {
  it('should add two numbers correctly', () => {
    expect(sum(2, 3)).toBe(5)
    expect(sum(-1, 1)).toBe(0)
    expect(sum(0, 0)).toBe(0)
  })

  it('should multiply two numbers correctly', () => {
    expect(multiply(2, 3)).toBe(6)
    expect(multiply(-1, 5)).toBe(-5)
    expect(multiply(0, 10)).toBe(0)
  })
})
