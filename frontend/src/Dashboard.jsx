import React from "react";
import { motion } from "framer-motion";
import "./styles/Dash.css";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "boxicons";
import axios from "axios";
import { Line } from "react-chartjs-2";
import gif from "./assets/output-onlinegiftools.gif";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function Dashboard() {
  const apiKey = "3eed0b14fb5649a7833171428252202";
  const [expanded, setExpanded] = useState(false);
  const [newsData, setnewsData] = useState([]);
  const [weatherData, setweatherData] = useState([]);
  const [day, setday] = useState();
  const [userDat, setuserDat] = useState();
  const [Area, setArea] = useState();
  const [selectedCrop, setSelectedCrop] = useState("WHEAT");
  const [yieldData, setYieldData] = useState();
  const [graphData, setgraphData] = useState();
  const [data1, setdata1] = useState();
  const [data2, setdata2] = useState();
  const [scores, setScores] = useState([]);

  const navigate = useNavigate();

  const crops = [
    "RICE",
    "WHEAT",
    "KHARIF SORGHUM",
    "RABI SORGHUM",
    "SORGHUM",
    "PEARL MILLET",
    "MAIZE",
    "FINGER MILLET",
    "BARLEY",
    "CHICKPEA",
    "PIGEONPEA",
    "MINOR PULSES",
    "GROUNDNUT",
    "SESAMUM",
    "RAPESEED AND MUSTARD",
    "SAFFLOWER",
    "CASTOR",
    "LINSEED",
    "SUNFLOWER",
    "SOYABEAN",
    "OILSEEDS",
    "SUGARCANE",
    "COTTON",
  ];

  const dataMetrics = [
    { metric: "Revenue", value: "$50,000" },
    { metric: "Users", value: "1,200" },
    { metric: "Growth Rate", value: "15%" },
    { metric: "Retention", value: "80%" },
    { metric: "Active Sessions", value: "5,400" },
  ];

  useEffect(() => {
    try {
      const aadharNumber = JSON.parse(localStorage.getItem("aadharNumber"));
      console.log(aadharNumber);
      const token = localStorage.getItem("token");
      axios
        .get(`http://localhost:3000/api/dashboard/${aadharNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            console.log("UserData:", res.data);
            setuserDat(res.data);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  // Example Output: "Saturday" (if today is Saturday)
  useEffect(() => {
    axios
      .get(
        "https://newsdata.io/api/1/news?apikey=pub_71393425f2eb107bc20c5e467f4599218c164&q=Agriculture&country=in"
      )
      .then((response) => {
        setnewsData(response.data.results);
        console.log(response.data);
      });
  }, []);

  useEffect(() => {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=$Kolkata&days=5&aqi=no&alerts=no`;
    try {
      axios.get(apiUrl).then((res) => {
        setweatherData(res.data);
        console.log(res.data);
      });
    } catch (e) {
      console.log(e);
    }
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date();
    const dayName = days[today.getDay()];
    setday(dayName);
    console.log(dayName);
  }, []);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }

      if (!userDat?.dashboardData?.user?.location) {
        console.error("User location is missing or user data is not loaded.");
        return;
      }

      const parsedArea = parseFloat(Area);
      if (isNaN(parsedArea) || parsedArea <= 0) {
        console.error("Invalid area input. Must be a positive number.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/yield-score/predict",
        {
          cropName: selectedCrop,
          location: userDat.dashboardData.user.location,
          land: parsedArea,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log("Yield Score:", response.data.data.savedScore);
        setScores((prevScores) => [
          ...prevScores,
          {
            name: selectedCrop,
            score:
              response.data.data.savedScore.crops[
                response.data.data.savedScore.crops.length - 1
              ].score,
            predicted_yield:
              response.data.data.savedScore.crops[
                response.data.data.savedScore.crops.length - 1
              ].predicted_yield,
          },
        ]);
      }
    } catch (error) {
      console.error(
        "Error predicting yield score:",
        error.response?.data || error
      );
    }
  };

  useEffect(() => {
    try {
      axios
        .get("https://agentsay-kisaansaathi.hf.space/api/map", {
          params: {
            crop: selectedCrop,
            district: userDat.dashboardData.user.location.district,
            land: 1,
          },
        })
        .then((res) => {
          setgraphData(res.data);
          console.log(res.data);
        });
    } catch (e) {
      console.log(e);
    }
  }, [userDat]);

  useEffect(() => {
    const best_crop = [];
    const ts_data = [];
    for (var i = 0; i < 30; i++) {
      const d = graphData ? graphData.best_crop_data[i].Yield : null;
      best_crop.push(d);
      const f = graphData ? graphData.ts_data[i].Yield : null;
      ts_data.push(f);
    }
    setdata1(best_crop);
    setdata2(ts_data);

    console.log(ts_data);
  }, [graphData]);

  const data = {
    labels: [
      "1988",
      "1989",
      "1990",
      "1991",
      "1992",
      "1993",
      "1994",
      "1995",
      "1996",
      "1997",
      "1998",
      "1999",
      "2000",
      "2001",
      "2002",
      "2003",
      "2004",
      "2005",
      "2006",
      "2007",
      "2008",
      "2009",
      "2010",
      "2011",
      "2012",
      "2013",
      "2014",
      "2015",
      "2016",
      "2017",
    ],
    datasets: [
      {
        label: "Dataset 1",
        data: data1 ? data1 : [], // First line data
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        tension: 0.4,
      },
      {
        label: "Dataset 2",
        data: data2 ? data2 : [], // Second line data
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
    },
  };

  if (!graphData) {
    return (
      <div
        className="load-div"
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyItems: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "black",
        }}
      >
        <img
          src={gif}
          style={{ filter: "invert(1)", position: "absolute", left: "25%" }}
        ></img>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <motion.div
        className="navbar-dash"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.div className="logo-dash-img"></motion.div>
        <div className="logo-dash">KisaanSathi</div>
        <div className="pfp">{userDat?.dashboardData?.user?.name[0] || ""}</div>
        <div className="username">
          {userDat?.dashboardData?.user?.name || ""}
        </div>
      </motion.div>

      <motion.div
        className={expanded ? "dashboard-exp" : "dashboard"}
        animate={{
          width: expanded ? "20%" : "5%",
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
      >
        <div className="ham-container">
          <box-icon
            name="menu"
            color="#ffffff"
            size="40px"
            onClick={() => setExpanded(!expanded)}
            className="ham-icon"
          />
        </div>
        <div
          className="Account-dash"
          id="optChild"
          style={{ opacity: expanded ? "1" : "0" }}
        >
          Accounts
        </div>
        <div
          className="Transactions-dash"
          id="optChild"
          style={{ opacity: expanded ? "1" : "0" }}
        >
          Transactions
        </div>
        <div
          className="Enroll-new"
          id="optChild"
          style={{ opacity: expanded ? "1" : "0" }}
        >
          Enroll new account
        </div>
        <div
          className="Crop_insurance"
          id="optChild"
          style={{ opacity: expanded ? "1" : "0" }}
        >
          Crop insaurance
        </div>
        <div
          className="Banking"
          id="optChild"
          style={{ opacity: expanded ? "1" : "0" }}
        >
          Banking
        </div>
      </motion.div>

      <motion.div
        className="weather"
        initial={{ x: -450 }}
        animate={{ x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="IR"></div>

        <div className="weather-data">
          <p className="head">Weather today</p>
          <p className="date">{day ? day : ""}</p>
          <p className="date-tdy">
            {weatherData.current
              ? "(" + weatherData.current.last_updated.substring(0, 10) + ")"
              : ""}
          </p>
          <div className="sun">
            <box-icon
              name="sun"
              type="solid"
              size="80px"
              color="#ffc300"
            ></box-icon>
          </div>
          <p className="temp">
            {weatherData.current ? weatherData.current.temp_c + " C" : "20C"}
          </p>
          <p className="obostha">
            {weatherData.current ? weatherData.current.condition.text : ""}
          </p>
        </div>
        <div className="forecast">
          <p className="msg">Weather forecast</p>
          <p className="fore-day">(Monday)</p>
          <p className="temp2">
            {weatherData.forecast
              ? weatherData.forecast.forecastday[0].day.avgtemp_c + " C"
              : ""}
          </p>
          <p className="pos">
            {weatherData.forecast
              ? weatherData.forecast.forecastday[0].day.condition.text
              : ""}
          </p>
          <div className="forecast-data">
            <box-icon
              name="cloud-lightning"
              size="100px"
              color="#00bcff"
            ></box-icon>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="Dash-main"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h1 className="dash-text">Dashboard</h1>
        <p className="head-dash">Current news</p>
        <div className="current-news">
          {newsData.length > 0
            ? newsData.map((news, index) => (
                <div key={index} className="news1">
                  <div className="data1">
                    <img src={newsData[index].image_url} />
                  </div>
                  <p className="news-head">{newsData[index].title}</p>
                  <Link to={newsData[index].link}>
                    <div className="link">Link</div>
                  </Link>
                </div>
              ))
            : ""}
        </div>
        <div className="crop-data">
          <h1 className="cropdata-h1">Add crop</h1>
          <h1 className="cropscore-h1">Scores</h1>
          <div className="crop-sel">
            <div className="form-crop">
              <select
                className="cropSelection"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                <option value="" disabled>
                  Select a Crop
                </option>
                {crops.map((crop, index) => (
                  <option key={index} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="areaTake"
                placeholder="Enter field area(hector)"
                onChange={(e) => setArea(e.target.value)}
              />
              <button className="submit-crop-form" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
          <div className="score-graph" style={{ overflowY: "scroll" }}>
            {userDat?.dashboardData?.yieldScore?.yieldScore?.crops?.map(
              (item, index) => (
                <div className="add_scores" key={`existing-${index}`}>
                  <h1 className="crop_name_for_score">{item.name} :</h1>
                  <div
                    style={{
                      display: "flex",
                      position: "absolute",
                      right: "10%",
                      gap: "20px",
                    }}
                  >
                    <h1
                      className="climate-score"
                      style={{ color: "green", fontSize: "1rem" }}
                    >
                      Score: {item.score}
                    </h1>
                    <h1
                      className="yield-prediction"
                      style={{ color: "blue", fontSize: "1rem" }}
                    >
                      Yield: {item.predicted_yield}
                    </h1>
                  </div>
                </div>
              )
            )}
            {scores.map((item, index) => (
              <div className="add_scores" key={`new-${index}`}>
                <h1 className="crop_name_for_score">{item.name} :</h1>
                <div
                  style={{
                    display: "flex",
                    position: "absolute",
                    right: "10%",
                    gap: "20px",
                  }}
                >
                  <h1
                    className="climate-score"
                    style={{ color: "green", fontSize: "1rem" }}
                  >
                    Score: {item.score}
                  </h1>
                  <h1
                    className="yield-prediction"
                    style={{ color: "blue", fontSize: "1rem" }}
                  >
                    Yield: {item.predicted_yield}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="dash-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <button className="crop-sel-dash" onClick={() => navigate("/Finance")}>
          Quick Access Loans
        </button>
        <div className="sub1">
          <h1 className="week-up">Yield Report</h1>
          <h1 className="notif-sec">Notifications</h1>
          <div className="sub1-1">
            <table
              style={{
                borderCollapse: "collapse",
                width: "80%",
                textAlign: "left",
                border: "1px solid gray",
                position: "absolute",
                top: "5%",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#E5E7EB" }}>
                  <th style={{ border: "1px solid gray", padding: "10px" }}>
                    Metric
                  </th>
                  <th style={{ border: "1px solid gray", padding: "10px" }}>
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "white" }}>
                  <td style={{ border: "1px solid gray", padding: "10px" }}>
                    Loan amount
                  </td>
                  <td style={{ border: "1px solid gray", padding: "10px" }}>
                    {userDat?.dashboardData?.yieldScore?.yieldScore
                      ?.loan_amount || ""}
                  </td>
                </tr>
                <tr style={{ backgroundColor: "white" }}>
                  <td style={{ border: "1px solid gray", padding: "10px" }}>
                    yield category
                  </td>
                  <td style={{ border: "1px solid gray", padding: "10px" }}>
                    {userDat?.dashboardData?.yieldScore?.yieldScore
                      ?.yield_category || ""}
                  </td>
                </tr>
                <tr style={{ backgroundColor: "white" }}>
                  <td style={{ border: "1px solid gray", padding: "10px" }}>
                    Best crops
                  </td>
                  <td>
                    {userDat?.dashboardData?.yieldScore?.yieldScore?.best_crop?.map(
                      (item, index) => (
                        <>
                          <tr key={`main-${index}`}>
                            <td
                              style={{
                                border: "1px solid gray",
                                padding: "3.1px",
                                paddingRight: "3.2px",
                                width: "100%",
                              }}
                            >
                              {item.name}
                            </td>
                          </tr>
                        </>
                      )
                    ) || null}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="sub1-2">
            <motion.div
              className="notifs"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            ></motion.div>
            <motion.div
              className="notifs"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            ></motion.div>
          </div>
        </div>
        <div className="sub2">
          <Line data={data} options={options} />
        </div>
      </motion.div>
    </div>
  );
}
