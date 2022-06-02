// Include express from node_modules
const express = require("express");
const app = express();
// Define server related variables
const port = 3000

// setting the route and corresponding response
app.get('/', (req, res) => {
  res.send(`This is my first Express Web App`)
})

// Start and listen the server
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})