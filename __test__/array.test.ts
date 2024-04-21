import { VoidUtil } from '@polaris_liu/toolcat'
import { expect, test } from 'vitest'
import { reactive } from 'vue'

interface numberList {
  [key: string]: number
}

const buildArray = (
  valueStarts: number,
  valueEnds: number,
  key: string = 'id'
) => {
  let arr: numberList[] = []
  const build = (value: number): numberList[] => {
    if (value <= valueEnds) {
      const el = Object.defineProperty({}, key, {
        value: valueStarts,
        enumerable: true,
        writable: true
      })
      arr.push(el)
      return build((valueStarts += 1))
    } else return arr
  }
  return build(valueStarts)
}

test('创建数组', () => {
  expect(buildArray(1, 10).length === 10).toBe(true)
})

test('过滤数组', () => {
  const testFissure = buildArray(1, 4)
  const expected = [
    {
      id: 1
    },
    {
      id: 2
    },
    {
      id: 4
    }
  ]
  testFissure.splice(2, 1)
  expect(
    testFissure.every((item) =>
      VoidUtil.isNotVoid(expected.find((expect) => item.id === expect.id))
    )
  ).toBe(true)
})

test('过滤数组', () => {
  const arr = ['apple', 'banana', 'orange', 'grape']
  const arr2 = reactive({ arr: ['apple'] })
  const leftover = arr.filter((item) => !arr2.arr.includes(item))

  const expected = ['banana', 'orange', 'grape']

  expect(leftover.every((item) => expected.indexOf(item) !== -1)).toBe(true)
})

test('删除数组', () => {
  expect([1, 2, 3, 4].splice(4).length === 0).toBe(true)
})

test('过滤出不同元素', () => {
  const testFissure = buildArray(1, 20)
  const current = buildArray(1, 12)
  const expected = buildArray(13, 20)
  expected.push({ id: 3 })
  current.splice(2, 1)
  const newFissures = testFissure.filter((fissure) =>
    VoidUtil.isVoid(current.find((exist) => fissure.id === exist.id))
  )
  const matches = newFissures.every((item) =>
    expected.find((e) => e.id === item.id)
  )
  expect(matches).toBe(true)
})
