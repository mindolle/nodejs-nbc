import express from 'express';
import connect from './scheams/index.js';
import products from './routes/products.router.js';

const app = express();
const PORT = 3000;

connect();

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정합니다.
app.use(express.json()); // 미들웨어1

app.use(express.urlencoded({ extended: true })); // 미들웨어2

app.use(express.static('./assets')); // 미들웨어3

// 미들웨어4
app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl, ' - ', new Date());
  next();
});

const router = express.Router();

router.get('/', (req, res) => {
  return res.json({ message: 'Hi!' });
});

// 미들웨어5
app.use('/api', [router, products]);

// 에러 처리 미들웨어를 등록한다.
// app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
