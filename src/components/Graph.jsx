import React, { useEffect, useState, useRef } from 'react'
import "./graph.css"
import { Schedule } from '../data/Schedule';
import { Bar, getElementAtEvent } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { DayBar } from './DayBar';
import RangeGraph from './RangeGraph';

import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );


const Graph = () => {

    const [result, setResult] = useState([])
    const [perDayBar, setPerDayBar] = useState([])
    const [currentDate, setCurrentDate] = useState()
    const [barDate, SetBarDate] = useState()
    const [selected, setSelected] = useState(false)

    const sc = new Schedule()

    const handleChange = (newDate) =>{
        const newDateFormat = dayjs(newDate).format("YYYY-MM-DD")
        setSelected(true)
        const data = sc.getScheduleCountWithDate(newDateFormat)
        setResult([...data])
        setCurrentDate(newDateFormat)

    }
    useEffect(()=>{
      const data = sc.getScheduleCountWithDate("2022-01-01")
        setResult([...data])
        setCurrentDate("2022-01-01")
        
    }, [])



    const data = {
        labels: result.map(ele => {
          return dayjs(ele.date).format("DD-MMM-YYYY")
        }),
        datasets: [
          {
            label: "Schedule Day Count",
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
            text: dayjs(currentDate).format("DD-MMMM-YYYY"),
          },
        },
      };

      const chartRef = useRef();



    return (
        <div>
            <div className='container shadow' >
                <h1>Select a Date</h1>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                    label="Date From"
                    inputFormat="MM/DD/YYYY"
                    value={currentDate}
                    onChange={(newDate) => handleChange(newDate)}
                    renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
      
            </div>

            {result.length > 0 ? <div className="container grid ml-0 w-100">
                <div className="container w-10 p-2 shadow">
                  
                    <Bar options={options} data={data} onClick={(e)=>{
                        const res = getElementAtEvent(chartRef.current, e);

                        if(!res[0]?.index) return;

                        const index = res[0].index;
                       const dayData = sc.getPerDaySchedule(result[index].date + "")

                       SetBarDate(result[index].date)
                       setPerDayBar([...dayData])
                    }}
                    ref={chartRef}/>
                    <h5>Click on any bar to get detailed information</h5>
                </div>


                {perDayBar.length > 0 && <div className="container w-10 p-2 shadow">
                    <DayBar result={perDayBar} date={barDate}/>
                </div>}


                
            </div> : <div className="container grid ml-0 w-100">
              {selected ? <h1>No Data Found Please Select Another Date</h1>: <h1>Please Select a Date</h1>}
              
              </div>}


              <RangeGraph/>
            

        
        </div>
    )
}

export default Graph