import axios from 'axios';

export const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    withCredentials: true
    // withCredentials: false
  });

instance.defaults.headers.post['Content-Type'] = 'application/json';

// instance.interceptors.response.use(
//     (res) => res,
//     (err) => {
//       const { status } = err.response;
//       if (status === 401) {
//         alert('Unauthorized access');
//         // window.location.replace('/login');
//       } else {
//         throw err;
//       }
//     }
//   );
  