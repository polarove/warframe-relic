import { expect, test } from 'vitest'
import { reactive } from 'vue'

test('删除数组', () => {
  const testFissure = [
    {
      id: '1'
    },
    {
      id: '2'
    },
    {
      id: '3'
    },
    {
      id: '4'
    }
  ]
  const expected = [
    {
      id: '1'
    },
    {
      id: '2'
    },
    {
      id: '4'
    }
  ]
  expect(
    testFissure
      .splice(2, 1)
      .every((item) => expected.find((expect) => item.id === expect.id))
  ).toBe(true)
})

test('过滤数组', () => {
  const arr = ['apple', 'banana', 'orange', 'grape']
  const arr2 = reactive({ arr: ['apple'] })
  const leftover = arr.filter((item) => !arr2.arr.includes(item))

  const expected = ['banana', 'orange', 'grape']

  expect(leftover.every((item) => expected.indexOf(item) !== -1)).toBe(true)
})
