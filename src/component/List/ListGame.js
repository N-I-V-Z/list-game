import { Link } from "react-router-dom";

function ListGame() {
  return (
    <div>
      <Link to="/caro-game-3x3">
        <div>Caro Game 3x3</div>
      </Link>
      <Link to="/trym">
        <div>FlapBird</div>
      </Link>
    </div>
  );
}

export default ListGame;
