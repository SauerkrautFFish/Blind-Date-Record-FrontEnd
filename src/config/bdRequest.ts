import axios from 'axios';

export const bdRequest = axios.create({
  baseURL: 'http://localhost:8080', // 替换为你的API基础URL
  timeout: 10000, // 请求超时时间，单位：毫秒

});

//
// // 使用GET方法发送请求
// bdRequest.get('/endpoint')
//   .then((response) => {
//     // 处理成功响应
//     console.log(response);
//   })
//   .catch((error) => {
//     // 处理错误响应
//     console.error(error);
//   });
//
// // 使用POST方法发送请求
// const postData = {
//   // 请求体数据
// };
// bdRequest.post('/endpoint', postData)
//   .then((response) => {
//     // 处理成功响应
//     console.log(response);
//   })
//   .catch((error) => {
//     // 处理错误响应
//     console.error(error);
//   });