// Include express from node_modules
const express = require("express");
const app = express();
// Define server related variables
const port = 3000;

// setting the route and corresponding response
app.get("/", (req, res) => {
  let page = "首頁";
  res.render("page", { page: page });
});

app.get("/:page", (req, res) => {
  // create a variable to store page clicked
  page = req.params.page[0].toUpperCase() + req.params.page.substring(1);

  // paste the page requested into 'page' partial template
  res.render("page", { page: page });
});

// Start and listen the server
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
});

// require express-handlebars here
const exphbs = require("express-handlebars");

// setting template engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// setting static files
app.use(express.static("public"));
