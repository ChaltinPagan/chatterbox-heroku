import React from 'react';
import { Link } from "react-router-dom";
import FaAngleDoubleLeft from 'react-icons/lib/fa/angle-double-left';
import FaAngleDoubleRight from 'react-icons/lib/fa/angle-double-right'

const TvGuide = ({hour, arr, dateInput, moreTime, lessTime, handleDateInput, handleReset, handleUserInput, userInput}) => {
    let hourStr = hour < 10 ? hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) : hour.toString();
    
    // Re-write airtimes to reflect 12-hour clock.
    const schedHour1 = hour === 0 ? `12 AM` : 
        (hour <= 11 ? `${hour} AM` : 
        (hour === 12 ? `${hour} noon` : `${hour - 12} PM`) )
    const schedHour2 = hour + 1 === 24 ? `12 midnight` : 
        (hour + 1 <= 11 ? `${hour + 1} AM` : 
        (hour + 1 === 12 ? `${hour + 1} noon` :`${hour - 11} PM`) )

    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    let year = new Date().getFullYear()
    let date = dateInput ? dateInput : `${year}-${(month < 10 ? `0` + month : month)}-${(day < 10 ? `0` + day : day)}`

    // Filters out Playboy TV network and any other show without a network name. 
    // Returns shows that match the specified hour range.
    // Sorts shows by airtime.
    let tv = arr.filter( (el, i, arr) => {
        if (el.show.network !== null
            && el.show.network.name !== "Playboy TV"
            && (el.airtime.match(hourStr + ":") 
            || el.airtime.match(hourStr + ":3")) ) {
            return el;
        }
    }).sort( (a, b) => {
        return a.airtime > b.airtime;
    })

    return (
        <div className='schedule-table'>
            <div>
                <input type="date" 
                    id="date"  
                    value={userInput}
                    onChange={handleUserInput}
                    placeholder="YYYY-MM-DD"/>
                <button onClick={handleDateInput} >Get Schedule</button>
                <button onClick={handleReset} id="reset">Reset</button>
                {" "}

             
        
            </div>
            
            <table className='schedule-table'>
                <thead>
                    <tr>
                        <td id="title" colSpan="4">Schedule for:{" "}{date} <br /> 
                        On Air:{" "}{schedHour1}{" - "}{schedHour2} <br />
                          {/* Buttons are diabled when user reaches midnight. */}


                        <FaAngleDoubleRight  className={hour === 23 ? "arrow" : ""} size={80}  
                            style={{float:'right', padding: '10px'}} disabled={hour === 23} onClick={moreTime}/>
                        
                        {/* Buttons are diabled when user reaches 0. */}

                        <FaAngleDoubleLeft  className={ (hour === new Date().getHours() && !dateInput) || (hour === 0)  ? "arrow" : ""} 
                            size={80} style={{float:'left', padding: '10px'}} disabled={ (hour === new Date().getHours() && !dateInput) || (hour === 0) } 
                            onClick={lessTime}/>
                     
                        </td>
                    </tr>
                    <tr>
                        <th>Hour</th>
                        <th>Show</th>
                        <th>Network</th>

                        {/* <th>Runtime (mins)</th> */}
                    </tr>
                </thead>
                <tbody className='schedule-table'>
                    {tv.map(el => 
                    <tr key={el.id}>
                     <td>{el.airtime.match(hour + ":00") ? schedHour1 :
                            schedHour1.replace(" ", el.airtime.slice(2).concat(" ")) }</td>
                        
                <td>{ dateInput ? el.show.name : <Link to={`/chat/${el.show.id}`}>{el.show.name}</Link>}</td>
                <td>{el.show.network.name}</td>
                        {/* <td>{el.runtime}</td> */}
                    </tr>)}
                
                    <tr>
                        <td colSpan="4" id="tablefoot"><p>{tv.length === 0 ? "No shows at this time" : ""}</p></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default TvGuide;