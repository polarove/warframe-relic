// state++ 和 state+=1 不是同一种东西，前者是啥不知道，而后者则是javascript表达式的一种，它会被执行

const f = (state: number = 1) => {
  setTimeout(() => {
    console.log(state)
    f(state++)
  }, 1000)
}

const fd = (state: number = 1) => {
  setTimeout(() => {
    console.log(state)
    f((state += 1))
  }, 1000)
}

// promise
const testPromise = () => {
  const test = () => {
    return Promise.resolve(1)
  }

  const test1 = () => {
    console.log('test1 succeed')
    return Promise.resolve(true)
  }
  const test2 = () => {
    console.log('test2 failed')
    return Promise.reject(false)
  }
  const test3 = () => {
    console.log('test3 will be skipped')
    return Promise.resolve(true)
  }

  test()
    .then(() => test1())
    .then(() => test2())
    .then(() => test3())
    .catch(() =>
      console.log('this promise should be failed, and test3 should be skipped')
    )
}
testPromise()
