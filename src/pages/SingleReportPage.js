import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";
import SchoolLogo from '../media/csirlogo.png'
import MapInput from '../components/MapInput'

import { MdOutlineError } from 'react-icons/md'


function SingleReportPage() {
    const { id } = useParams();
    const [report, setReport] = useState(null)
    console.log(id)
    useEffect(() => {
        const q = query(collection(db, "reports"), where("id", "==", Number(id)));
        const querySnapshot = getDocs(q);
        querySnapshot.then((querySnapshot) => {
            var reports = []
            querySnapshot.forEach((doc) => {
                reports.push(doc.data())
            });
            setReport(reports[0])
        })
    }, [])

    console.log(report)

    return (
        <div>
            
            <div className='university-background'  >
                {/* <img src={Universiy} style={{position:'fixed'}}  /> */}

                <img src={SchoolLogo} alt="school logo" className="school-logo" />

                <div className='block px-12 rounded-xl shadow-sm bg-white max-w-lg m-auto mt-12 py-12' >
                    {report && <div className='block m-auto '  >

                                <div class="relative flex py-5 items-center" >
                                    <div class="flex-grow border-t border-gray-400"></div>
                                    <span class=" mx-4 opacity-95 font-semibold flex justify-center ">


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
                       }
                </div>
                <p style={{opacity:'0.7'}} >{id}</p>
            </div>
        </div>
    )
}

export default SingleReportPage