const app = require("./src/app");

app.listen(3000, '0.0.0.0', () => {
  console.log("running on port 3000.......................");
  console.log("--------------------------");
});

module.exports = app