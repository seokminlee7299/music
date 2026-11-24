const express = require('express');
const path = require('path');

const indexRouter = require('./routes/index');
const tracksRouter = require('./routes/tracks');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/tracks', tracksRouter);

app.use((req, res) => {
  res.status(404).send('페이지를 찾을 수 없습니다.');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('서버 오류가 발생했습니다.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
