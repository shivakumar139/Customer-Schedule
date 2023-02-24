import scheduleData from "./data.json"
import dayjs from "dayjs";
export class Schedule{
    constructor(){
        this.data = scheduleData;
    }
    

    /**
     * 
     * @param {Deliver Date} date 
     * @returns array of scheluded dates with count
     */
    getScheduleCountWithDate(date){
        if(!date) return;

        const map = new Map()

        this.data.forEach(ele =>{
            if(ele.item_date === date){
                const scheduleDate = ele.schedule_time.split(" ")[0];
                if(map.has(scheduleDate)){
                    const prevCount = map.get(scheduleDate)
                    map.set(scheduleDate, prevCount+1)
                } else{
                    map.set(scheduleDate, 1)
                }  
            }  
        })

        // making an object like {date, count}
        const arr = []
        map.forEach((value, key) =>{
            arr.push({"date":key, "count":value})
        })

        return arr;
    }

    /**
     * 
     * @param {Schedule Date} date 
     * @returns array of time group data in a single day
     */
    getPerDaySchedule(date){
        if(!date) return;


        const map = new Map()

        map.set("9am to 12am", 0)
        map.set("12am to 3pm", 0)
        map.set("3pm to 6pm", 0)
        map.set("6pm to 9pm", 0)
        map.set("9pm to 12pm", 0)

        this.data.forEach(ele =>{

            const scheduleDate = ele.schedule_time.split(" ")[0]

            if(scheduleDate === date){
                const scheduleTime = ele.schedule_time.split(" ")[1]
                const scheduleHour = scheduleTime.split(":")[0]

                let prevCount;
                if(scheduleHour >= 9 && scheduleHour < 12){
                    prevCount = map.get("9am to 12am")
                    map.set("9am to 12am", prevCount+1)
                } else if(scheduleHour >= 12 && scheduleHour < 15){
                    prevCount = map.get("12am to 3pm")
                    map.set("12am to 3pm", prevCount+1)
                } else if(scheduleHour >= 15 && scheduleHour < 18){
                    prevCount = map.get("3pm to 6pm")
                    map.set("3pm to 6pm", prevCount+1)
                } else if(scheduleHour >= 18 && scheduleHour < 21){
                    prevCount = map.get("6pm to 9pm")
                    map.set("6pm to 9pm", prevCount+1)
                } else if(scheduleHour >= 21 && scheduleHour < 25){
                    prevCount = map.get("9pm to 12pm")
                    map.set("9pm to 12pm", prevCount+1)
                }

            } 
        })


        // making an object like {time, count}
        const arr = []
        map.forEach((value, key) =>{
            arr.push({"time":key, "count":value})
        })
        return arr;
    }

    /**
     * 
     * @param {Schedule Date} dateRange 
     * @returns array of schedule date count
     */
    getDataInRange(dateRange){
        if(!dateRange) return;
        


        const arr = []
        let {dateFrom, dateTo} = dateRange;
        dateFrom = dayjs(dateFrom).format("YYYY-MM-DD")
        dateTo = dayjs(dateTo).format("YYYY-MM-DD")

    
        for(let i=dateFrom; i<=dateTo; i=dayjs(i).add(1,"day").format('YYYY-MM-DD')){
            
            let count=0;
            this.data.forEach(ele =>{
                const scheduleDate = ele.schedule_time.split(" ")[0]

                if(scheduleDate === i) count++
            })
            if(count !== 0)
                arr.push({date: i, count: count})
        }

        return arr;
    }
}