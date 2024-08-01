import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import "./Rank.css";

function Rank({ game }) {
  const [rank, setRank] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          "/api/scores/get-top-10-score-by-game",
          { game }
        );
        setRank(response.data.data);
      } catch (error) {
        setRank([]);
      }
    };
    fetchData();
  }, [game]);

  return (
    <div className="rank">
      <table>
        <thead>
          <tr>
            <th>Top</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {rank.map((r, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{r.username}</td>
              <td>{r.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Rank;
