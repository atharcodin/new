import React, { useState, useEffect, useReducer } from 'react'
import MapInput from '../components/MapInput'
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase-config'
import { ref, uploadBytes, getDownloadURL, listAll, list } from "firebase/storage";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";
import { BsFillCalendarDateFill } from 'react-icons/bs'
import { HiFaceFrown } from 'react-icons/hi'
import SchoolLogo from '../media/csirlogo.png'
import { Link } from 'react-router-dom'
import Universiy from '../media/upm.jpg'
import StudentReporting from '../components/StudentReporting';
import OfficersReportsList from '../components/OfficersReportsList';
//const SERVER_URL = 'https://us-central1-csir-bcb22.cloudfunctions.net/app';
const SERVER_URL = ' https://becf-196-235-33-133.eu.ngrok.io';

function HomePage() {

    function RandomNumber() {
        return Math.floor(1000 + Math.random() * 9000)
    }

    const [, forceUpdate] = useReducer(x => x + 1, 0);



    const navigate = useNavigate();
    useEffect(() => {
        if ((!localStorage.getItem('matric'))) {
            if (!sessionStorage.getItem('matric')) {
                navigate("/");
            }

        }
    }, [])

    const [userData, setUserData] = useState(null)

    useEffect(() => {
        //check if userData exists in session storage 
        if (sessionStorage.getItem('userData') && 0) {
            setUserData(JSON.parse(sessionStorage.getItem('userData')))
        } else if (localStorage.getItem('userData') && 0) {
            setUserData(JSON.parse(localStorage.getItem('userData')))
        }
        else {
            //if not, get it from firebase
            var matric;
            if (localStorage.getItem('matric')) {
                matric = localStorage.getItem('matric')
            } else {
                matric = sessionStorage.getItem('matric')
            }

            const q = query(collection(db, "accs"), where("matric", "==", matric));
            const querySnapshot = getDocs(q);
            querySnapshot.then((querySnapshot) => {
                var matrics = []
                querySnapshot.forEach((doc) => {
                    matrics.push(doc.data())
                });
                setUserData(matrics[0])

                if (!matrics[0]) {
                    navigate("/");
                }

            })
        }
    }, [])

    //if user data is not null, remove password and save it to session storage 
    useEffect(() => {
        if (userData) {
            var newUserData = userData
            delete newUserData.password
            //if matric is in session storage, save to session storage 
            if (sessionStorage.getItem('matric')) {

                sessionStorage.setItem('userData', JSON.stringify(newUserData))
            } else {
                localStorage.setItem('userData', JSON.stringify(newUserData))
            }

        }
    }, [userData])

    console.log(userData)

    const [openAlert, setOpenAlert] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('success');

    const [alertMessage, setAlertMessage] = useState('')
    useEffect(() => {
        if (!openAlert) return
        //set open alert to false after 5 seconds 
        setTimeout(() => {
            document.getElementById('alertMessage').classList.add('fade-out')
        }, 1000)
        setTimeout(() => {
            setOpenAlert(false)
            document.getElementById('alertMessage').classList.remove('fade-out')

        }, 2500)

    }, [openAlert])


    //upload image on freeimage.host using api key 6d207e02198a847aa98d0a2a901485a5
    //example call GET http://freeimage.host/api/1/upload/?key=12345&source=http://somewebsite/someimage.jpg&format=json




    return (
        <div className='university-background'  >
            {/* <img src={Universiy} style={{position:'fixed'}}  /> */}

            <img src={SchoolLogo} alt="school logo" className="school-logo" />


            {(userData?.accountType == 'student') && <StudentReporting userData={userData} setOpenAlert={setOpenAlert} setAlertMessage={setAlertMessage} setAlertSeverity={setAlertSeverity} />}
            {(userData?.accountType == 'official') && <OfficersReportsList userData={userData} setOpenAlert={setOpenAlert} setAlertMessage={setAlertMessage} setAlertSeverity={setAlertSeverity} />}

   

            {openAlert && <div id='alertMessage'>
                {alertSeverity == 'success' && <div style={{ position: 'fixed', bottom: '10%', left: '50%', transform: 'translate(-50%, -50%)' }} class="fade-in  bg-green-100 rounded-lg py-5 px-6 mb-3 text-base text-green-700 inline-flex items-center w-4/5 " role="alert">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" class="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
                    </svg>
                    {alertMessage}
                </div>}

                {alertSeverity == 'error' && <div style={{ position: 'fixed', bottom: '10%', left: '50%', transform: 'translate(-50%, -50%)' }} class="fade-in  bg-red-100 rounded-lg py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-4/5 " role="alert">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="exclamation-circle" class="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-110.28 0-200-89.72-200-200S145.72 56 256 56s200 89.72 200 200-89.72 200-200 200zm24-304h-48c-6.627 0-12 5.373-12 12v144c0 6.627 5.373 12 12 12h48c6.627 0 12-5.373 12-12V192c0-6.627-5.373-12-12-12zm0 192h-48v-48h48v48z"></path>
                    </svg>
                    {alertMessage}

                </div>}
            </div>}

            {userData && <Link className=' px-6 text-red-600 text-base font-semibold mb-12  w-full  '

                style={{ top: '10px', left: '10px', zIndex: '1000', width: 'fit-content' }}
                onClick={() => {
                    setUserData(null);
                    //clear session and loca lstorage matric
                    localStorage.removeItem('matric')
                    sessionStorage.removeItem('matric')

                    localStorage.removeItem('userData')
                    sessionStorage.removeItem('userData')

                    window.location.reload()
                }}
            >Logout</Link>}



        </div>
    )
}

export default HomePage