import React, { useEffect, useState } from 'react'
import "./graph.css"
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Stack from '@mui/material/Stack';

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';


import { Schedule } from '../data/Schedule';
import { Bar } from 'react-chartjs-2';
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


const RangeGraph = () => {

    const [result, setResult] = useState([])
    const [max, setMax] = useState()
    const [selected, setSelected] = useState(false)


    const [dateRange, setDateRange] = useState({
        dateFrom: dayjs("2022-01-01"),
        dateTo: dayjs("2022-02-20")
    })

    const sc = new Schedule()

    const handleChange = async (newDate, type) =>{
        

        if(type === 1){
            setDateRange({
                ...dateRange,
                dateFrom: newDate
            })
        } else{
            setDateRange({
                ...dateRange,
                dateTo: newDate
            })
        }
        setSelected(true)
            const data = sc.getDataInRange(dateRange)
            setResult([...data])

            let mx = data[0].count
            data.forEach(ele => {
                mx = Math.max(ele.count, mx)
            })
            setMax(mx)    

    }




    const data = {
        labels: result.map((_, index) => `Day ${index+1}`),
        datasets: [
          {
            label: "Day Percentage",
            data: result.map(ele => {
                return ((ele.count*100)/max)
            }),
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
            text: `${dayjs(dateRange.dateFrom).format("DD-MMMM-YYYY")} To ${dayjs(dateRange.dateTo).format("DD-MMMM-YYYY")}`,
          },
        },
      };



    return (
        <div>
            <div className='container shadow' >
                <h1>Select Date in Range</h1>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction="row" spacing={2}>
                    <DesktopDatePicker
                    label="Date From"
                    inputFormat="MM/DD/YYYY"
                    value={dateRange.dateFrom}
                    onChange={(newDate) => handleChange(newDate, 1)}
                    renderInput={(params) => <TextField {...params} />}
                    />
                    <DesktopDatePicker
                    label="Date To"
                    inputFormat="MM/DD/YYYY"
                    value={dateRange.dateTo}
                    onChange={(newDate) => handleChange(newDate, 2)}
                    renderInput={(params) => <TextField {...params} />}
                    
                    />
                    </Stack>
                </LocalizationProvider>
            </div>

            {result.length > 0 ? <div className="container grid ml-0 w-100">
                <div className="container w-100 p-2 shadow">
                    <Bar options={options} data={data}/>
                </div>



                
            </div> : <div className="container grid ml-0 w-100">
              {selected ? <h1>No Data Found Please Select Another Date</h1>: <h1>Please Select a Date</h1>}
              
              </div>}
            

        
        </div>
    )
}

export default RangeGraph