import React, { useState, useEffect, useReducer } from 'react'

import { db, storage } from '../firebase-config'

import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";
import MapInput from './MapInput'
import ReactApexChart from 'react-apexcharts'

//MdOutlineError
import { MdOutlineError } from 'react-icons/md'



function OfficersReportsList({ userData, setOpenAlert, setAlertMessage, setAlertSeverity }) {

    const [reports, setReports] = useState([])

    const GetReports = async () => {
        const q = query(collection(db, "reports"));
        const querySnapshot = getDocs(q);
        querySnapshot.then((querySnapshot) => {
            var reports = []
            querySnapshot.forEach((doc) => {
                if (doc.data()?.timestamp) {
                    reports.push(doc.data())
                }
            });
            setReports(reports)
        });
    }

    useEffect(() => {
        GetReports()
    }, [])

    console.log(reports)

    function getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    const Last30Days = () => {
        var currentMonth = new Date().getMonth() + 1
        var previousMonth = (currentMonth == 1) ? 12 : (currentMonth - 1)

        var currentYear = new Date().getFullYear()
        var previousYear = new Date().getFullYear()
        if ((currentMonth == 1) && (previousMonth == 12)) previousYear = new Date().getFullYear() - 1

        var currentDay = new Date().getDate()

        var data = [];

        const thisMonthDays = getDaysInMonth(currentYear, currentMonth)
        const previousMonthDays = getDaysInMonth(currentYear, previousMonth)

        var daysInOtherMonth = 30 - currentDay;
        var beginningOf30Days = previousMonthDays - daysInOtherMonth;
        //console.log(' last 30 days begins at ' + beginningOf30Days + ' and end at ' + currentDay)

        //add previous month days
        for (var i = beginningOf30Days + 1; i <= previousMonthDays; i++) {
            data.push({ day: i, month: previousMonth, year: previousYear })
        }
        //add current month days
        for (var i = 1; i <= currentDay; i++) {
            data.push({ day: i, month: currentMonth, year: currentYear })
        }

        return data
    }



    const GetChartsData = () => {
        if (!reports && reportsTimeline) return
        var reportsTimeline = Last30Days();

        reportsTimeline.map((item, i) => {
            var day = item.day;
            var month = item.month
            var year = item.year

            reports.map((report) => {
                var reportDay = new Date(report.timestamp.seconds * 1000).getDate()
                var reportMonth = new Date(report.timestamp.seconds * 1000).getMonth() + 1
                var reportYear = new Date(report.timestamp.seconds * 1000).getFullYear()

                if (reportDay == day && reportMonth == month && reportYear == year) {
                    var reportReason = report.reason;
                    reportsTimeline[i][reportReason] = reportsTimeline[i][reportReason] ? reportsTimeline[i][reportReason] + 1 : 1
                }

                
                    //if there are 0 reports on this day for rest of the reasons, add the reason with 0 reports
                    const reasons = [
                        'Lost item',
                        'Damaged item',
                        'Road accident',
                        'Bullying',
                        'Harassement',
                        'Other'
                    ]
                    reasons.map((reason) => {
                      //  console.log(reportsTimeline[i][reason])
                        if (!reportsTimeline[i][reason]) {
                            reportsTimeline[i][reason] = 0;
                        }
                    })
            })

        })

        return reportsTimeline
    }

    const [reportsTimeline, setReportsTimeline] = useState([]);
console.log(reportsTimeline)
    useEffect(() => {
        setReportsTimeline(GetChartsData())

    }, [reports])

    console.log(reportsTimeline?.map((item) => item['Bullying']))
    const chartData1 = {

        series: [{
            name: 'Bullying',
            data: reportsTimeline?.map((item) => item['Bullying'])
        }, {
            name: 'Damaged item',
            data: reportsTimeline?.map((item) => item['Damaged item'])
        }, {
            name: 'Lost item',
            data: reportsTimeline?.map((item) => item['Lost item'])
        }, {
            name: 'Road accident',
            data: reportsTimeline?.map((item) => item['Road accident'])
        }, {
            name: 'Other',
            data: reportsTimeline?.map((item) => item['Other'])
        }
    ],
        options: {
            chart: {
                type: 'bar',
                height: 500,
                stacked: true,
                //stackType: '100%'
            },
            responsive: [{
                breakpoint: 2000,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }],
            xaxis: {
                categories: reportsTimeline?.map((item) => item['day']),
            },
            fill: {
                opacity: 1
            },
            legend: {
                position: 'right',
                offsetX: 0,
                offsetY: 50
            },
        }
    }

    return (
        <div>

            <div className='SEE-REPORTS-LIST' style={{ marginTop: '30px', paddingBottom: '60px' }} >
                <h2 className=' text-3xl m-auto mt-16 pb-10 flex justify-center font-semibold opacity-90' >CRIME REPORTS</h2>
                <p className='font-normal m-auto text-base text-center -mt-8' style={{ width: '90%', maxWidth: '400px' }} >The reports below have been sent by student to report crimes they've witnessed</p>

                {(userData?.accountType == 'official') && <div className='block px-12 rounded-xl shadow-sm bg-white card m-auto mt-12 py-6' >

                    {(!(userData?.subscribedToTelegram)) && <div >
                        You are not subscribed to CSIR alerts on <b>Telegram</b> ! Please connect to the bot through this link to receive alerts !
                        <a className='text-blue-400 text-base font-semibold px-2' target={'_blank'} href={'https://t.me/CSIR_alert_bot'} >t.me/CSIR_alert_bot</a>

                    </div>}
                    {((userData?.subscribedToTelegram)) && <div className='card' >
                        You are <b> subscribed </b> to CSIR alerts on Telegram !
                        <div className='opacity-70 text-sm' > you will receive an alert instantly when a new report is submitted ! </div>

                    </div>}

                </div>}

                <div className='block px-12 rounded-xl shadow-sm bg-white  m-auto mt-12 py-12' style={{ height: '500px',width:'1000px', maxWidth:'90%' }}>
                    <h3 className='text-xl opacity-90 font-semibold'>Reports in the last 30 days </h3>
                    <ReactApexChart options={chartData1.options} series={chartData1.series} type="bar" height={400} />

                </div>
                <div className='block px-12 rounded-xl shadow-sm bg-white card m-auto mt-12 py-12' >
                    {reports.map((report, index) => {
                        return (
                            <div className='block m-auto mb-16'  >

                                <div class="relative flex py-5 items-center" >
                                    <div class="flex-grow border-t border-gray-400"></div>
                                    <span class=" mx-4 opacity-95 font-semibold flex justify-center  ">

                                        {/* {report.emergency || 1 && <div className='font-bold text-red-600 pr-1' >[E]  <b style={{opacity:'0.5', color:'black'}} > - </b></div>} */}
                                        {/* {report.emergency || 1 && <div className='font-bold text-red-600 pr-1' ><img src={"https://www.pngall.com/wp-content/uploads/12/Emergency-Siren.png"} style={{width:'30px'}} /> </div>} */}
                                        {report.emergency && <div className='font-bold text-red-600 pr-1' ><MdOutlineError style={{ fontSize: '19px', marginTop: '2px' }} /> </div>}

                                        <div> {report.reason} <b style={{ opacity: '0.5' }} > - </b> </div>

                                        <div>
                                            <ul class="flex justify-center mt-1">

                                                {[...Array(5)].map((item, i) => {
                                                    var urgency = report.urgency
                                                    return (

                                                        <li key={i} style={{ cursor: 'pointer', paddingInline: '7px' }}>
                                                            <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="angry" class=" text-blue-500  " style={{ width: '15px', marginRight: '-8px' }} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                                                                <path style={{ cursor: 'pointer', color: ((urgency >= i) ? 'red' : 'lightgrey') }} fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-80 128c-40.2 0-78 17.7-103.8 48.6-8.5 10.2-7.1 25.3 3.1 33.8 10.2 8.4 25.3 7.1 33.8-3.1 16.6-19.9 41-31.4 66.9-31.4s50.3 11.4 66.9 31.4c8.1 9.7 23.1 11.9 33.8 3.1 10.2-8.5 11.5-23.6 3.1-33.8C326 321.7 288.2 304 248 304z"></path>
                                                            </svg>
                                                        </li>
                                                    )
                                                })}
                                            </ul>

                                        </div>

                                    </span>
                                    <div class="flex-grow border-t border-gray-400"></div>
                                </div>
                                <div className='mb-4' >
                                    <div className='flex items-center mt-2 ' >   <p className='text-sm inline-block  text-gray-500' > Student name  </p> <p className=' px-2 opacity-95' > {report.name} </p></div>
                                    <div className='flex items-center mt-2 ' >   <p className='text-sm inline-block  text-gray-500' > Student MATRIC  </p> <p className=' px-2 opacity-95' > {report.matric} </p></div>
                                    <div className='flex items-center mt-2 ' >   <p className='text-sm inline-block  text-gray-500' > Student phone  </p> <p className=' px-2 opacity-95' > {report.number} </p></div>
                                    {report.comment && <div className='flex items-start  mt-2 ' >   <p className='text-sm inline-block  text-gray-500 ' style={{ whiteSpace: 'nowrap' }} > Student comment </p> <p className=' px-2 opacity-95' > {report.comment}</p></div>}

                                </div>


                                <div className='flex items-center -mb-2 mt-2 ' >   <p className='text-sm inline-block  text-gray-500' > Crime Date & Time  </p> <p className=' px-2 opacity-95' > {report.date} - {report.time}</p></div>
                                {report?.position && <div style={{ marginBottom: '50px' }} >
                                    <MapInput
                                        position={report?.position}
                                        changeable={false}
                                    />
                                </div>}
                                {report?.image && <div className='block   mt-2 ' >
                                    <p className='text-sm inline-block  text-gray-500 mb-2 mt-4' > Crime image  </p>
                                    <img src={report.image} style={{ width: '90%' }} className=' object-cover rounded-lg ml-2' />

                                </div>}


                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default OfficersReportsList