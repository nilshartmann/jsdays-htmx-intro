const express = require("express");
const path = require("path");
const { sleep } = require("./util");
const app = express();

// You can change this port if 3000 is allocated on your computer
const port = 3000;

// ----------------------------------------------------------------------------------------
// Express "middlewares":
// ----------------------------------------------------------------------------------------
// all files in "public" can be accessed from the browser
//  using their file name (omit "src/public" in the path):
//   "/" -> /src/public/index.html
//   "/hello-world.html" -> /src/public/hello-world.html
app.use(express.static(path.join(__dirname, "public")));
// enable form processing
app.use(express.urlencoded({ extended: true }));
// enable parsing of json body
app.use(express.json());

app.get("/read-more", (req, res) => {
  if (!req.get("HX-Request")) {
    return res.status(404).send("Kein HTMX Request");
  }

  return res.send(
// language=HTML
`<div>
  <h1>Some more information</h1>
  <p>Tolle Informationen mit HTMX!</p>
  </div>
`

  )
})

app.post("/todos", async (req, res) => {
  await sleep(5000);
  res.send(
    // language=HTML
    `<li>${req.body.todo}</li>
    `
  )

})


// ----------------------------------------------------------------------------------------
// IMPLEMENT YOUR REQUEST HANDLER FUNCTIONS HERE
//  (after the middlewares and before starting the server with 'listen' below)
// ----------------------------------------------------------------------------------------

// HOW TO WRITE AN ENDPOINT WITH EXPRESS:
//  - write a function "app.HTTP_METHOD(...)" for each of your endpoint
//    (like "app.get" or "app.post")
//  - that function has two arguments:
//  1. Path of the endpoint ("/hello")
//  2. Request handler callback function
//    - the callback function also takes two parameters:
//      - req: the request object:
//        - using req.get you get the HTTP Headers of a request
//        - using req.query you get the search parameter of a request
//        - using req.body you get the body json (if any) for example in a post request
//     - res: the response object
//        - you use that to send the response back to your browser:
//          - res.status(200) sets the http status code for your response
//          - res.send("Hello World!") sets the payload of your response (text format)
//          - res.json({msg: "Hello World!"}) sets the payload as json (including correct http content-type header)
//
//   Express API documentation: https://expressjs.com/en/api.html

// Sample endpoint: http://localhost:3000/hello
//  - invoke as GET request with search param to get a text response:
//      http://localhost:3000/hello?message=world
//      - not that also a response header ("X-Message" is set)
//  - invoke without search param to get a 404 response:
//      http://localhost:3000/hello
//  - invoke with HTTP header to get back a JSON response:
//      curl -H "X-Message: World" http://localhost:3000/hello
//
app.get("/hello", (req, res) => {
  // access request http header
  if (req.get("X-Message")) {
    // send json response
    //   status code 200 and content-type is set automatically
    return res.json({ message: req.get("X-Message") });
  }

  // access a search parameter
  const message = req.query.message;
  if (!message) {
    // send plain text response with specific response status code (404)
    return res.status(404).send("No message search parameter!");
  }

  // set response header
  res.setHeader("X-Message", message);

  // text response, status code 200 is set automatically
  return res.send(`Hello, ${message}`);
});

// ----------------------------------------------------------------------------------------
// Start the server
// ----------------------------------------------------------------------------------------
//   ⚠️ this must be AFTER your endpoint handler functions
//      just leave it at the end of this file
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
