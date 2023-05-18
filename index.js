const express = require('express')
const app = express()
const port = process.env.PORT||5000 
const cors=require('cors')


//Middlewair 
app.use(cors()) 
app.use(express.json())

app.get('/', (req, res) => {
  res.send('ROBO TOY SERVER RUNNING......')
})

app.listen(port, () => {
  console.log(`ROBO TOY SERVER on port ${port}`)
})