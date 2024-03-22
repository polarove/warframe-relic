let pathToTempfileOfCommitMessage = undefined
process.argv.forEach((val, index, array) => {
  console.log(index + ': ' + val)
  if (val === '--edit') {
    const pathToTempOfCommitMessage = val[index + 1]
  }
})
