import { useHistory } from "react-router-dom";
import "./style.css";
import { useData } from "../../context/dataProvider";
import { fetchData } from "../../api";

export default function Header() {
  const { updateVehiclesData } = useData();
  const history = useHistory();
  const resetVehiclesData = () => {
    fetchData("https://findfalcone.geektrust.com/vehicles")
      .then((responseData) => {
        updateVehiclesData(responseData);
      })
      .catch((error) => {
        console.error("Error fetching vehicles:", error);
      });
  };
  const handleResetClick = () => {
    resetVehiclesData(); 
    history.push("/");
  };

  return (
    <div className="headerCont">
      <div className="headerTabs">
        <button onClick={handleResetClick} className="resetBtn">
          Reset
        </button>
        <a
          href="https://www.geektrust.com/"
          target="blank"
          className="geekTrustBtn"
        >
          GeekTrust Home
        </a>
      </div>

      <h1>Finding Falcon!</h1>
    </div>
  );
}
