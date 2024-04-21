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
