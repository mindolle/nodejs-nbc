import express from 'express';
// import joi from 'joi';
import Product from '../scheams/products.schema.js';

const router = express.Router();

// 상품 작성 (POST)
router.post('/products', async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }

    const { title, content, author, password } = req.body;

    const newProduct = new Product({
      title,
      content,
      author,
      password,
    });
    await newProduct.save();
    res.status(201).json({ message: '판매 상품을 등록하였습니다.' });
  } catch (error) {
    res.status(500).json({ message: '얘기치 못한 에러가 발생하였습니다.' });
  }
});

// 상품 목록 조회 (GET)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find()
      .select('_id title author status createdAt')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: '얘기치 못한 에러가 발생하였습니다.' });
  }
});

// 상품 상세 조회 (GET)
router.get('/products/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).select(
      '_id title content author status createdAt'
    );

    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: '얘기치 못한 에러가 발생하였습니다.' });
  }
});

// 상품 수정 (PUT)
router.put('/products/:productId', async (req, res) => {
  try {
    if (!req.body || !req.params) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }

    const { title, content, password, status } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }

    if (password !== product.password) {
      return res
        .status(401)
        .json({ message: '상품을 수정할 권한이 존재하지 않습니다.' });
    }

    product.title = title;
    product.content = content;
    product.status = status;

    await product.save();
    res.json({ message: ' 상품 정보를 수정하였습니다.' });
  } catch (error) {
    res.status(500).json({ message: '얘기치 못한 에러가 발생하였습니다.' });
  }
});

// 상품 삭제 (DELETE)
router.delete('/products/:productId', async (req, res) => {
  try {
    if (!req.body || !req.params) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }

    const productId = req.params.productId;
    const { title, content, password, status } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }

    if (password !== product.password) {
      return res
        .status(401)
        .json({ message: '상품을 수정할 권한이 존재하지 않습니다.' });
    }

    await product.deleteOne({ id: productId });
    res.json({ message: '상품을 삭제하였습니다.' });
  } catch (error) {
    res.status(500).json({ message: '얘기치 못한 에러가 발생하였습니다.' });
  }
});

export default router;

// ------------------------------------------------------------------------------

// // 1. `value` 데이터는 **필수적으로 존재**해야한다.
// // 2. `value` 데이터는 **문자열 타입**이어야한다.
// // 3. `value` 데이터는 **최소 1글자 이상**이어야한다.
// // 4. `value` 데이터는 **최대 50글자 이하**여야한다.
// // 5. 유효성 검사에 실패했을 때, 에러가 발생해야한다.
// const createdTodoschema = joi.object({
//   value: joi.string().min(1).max(50).required(),
// });

// /** 할일 등록 API **/
// router.post('/todos', async (req, res, next) => {
//   try {
//     // 1. 클라이언트로 부터 받아온 value 데이터를 가져온다.

//     const validation = await createdTodoschema.validateAsync(req.body);

//     const { value } = validation;

//     // 1-5. 만약, 클라이언트가 value 데이터를 전달하지 않았을 때, 클라이언트에게 에러 메세지를 전달한다.
//     if (!value) {
//       return res
//         .status(400)
//         .json({ errorMessage: '해야할 일(value) 데이터가 존재하지 않습니다.' });
//     }
//     // 2. 해당하는 마지막 order 데이터를 조회한다.
//     // findOne = 1개의 데이터만 조회한다.
//     // sort = 정렬한다. -> 어떤 컬럼을?
//     const todoMaxOrder = await Todo.findOne().sort('-order').exec();

//     // 3. 만약 존재한다면 현재 해야 할 일을 +1 하고, order 데이터가 존재하지 않다면, 1로 부여한다.
//     const order = todoMaxOrder ? todoMaxOrder.order + 1 : 1;

//     // 4. 해야할 일 등록
//     const todo = new Todo({ value, order });
//     await todo.save();

//     // 5. 해야할 일을 클라이언트에게 반환한다.
//     return res.status(201).json({ todo: todo });
//   } catch (error) {
//     // Router 다음에 있는 에러 처리 미들웨어를 실행한다.
//     next(error);
//   }
// });

// /** 해야할 일 목록 조회 API **/
// router.get('/todos', async (req, res, next) => {
//   // 1. 해야할 일 목록 조회를 진행한다.
//   const todos = await Todo.find().sort('-order').exec();

//   // 2. 해야할 일 목록 조회를 클라이언트에게 반환한다.
//   return res.status(200).json({ todos });
// });

// /** 해야할 일 순서 변경, 완료 / 해제, 내용 변경 API **/
// router.patch('/todos/:todoId', async (req, res, next) => {
//   const { todoId } = req.params;
//   const { order, done, value } = req.body;

//   // 현재 나의 order가 무엇인지 알아야한다.
//   const currentTodo = await Todo.findById(todoId).exec();
//   if (!currentTodo) {
//     return res
//       .status(404)
//       .json({ errorMessage: '존재하지 않는 해야할 일 입니다.' });
//   }

//   if (order) {
//     const targetTodo = await Todo.findOne({ order }).exec();
//     if (targetTodo) {
//       targetTodo.order = currentTodo.order;
//       await targetTodo.save();
//     }

//     currentTodo.order = order;
//   }
//   if (done !== undefined) {
//     currentTodo.doneAt = done ? new Date() : null;
//   }
//   if (value) {
//     currentTodo.value = value;
//   }

//   await currentTodo.save();

//   return res.status(200).json({});
// });

// /** 할 일 삭제 API **/
// router.delete('/todos/:todoId', async (req, res, next) => {
//   const { todoId } = req.params;

//   const todo = await Todo.findById(todoId).exec();
//   if (!todo) {
//     return res
//       .status(404)
//       .json({ errorMessage: '존재하지 않는 해야할 일 정보 입니다.' });
//   }

//   await Todo.deleteOne({ _id: todoId });

//   return res.status(200).json({});
// });

// export default router;
