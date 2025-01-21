import React from "react";
import Card from "../cards/cards";
import Questions from "../questions/questions";
import Chart from "../graph/graph";
import ProgressBar from "../progress_bar/progress_bar";
import Organization from "../organization/organisation";

const Dashboard = () => {
  return (
    <div className="container">
      <div className="main-content d-flex-grow-1">
        <Card />
        <div className="row d-flex justify-content-between">
          <div className="col-md-7 gy-5">
            <Chart />
          </div>
          <div className="col-md-5 gy-5">
            <Questions />
          </div>
        </div>
        <div className="row d-flex justify-content-between">
          <div className="col-md-7 gy-5">
            <ProgressBar />
          </div>
          <div className="col-md-5 gy-5">
            <Organization />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
