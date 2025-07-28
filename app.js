const express = require('express')
const app = express();
const path = require("path")
const fs = require("fs")
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));



app.get("/", function (req, res) {
  fs.readdir(`./hisab`, function (err, files) {
    if (err) return res.status(500).send(err);
    res.render("index", { files: files });

  })

})



app.get("/create", function (req, res) {
  res.render("create")

})
app.post("/createhisab", function (req, res) {
  var currentDate = new Date();
  const date1 = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;


  const { date, title, content } = req.body;

  fs.writeFile(`./hisab/${date}.txt`, `Date:${date}\nTitle:${title}\nContent:${content}`, function (err) {
    if (err) return res.status(500).send("Error saving file");
    res.redirect("/");
  });


})


app.get("/edit/:filename", function (req, res) {
  fs.readFile(`./hisab/${req.params.filename}`, "utf-8", function (err, filedata) {
    if (err) return res.status(500).send(err);
    const lines = filedata.split('\n');

    const dateMatch = filedata.match(/^Date:\s*(.*)$/m);
    const titleMatch = filedata.match(/^Title:\s*(.*)$/m);
    const contentStart = filedata.indexOf("Content:");

    let content = "";
    if (contentStart !== -1) {
      content = filedata
        .slice(contentStart + "Content:".length)
        .trimStart();
    }

    const date = dateMatch ? dateMatch[1].trim() : "";
    const title = titleMatch ? titleMatch[1].trim() : "";

    res.render("edit", {
      filename: req.params.filename,
      date,
      title,
      content,

    });

  });

});  

  
  
app.post("/update/:filename", function (req, res) {
    const { date, title, content } = req.body;

    const updatedData = `Date:${date}\nTitle:${title}\nContent:\n${content}`;

    fs.writeFile(`./hisab/${req.params.filename}`, updatedData, function (err) {
      if (err) return res.status(500).send(err);
      res.redirect("/")
    })
});

app.get("/hisab/:filename", function (req, res) {
  fs.readFile(`./hisab/${req.params.filename}`, "utf-8", function (err, filedata) {
    if (err) return res.status(500).send(err);
    const lines = filedata.split('\n');

    const dateMatch = filedata.match(/^Date:\s*(.*)$/m);
    const titleMatch = filedata.match(/^Title:\s*(.*)$/m);
    const contentStart = filedata.indexOf("Content:");

    let content = "";
    if (contentStart !== -1) {
      content = filedata
        .slice(contentStart + "Content:".length)
        .trimStart();
    }

    const date = dateMatch ? dateMatch[1].trim() : "";
    const title = titleMatch ? titleMatch[1].trim() : "";

    res.render("hisab", {
      filename: req.params.filename,
      date,
      title,
      content,

    });

  });

});  
app.get("/delete/:filename", function (req, res) {
  const filePath = path.join(__dirname, "hisab", req.params.filename);

  fs.unlink(filePath, function (err) {
    if (err) return res.status(500).send("Error deleting file");
    res.redirect("/");
  });
});





 app.listen(3000);
