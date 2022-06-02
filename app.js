// Include express from node_modules
const express = require("express");
const app = express();
// Define server related variables
const port = 3000;

// require express-handlebars here
const exphbs = require("express-handlebars");

// setting template engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// setting static files
app.use(express.static("public"));

// setting the route and corresponding response
app.get("/", (req, res) => {
  res.render("page");
});

// Start and listen the server
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
});
