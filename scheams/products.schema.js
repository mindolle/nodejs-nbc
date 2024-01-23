import mongoose from 'mongoose';

// {
//   "data": {
//     "_id": "652b619597690183899d2f74",
//     "title": "아이폰15 MAX",
//     "content": "얼마 사용하지 않은 제품 팝니다.",
//     "author": "판매자",
//     "status": "FOR_SALE",
//     "createdAt": "2023-10-15T03:50:45.866Z"
//   }
// }

const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // title 필드는 필수 요소입니다.
    },
    content: {
      type: String,
      required: true, // content 필드 또한 필수 요소입니다.
    },
    author: {
      type: String,
      required: true, // author 필드 또한 필수 요소입니다.
    },
    password: {
      type: String,
      required: true, // password 필드는 필수 요소입니다.
    },
    status: {
      type: String,
      enum: ['FOR_SALE', 'SOLD_OUT'],
      default: 'FOR_SALE',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Product', Schema);

// const Product = mongoose.model('Product', schema);
// module.exports = Product;

// // 프론트엔드 서빙을 위한 코드입니다. 모르셔도 괜찮아요!
// TodoSchema.virtual('todoId').get(function () {
//   return this._id.toHexString();
// });
// TodoSchema.set('toJSON', {
//   virtuals: true,
// });

// // TodoSchema를 바탕으로 Todo모델을 생성하여, 외부로 내보냅니다.
// export default mongoose.model('Todo', TodoSchema);
