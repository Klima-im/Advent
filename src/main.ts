import express from "express";

const app = express();
app.set("view engine", "ejs");

app.get("/", (request, response) => {
	response.render("index");
});
app.get("/tag/:number", (request, response) => {
	response.render(`tag_${request.params.number}`);
});
app.use(express.static("static"));

const port = process.env.PORT || 2412;
app.listen(port, () => {
	console.log("Now listening on %s", port);
});
