import React, { useEffect, useState } from 'react';
import Navbar from '../navigation/nav';
import BarChart from './barChart/barChart';
import LineChart from './lineChart/lineChart';

const Reports: React.FC = () => {


  return (
    <>
      <Navbar />
      <div>
       <BarChart />
      </div>
      <div>
         <LineChart />
      </div>
    </>
  );
}

export default Reports;
