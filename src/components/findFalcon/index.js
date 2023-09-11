import React, { useState, useEffect } from "react";
import { useData } from "../../context/dataProvider";
import { postData } from "../../api";
import "./style.css";
import { useHistory } from "react-router-dom";

function FindFalcon() {
  const history = useHistory();

  const [armyData, setArmyData] = useState(
    Array.from({ length: 4 }, () => ({
      destination: "",
      vehicle: "",
      time: "",
    }))
  );
  const [prevSelectedVehicles, setPrevSelectedVehicles] = useState(
    Array.from({ length: 4 }, () => "")
  );
  const [vehicleArr, setVehicleArr] = useState([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [myToken, setMyToken] = useState("");
  const {
    destination,
    vehicles,
    updateVehiclesData,
    updateArmyData,
    updateTimeTaken,
    updateMyToken,
  } = useData();

  // Calculate vehicle times and total time taken
  useEffect(() => {
    const vehicleTimes = {};
    let finalTime = 0;

    vehicles.forEach((veh) => {
      vehicleTimes[veh.name] = veh.max_distance / veh.speed;
    });

    setVehicleArr(vehicleTimes);

    for (let i = 0; i < armyData.length; i++) {
      finalTime += armyData[i].time;
    }
    setTimeTaken(finalTime);
  }, [vehicles, armyData]);

  // Handle data submission after authentication
  useEffect(() => {
    if (myToken) {
      updateMyToken(myToken);
      updateArmyData(armyData);
      updateTimeTaken(timeTaken);
    }
  }, [myToken, timeTaken, armyData]);

  // Handle changes in destination selection
  const handleDestinationChange = (event, index) => {
    const selectedDestination = event.target.value;
    if (
      armyData.some(
        (army, i) => i !== index && army.destination === selectedDestination
      )
    ) {
      alert("Destination already selected for another Army.");
    } else {
      setArmyData((prevData) => {
        const newData = [...prevData];
        newData[index].destination = selectedDestination;
        return newData;
      });
    }
  };

  // Handle changes in vehicle selection
  const handleVehicleChange = (event, index) => {
    const selectedVehicleName = event.target.value;
    const prevSelectedVehicleName = armyData[index].vehicle;

   
    setArmyData((prevData) => {
      const newData = [...prevData];
      newData[index].vehicle = selectedVehicleName;
      newData[index].time = vehicleArr[selectedVehicleName] || "";
      return newData;
    });
    const updatedVehicles = vehicles.map((veh) => {
      if (veh.name === selectedVehicleName && veh.total_no > 0) {
        return { ...veh, total_no: veh.total_no - 1 };
      }
      if (
        prevSelectedVehicleName &&
        prevSelectedVehicleName !== selectedVehicleName &&
        veh.name === prevSelectedVehicleName
      ) {
        return { ...veh, total_no: veh.total_no + 1 };
      }
      return veh;
    });

    updateVehiclesData(updatedVehicles);

   
    setPrevSelectedVehicles((prevSelected) => {
      const newPrevSelected = [...prevSelected];
      newPrevSelected[index] = selectedVehicleName;
      return newPrevSelected;
    });
  };

  const isArmyDataValid = (army) => {
    return army.destination !== "" && army.vehicle !== "";
  };

  const destinationOptions = destination.map((dest, index) => (
    <option key={index} value={dest.name}>
      {dest.name}
    </option>
  ));

  const vehicleOptions = (index) => (
    <div className="vehicleSelect">
      {vehicles.map((veh, vIndex) => (
        <label key={vIndex} className="vehicleOption">
          <input
            type="radio"
            name={`vehicle${index}`}
            value={veh.name}
            checked={armyData[index].vehicle === veh.name}
            onChange={(event) => handleVehicleChange(event, index)}
            disabled={veh.total_no === 0}
            className="radioBtn"
          />
          {`${veh.name} (${veh.total_no})`}
        </label>
      ))}
    </div>
  );

  const handleButtonClick = () => {
    const allValid = armyData.every(isArmyDataValid);
    if (allValid) {
      postData("https://findfalcone.geektrust.com/token", null, {
        Accept: "application/json",
      })
        .then((responseData) => {
          setMyToken(responseData.token);
          history.push("/result");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      alert("Please select destinations and vehicles for all four Armies.");
    }
  };

  return (
    <div className="rootCont">
      <div className="dataContainer">
        {armyData.map((army, index) => (
          <div key={index} className={`destination${index + 1}`}>
            <select
              className="destinationSelect"
              autoComplete="on"
              onChange={(event) => handleDestinationChange(event, index)}
              value={army.destination}
            >
              <option value="" disabled>
                Select Destination
              </option>
              {destinationOptions}
            </select>

            {army.destination && vehicleOptions(index)}
          </div>
        ))}
      </div>
      <div className="timeBlock">
        Time Taken : <label>{timeTaken > 0 ? timeTaken : null}</label>
      </div>
      {timeTaken > 0 ? (
        <button className="submitButton" onClick={handleButtonClick}>
          FindFalcon!
        </button>
      ) : null}
    </div>
  );
}

export default FindFalcon;
