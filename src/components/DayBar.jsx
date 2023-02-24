import React from 'react'
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
export const DayBar = ({result, date}) => {
    if(!result) return

    const data = {
        labels: result.map(ele => ele.time),
        datasets: [
          {
            label: "Time Wise Count",
            data: result.map(ele => ele.count),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ],
      };

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: dayjs(date).format("DD-MMMM-YYYY"),
          },
        },
      };

  return (
    <Bar options={options} data={data}/>
  )
}
