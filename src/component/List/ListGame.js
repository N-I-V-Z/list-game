import { Link } from "react-router-dom";

function ListGame() {
  return (
    <div>
      <Link to="/caro-game-3x3">
        <div>Caro Game 3x3</div>
      </Link>
      <Link to="/caro-game-5">
        <div>Caro Game 5</div>
      </Link>
    </div>
  );
}

export default ListGame;
