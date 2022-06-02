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

app.get("/:page", (req, res) => {
  // create a variable to store page clicked
  const pageClicked = req.params.page;

  // paste the page requested into 'page' partial template
  res.render("page", { page: pageClicked });
});

// Start and listen the server
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
});
