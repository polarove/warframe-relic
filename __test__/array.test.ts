import { expect, test } from 'vitest'
import { reactive } from 'vue'

test('删除数组', () => {
  const arr = ['apple', 'banana', 'orange', 'grape']
  arr.splice(2, 1)
  console.log(arr)
})

test('过滤数组', () => {
  const arr = ['apple', 'banana', 'orange', 'grape']
  const arr2 = reactive({ arr: ['apple'] })
  console.log(arr.filter((item) => !arr2.arr.includes(item)))
})

test('函数状态', () => {
  const f = (state: number = 1) => {
    setTimeout(() => {
      console.log(state)
      f(state++)
    }, 1000)
  }
})
