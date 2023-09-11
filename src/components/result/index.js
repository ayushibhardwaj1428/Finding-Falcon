import React, { Fragment, useEffect, useState } from "react";
import { useData } from "../../context/dataProvider";
import { postData } from "../../api";
import Loader from "../basicLoader";
import "./style.css";


function Result() {
  const [result, setResult] = useState(null);
  const { armyData, timeTaken, myToken } = useData(); 
  const [loading, isLoading] = useState(false);

  useEffect(() => {
    if (armyData && timeTaken) {
      isLoading(true);
      const requestBody = {
        token: myToken,
        planet_names: armyData.map((p) => p.destination),
        vehicle_names: armyData.map((p) => p.vehicle),
      };

      postData("https://findfalcone.geektrust.com/find", requestBody, {
        Accept: "application/json",
        "Content-Type": "application/json",
      })
        .then((responseData) => {
          if (responseData.status === "success") {
            isLoading(false);
            setResult(responseData);
          } else {
            isLoading(false);
            setResult(null); 
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setResult(null); 
        });
    } else {
      isLoading(true);
      setTimeout(() => {
        isLoading(false);
      }, 5000);
    }
  }, [armyData, timeTaken]);

  return (
    <Fragment>
      {loading ? (
        <Loader></Loader>
      ) : (
        <div className="resultContainer">
          {result ? (
            <div className="successBlock">
              <p className="successMsg">
                Success! Congratulations on Finding Falcone. King Shan is mighty
                pleased.
              </p>
              <p className="metrics">TimeTaken: {timeTaken}</p>
              <p className="metrics">Planet found: {result.planet_name}</p>
            </div>
          ) : (
            <div className="failBlock">
              <p className="failMsg">
                {" "}
                {armyData && timeTaken
                  ? " Uh Oh! No luck Finding the Falcon"
                  : "We don't have all the Data"}{" "}
              </p>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
}

export default Result;
