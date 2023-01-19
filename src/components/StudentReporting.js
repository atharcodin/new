import React, { useState, useEffect, useReducer } from 'react'
import MapInput from '../components/MapInput'
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase-config'
import { ref, uploadBytes, getDownloadURL, listAll, list} from "firebase/storage";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";
import { BsFillCalendarDateFill } from 'react-icons/bs'
import { HiFaceFrown } from 'react-icons/hi'

import Universiy from '../media/upm.jpg'

//const SERVER_URL = ' https://d622-196-235-55-184.eu.ngrok.io';
const SERVER_URL = 'https://us-central1-csir-bcb22.cloudfunctions.net/app';


function StudentReporting({userData , setOpenAlert, setAlertMessage, setAlertSeverity}) {

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [position, setPosition] = useState()

    function RandomNumber() {
        return Math.floor(1000 + Math.random() * 900000)
    }

    const reasons = [
        'Lost item',
        'Damaged item',
        'Road accident',
        'Bullying',
        'Harassement',
        'Other'
    ]

    const [selectedReason, setSelectedReason] = useState('Lost item')
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
    //get date in this format and convert it to string 2022-11-17

    const [time, setTime] = useState(new Date().toISOString().slice(11, 16))

    const [emergency, setEmergency] = useState(true)

    const [urgency, setUrgency] = useState(1)

    const [image, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)

    const [comment, setComment] = useState('')

    const [submitLoading, setSubmitLoading] = useState(false)
    const SubmitReport = async (imageUrl) => {
        console.log((position== { lat: 6.5244, lng: 3.3792 }) ? 'null yyy' : {lat: position?.lat, lng:  position?.lng})
        console.log(position)
        setSubmitLoading(true)

        var randomId = RandomNumber()

        try {
            const docRef = await addDoc(collection(db, "reports"), {
                matric: userData?.matric,
                name: userData?.name,
                number: userData?.number,
                reason: selectedReason,
                date: date,
                time: time,
                emergency: emergency,
                urgency: urgency,
                image: imageUrl || '',
                comment: comment,
                position: (position.lat== 2.994384493228549) ? null : {lat: position?.lat, lng:  position?.lng},
                matric: userData.matric,
                status: 'pending',
                timestamp: serverTimestamp(),
                id: randomId
            });
            console.log("Document written with ID: ", docRef.id);

            
            if (docRef.id) {
                setSubmitLoading(false)
                setOpenAlert(true)
                setAlertSeverity('success')
                setAlertMessage('Report submitted successfully')
                
                //send report to backend 
                SendReportToBackend(randomId)
            }
        }
        catch (e) {
            console.error("Error adding document: ", e);
        }
        finally {
            setSubmitLoading(false)
        }
    }

    const SendReportToBackend = async (randomId) => {
        //fetch psot request to /report 
        const response = await fetch(SERVER_URL + '/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: userData.name,
                matric: userData?.matric,
                number: userData?.number,
                reason: selectedReason,
                date: date,
                time: time,
                emergency: emergency,
                urgency: urgency,
                image: imageUrl || '',
                comment: comment,
                position: (position.lat== 2.994384493228549) ? null : {lat: position?.lat, lng:  position?.lng},
                matric: userData.matric,
                status: 'pending',
                id: randomId
            })

        })
        const data = await response.json()
        console.log(data)
    }

    const [imageUploadLoading, setImageUploadLoading] = useState(false)
    console.log(imageUrl)
    const uploadFile = () => {
        console.log('starting to upload image...')

        if (image == null) {
            console.log('image is null')
            SubmitReport()

            return
        };
        setImageUploadLoading(true)
        const imageRef = ref(storage, `images/${image.name + RandomNumber()}`);
        uploadBytes(imageRef, image)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref)
                    .then((url) => {
                        setImageUrl(url);
                        console.log('Image uploaded successfully')


                        SubmitReport(url)
                    })
                    .catch((error) => {
                        console.log(error);
                        setAlertMessage('Error uploading image');
                        setAlertSeverity('error');
                        setOpenAlert(true);
                    }
                    )
                    .finally(() => {
                        setImageUploadLoading(false)
                    })
            })

    };



    return (
        <div>
            <div className='FILL-A-REPORT' style={{ marginTop: '30px', paddingBottom: '60px' }} >


                <h2 className=' text-3xl m-auto mt-16 pb-10 flex justify-center font-semibold opacity-90' >REPORT A CRIME</h2>
                <p className='font-normal m-auto text-base text-center -mt-8' style={{ width: '90%', maxWidth: '400px' }} >Fill out the form below with as much info as you can to send it to an official</p>
                <form className='block px-12 rounded-xl shadow-sm bg-white max-w-lg m-auto mt-12 py-12'  >
                    <div style={{ width: '100%', maxWidth: '900px' }}>
                        <b className='text-xl pl-4 mt-12' >Your details</b>

                        <div className='flex justify-center'>
                            <div style={{ width: '100%', height: '2px', opacity: '0.4' }} className=' bg-gray-300 mt-2 mb-4'></div>
                        </div>


                        <div style={{ width: 'fit-content', marginBottom: '40px' }} >
                            <div className="mb-4 standard-input">
                                <label class="form-label text-sm inline-block mb-2 text-gray-500">Name</label>
                                <input
                                    type="text"
                                    className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    placeholder="Name"
                                    value={userData.name}

                                />
                            </div>

                            <div className="mb-4 standard-input ">
                                <label class="form-label text-sm inline-block mb-2 text-gray-500">Phone Number</label>

                                <input
                                    type="text"
                                    className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    placeholder="Phone Number"
                                    value={userData.number}
                                />
                            </div>

                            <div className="mb-4 standard-input">
                                <label class="form-label text-sm inline-block mb-2 text-gray-500">MATRIC</label>

                                <input
                                    type="text"
                                    className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    placeholder="Phone Number"
                                    value={userData.matric}
                                />
                            </div>
                        </div>

                        <b className='text-xl pl-4 ' >Crime details</b>

                        <div className='flex justify-center'>
                            <div style={{ width: '100%', height: '2px', opacity: '0.4' }} className=' bg-gray-300 mt-2 mb-4'></div>
                        </div>

                        <div class="flex justify-center w-fit " style={{ marginTop: '15px', marginBottom: '22px' }}>

                            <div>
                                <label class="form-label text-sm inline-block mb-2 text-gray-500">Select a reason</label>

                                {reasons.map((reason, index) => {
                                    return (
                                        <div class="form-check mt-2 ">
                                            <input class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio"
                                                checked={selectedReason == reason}
                                                onChange={() => {
                                                    setSelectedReason(reason);
                                                    forceUpdate()
                                                }}
                                            />
                                            <label class="form-check-label inline-block text-gray-800 text-base" >
                                                {reason}
                                            </label>
                                        </div>
                                    )
                                })}

                            </div>
                        </div>



                        <div className="mb-4 standard-input" style={{ width: '200px', marginTop: '10px' }}>
                            <label class="form-label text-sm inline-block mb-2 text-gray-500 margin-on-mobile">Date</label>

                            <div className="flex items-center">

                                <input

                                    type="date"
                                    className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    placeholder="Date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* time picker without am and pm  */}
                        <div className="mb-4 standard-input" style={{ width: '200px' }}>
                            <label class="form-label text-sm inline-block mb-2 text-gray-500">Time</label>

                            <div className="flex items-center">

                                <input

                                    type="time"
                                    className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none   "
                                    placeholder="Time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                        </div>

                        <MapInput
                            position={position ? position : { lat: 6.5244, lng: 3.3792 }}
                            setPosition={setPosition}
                            changeable={true}

                        />


                        <div class="mb-3 w-96 my-8 mt-16 m-auto" style={{ width: '80%', maxWidth: '250px' }}>
                            <label class="form-label text-sm inline-block mb-2 text-gray-500">Upload image</label>
                            <input
                                onChange={(event) => setImage(event.target.files[0])}
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" type="file" id="formFile" />
                        </div>

                        {/*  is this an emergency yes or no*/}
                        <p className='flex justify-center font-semibold mt-12' >Is this an emergency ?</p>

                        <div class="flex justify-center mt-4">
                            <div class="form-check mx-4 ">
                                <input class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault" id="flexRadioDefault2"
                                    checked={selectedReason}
                                    onChange={() => setSelectedReason(true)}
                                />
                                <label class="form-check-label inline-block text-gray-800 text-base" for="flexRadioDefault2">
                                    YES
                                </label>
                            </div>
                            <div class="form-check mx-4 ">
                                <input class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault" id="flexRadioDefault2"
                                    checked={!selectedReason}
                                    onChange={() => setSelectedReason(false)}
                                />
                                <label class="form-check-label inline-block text-gray-800 text-base" for="flexRadioDefault2">
                                    NO
                                </label>
                            </div>


                        </div>


                        <div>
                            <ul class="flex justify-center mt-4">

                                {[...Array(5)].map((item, i) => {

                                    return (

                                        <li key={i} onClick={() => { setUrgency(i) }} style={{ cursor: 'pointer', paddingInline: '7px' }}>
                                            <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="angry" class="w-6 text-blue-500 mr-1 " style={{ fontSize: '25px' }} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                                                <path style={{ cursor: 'pointer', color: ((urgency >= i) ? 'red' : 'lightgrey') }} fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-80 128c-40.2 0-78 17.7-103.8 48.6-8.5 10.2-7.1 25.3 3.1 33.8 10.2 8.4 25.3 7.1 33.8-3.1 16.6-19.9 41-31.4 66.9-31.4s50.3 11.4 66.9 31.4c8.1 9.7 23.1 11.9 33.8 3.1 10.2-8.5 11.5-23.6 3.1-33.8C326 321.7 288.2 304 248 304z"></path>
                                            </svg>
                                        </li>
                                    )
                                })}
                            </ul>

                        </div>







                        <div class="flex justify-center my-12">
                            <div class="mb-3 " style={{ width: '100%' }}>
                                <label class="form-label text-sm inline-block mb-2 text-gray-500">Comment</label>

                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    class=" form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700  bg-white bg-clip-padding  border border-solid border-gray-300  rounded transition  ease-in-out  m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none "
                                    id="exampleFormControlTextarea1"
                                    rows="3"
                                    placeholder="a comment or additional info"
                                ></textarea>
                            </div>
                        </div>
                        <div style={{ margin: 'auto', marginTop: '66px', marginBottom: '100px', }}>
                            <button type="button"
                                style={{ margin: 'auto', display: 'flex', opacity: (submitLoading || imageUploadLoading ) ? '0.5' : '1', cursor: (submitLoading  || imageUploadLoading ) ? 'auto' : 'pointer', pointerEvents: (submitLoading  || imageUploadLoading ) ? 'none' : 'auto' }}
                                onClick={() => { uploadFile() }}
                                class="inline-block px-7 py-3 bg-green-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0  focus:shadow-lg transition duration-150 ease-in-out ">
                                Send Report

                            </button>
                            <p style={{ display: 'flex', justifyContent: 'center', opacity: (imageUploadLoading || submitLoading) ? '0.9' : '0', fontSize: '13px' }} >{imageUploadLoading && 'uploading image...'} {submitLoading && 'saving report...'}</p>

                        </div>
                    </div>
                </form>


            </div>

        </div>
    )
}

export default StudentReporting