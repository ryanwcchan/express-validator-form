const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const path = require('path')
const usersRouter = require("./routes/usersRouter");

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use("/", usersRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
