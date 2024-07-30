// tự làm redux

// tạo store cần bỏ vào reducer (một loạt các xử lý của state, ví dụ như thay đổi hoặc xóa), và giá trị ban đầu, hàm này sẽ được gọi bên index.js
const createStore = (reducer, initialValues) => {
  // JSON.stringify là hàm chuyển 1 Object thành kiểu JSON
  localStorage.setItem("state", JSON.stringify(initialValues));
  let listeners = [];

  // hàm để thay đổi giá trị của state (set)
  const dispatch = (action) => {
    localStorage.setItem(
      "state",
      JSON.stringify(reducer(localStorage.getItem("state"), action))
    );
    // khi state thay đổi cần render view
    // function nào đó để kích hoạt render
    for (let i = 0; i < listeners.length; i++) {
      listeners[i]();
    }
  };

  // hàm lấy state (get)
  const getState = () => {
    // JSON.parse thì chuyển từ JSON thành kiểu Object
    return JSON.parse(localStorage.getItem("state"));
  };

  // set để thay rerender lại view (gọi từ App.js) truyền vào 1 state
  const subcribe = function (listener) {
    listeners.push(listener);
  };

  return {
    dispatch,
    getState,
    subcribe,
  };
};

export default createStore;
