import React from "react";
import { motion } from "framer-motion";
import "./styles/Dash.css";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "boxicons";
import axios from "axios";

export default function Dashboard() {
  const apiKey = "3eed0b14fb5649a7833171428252202";
  const [expanded, setExpanded] = useState(false);
  const [newsData, setnewsData] = useState([]);
  const [weatherData, setweatherData] = useState([]);
  const [day, setday] = useState();
  const [userDat, setuserDat] = useState();
  const { aadharNum } = useParams();

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

  const [selectedCrop, setSelectedCrop] = useState("");
  const [area, setarea] = useState();

  // Example Output: "Saturday" (if today is Saturday)
//   useEffect(() => {
//     axios
//       .get(
//         "https://newsdata.io/api/1/news?apikey=pub_71393425f2eb107bc20c5e467f4599218c164&q=Agriculture&country=in"
//       )
//       .then((response) => {
//         setnewsData(response.data.results);
//         console.log(response.data);
//       });
//   }, []);


  useEffect(() => {
    axios
      .get(
        "https://agentsay-kisaansaathi.hf.space/api/predict?crop=RICE&district=Durg&land=1"
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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Selected Crop:", selectedCrop);
  };
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      axios
        .get(`api/dashboard/${aadharNum}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            console.log(res.data);
            setuserDat(res.data);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

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
          <p className="date-tdy">(22.02.2025)</p>
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
          {/* {newsData.length > 0
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
            : ""} */}
          {/* <div className='news2'>
                    <div className='data1'></div>
                    <p className='news-head'>News heading</p>
                    </div> */}
        </div>
        <div className="crop-data">
          <h1 className="cropdata-h1">Add crop</h1>
          <h1 className="cropscore-h1">Scores</h1>
          <div className="crop-sel">
            <div className="form-crop">
              <select
                className="cropSelection"
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
              ></input>
              <button className="submit-crop-form" onClick={handleAddCrop}>Submit</button>
            </div>
          </div>
          <div className="score-graph">
            <h1
              className="climate-score"
              style={{
                color: "green",
                position: "absolute",
                fontSize: "5rem",
                left: "22%",
                top: "20%",
              }}
            >
              87
            </h1>
          </div>
        </div>
      </motion.div>

      <motion.div className="dash-sub">
        <button className="crop-sel-dash">Quick Access Loans</button>
        <div className="sub1">
          <h1 className="week-up">Upcoming Week</h1>
        </div>
        <div className="sub2"></div>
      </motion.div>
    </div>
  );
}
