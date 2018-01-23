
const isName = false

return (isName ? 
new Promise((resolve, reject) => {
  resolve({ name: 'test1'})
}) : new Promise((resolve, reject) => {
  resolve({ name: 'test2'})
}))
.then( ret => {
  console.log(ret)
})