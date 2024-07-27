import { message } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Hàm để chuyển đổi mã màu HEX sang RGB
const hexToRgb = (hex) => {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return [r, g, b];
};

// Hàm để chuyển đổi RGB sang mã màu HEX
const rgbToHex = (r, g, b) => {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
};

// Hàm để điều chỉnh độ sáng của màu (màu, độ thay đổi)
const adjustColor = (color, amount) => {
  const [r, g, b] = hexToRgb(color);
  const newR = Math.min(255, Math.max(0, r + amount)); // đảm bảo rằng giá trị từ 0-255
  const newG = Math.min(255, Math.max(0, g + amount));
  const newB = Math.min(255, Math.max(0, b + amount));
  return rgbToHex(newR, newG, newB);
};

function ColorTest() {
  const [row, setRow] = useState(2); // set số lượng hàng ban đầu
  const [col, setCol] = useState(2); // set số lượng cột ban đầu
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [highlightColor, setHighlightColor] = useState("#FFFFFF");
  const [diffColor, setDiffColor] = useState(100);
  const navigate = useNavigate();

  // lấy số ngẫu nhiên trong khoảng từ 0 - length-1
  const getRandomIndex = (length) => {
    return Math.floor(Math.random() * length); // Math.random() sẽ trả ra từ [0, 1) theo số thực, sau đó nhân với length được truyền vào rồi làm tròn xuống bằng hàm Math.floor(), vì thế sẽ có thể lấy được ngẫu nhiên 1 index trong mảng.
  };
  
  useEffect(() => {
    // hàm chọn 1 màu ngẫu nhiên trong danh sách
    const getRandomColor = () => {
      const colorList = [
        "#FF0000",
        "#00FF00",
        "#0000FF",
        "#FFFF00",
        "#00FFFF",
        "#FF00FF",
      ];
      const randomIndex = Math.floor(Math.random() * colorList.length); // chọn 1 index ngẫu nhiên, giải thích hàm này đã có ở phía trên.
      return colorList[randomIndex]; // trả ra màu được chọn ngẫu nhiên
    };
    const newColor = getRandomColor();
    setSelectedColor(newColor);
    setHighlightColor(adjustColor(newColor, diffColor)); // gọi hàm tạo sự khác biệt về màu sắc
  }, [row, col, diffColor]);

  const gridColors = Array(row * col).fill(selectedColor); // tạo mảng với số phần tử = row * col rồi bỏ vào màu được chọn
  const highlightIndex = getRandomIndex(row * col); // chọn 1 ô ngẫu nhiên trong mảng
  gridColors[highlightIndex] = highlightColor; // thay đổi ô ngẫu nhiên được chọn bằng 1 màu khác

  // hàm kiểm tra màu chọn có đúng là màu khác biệt hay khống
  const handleCheck = (color) => () => {
    if (highlightColor === color) {
      message.success("Bạn đã chọn đúng");
      if (row < 6) setRow(row + 1); // tránh vượt qua màn hình

      if (col < 14) setCol(col + 1); // tránh vượt qua màn hình

      if (diffColor > 50) {
        // khi độ thay đổi cao thì giảm nhiều hơn
        setDiffColor(diffColor - 10);
      } else if (diffColor > 10) {
        setDiffColor(diffColor - 5);
      }
      if (col === 13) {
        // win và đặt mảng về trạng thái đầu
        message.success(`You win`);
        setCol(2);
        setRow(2);
      }
    } else {
      message.error("Chọn sai, thử lại!");
    }
  };

  const handleClickk = () => {
    navigate("/");
  };
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>
        <button onClick={handleClickk} className="navigate-button">
          Home
        </button>
        Choose the difference color
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${col}, 100px)`,
          gap: "5px",
          justifyContent: "center",
          alignItems: "center",
        }}>
        {gridColors.map((color, index) => (
          <div
            key={index}
            style={{ backgroundColor: color, width: "100px", height: "100px" }}
            onClick={handleCheck(color)}
          />
        ))}
      </div>
    </div>
  );
}

export default ColorTest;
