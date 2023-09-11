import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchData } from "../api";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [destination, setDestination] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [myToken, setMyToken] = useState("");
  const [armyData, setArmyData] = useState(
    Array.from({ length: 4 }, () => ({
      destination: "",
      vehicle: "",
      time: "",
    }))
  );
  const [timeTaken, setTimeTaken] = useState(0);

  useEffect(() => {
    if (destination.length === 0) {
      fetchData("https://findfalcone.geektrust.com/planets")
        .then((responseData) => {
          setDestination(responseData);
        })
        .catch((error) => {
          console.error("Error fetching planets:", error);
        });
    }

    if (vehicles.length === 0) {
      fetchData("https://findfalcone.geektrust.com/vehicles")
        .then((responseData) => {
          setVehicles(responseData);
        })
        .catch((error) => {
          console.error("Error fetching vehicles:", error);
        });
    }
  }, [destination.length, vehicles.length]);

  const updateVehiclesData = (updatedVehicles) => {
    setVehicles(updatedVehicles);
  };
  const updateArmyData = (updatedData) => {
    setArmyData(updatedData);
  };
  const updateTimeTaken = (updatedTime) => {
    setTimeTaken(updatedTime);
  };
  const updateMyToken = (updatedTime) => {
    setMyToken(updatedTime);
  };

  return (
    <DataContext.Provider
      value={{
        destination,
        vehicles,
        updateVehiclesData,
        updateArmyData,
        updateTimeTaken,
        updateMyToken,
        armyData,
        timeTaken,
        myToken,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
