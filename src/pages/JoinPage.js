import React, { useState, useEffect } from 'react'
import PeopleImage from '../media/people.jpg'
import clsx from 'clsx';
//import {db} from firebase-config.js that's in root directory of project
import { db } from '../firebase-config'
import { AiFillEye } from 'react-icons/ai'
//import link form react router 
import { Link } from 'react-router-dom'

import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";

import { useNavigate } from 'react-router-dom';


function JoinPage() {
    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [matric, setMatric] = useState('')
    const [password, setPassword] = useState('')

    const [accountType, setAccountType] = useState('student')

    const [email, setEmail] = useState('')
    const [number, setNumber] = useState('')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const [showPassword, setShowPassword] = useState(false)

    const [success, setSuccess] = useState(false)
    const [telegramUsername, setTelegramUsername] = useState('')

    const Join = async () => {
        if (!name || !matric || !password || !accountType || !email || !telegramUsername) { setError('Please fill in all fields'); return; }

        setLoading(true)
        setError('')

        setMatric(matric => (matric.toLowerCase().replace(/\s/g, '')))
        setPassword(password => (password.toLowerCase()))

        var alreadyExists = false

        //check if matric number already exists
        const q = query(collection(db, "accs"), where("matric", "==", matric));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            if (doc.data().matric === matric) {
                setError('Matric number already exists'); setLoading(false);
                alreadyExists = true
            }

        });


        if (alreadyExists) return;

        //add new user to firebase collection accs
        const docRef = await addDoc(collection(db, "accs"), {
            name: name,
            matric: matric,
            password: password,
            accountType: accountType,
            email: email,
            //number: number,
            telegramUsername: telegramUsername,
            createdAt: serverTimestamp()
        });
        //check if there are not errors 
        if (docRef.id) {
            setSuccess(true)
            setError('')
            console.log('success')

            navigate("/");


        } else {
            setError("Something went wrong !")
        }
        setLoading(false)
    };



   
    return (
        <div style={{ background: 'grey', height: '100vh' }} >
            {/* add vignette from bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />


            <img src={PeopleImage} className='school-image transition ease-in duration-500	' alt="School" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

            <div className='LoginCard shadow-2xl overflow-x-scroll   ' >
                <Link className='absolute p-4 text-blue-400 text-sm'
                    to='/'
                >Go back to login page</Link>
                <section class="">
                    <div class="container px-6 py-8 h-full ">
                        <div class="flex justify-center items-center flex-wrap text-gray-800">

                            <div class="w-11/12 ">

                                <h2 className=' text-3xl  my-12 font-bold flex justify-center ' style={{ whiteSpace: 'nowrap' }}  >Create an account</h2>


                                <form>

                                    <div class="mb-4">
                                        <input
                                            type="text"
                                            class="form-control block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            placeholder="Full Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}

                                        />
                                    </div>
                                    <div class="mb-4">
                                        <input
                                            type="text"
                                            class="form-control block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            placeholder="MATRIC"
                                            value={matric}
                                            onChange={(e) => setMatric(e.target.value)}

                                        />
                                    </div>

                                    <div class="mb-4 flex items-center justify-end">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            class="form-control block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <AiFillEye style={{ position: 'absolute', cursor: 'pointer', marginRight: '11px', opacity: showPassword ? '1' : '0.4' }}
                                            className='transition '
                                            onClick={() => {
                                                setShowPassword(!showPassword)
                                            }} />
                                    </div>




                                    <div className='flex justify-center text-sm my-6' >
                                        <p className='opacity-80 mx-2  ' >I am joining as</p>
                                        <div class="flex justify-center">
                                            <div>
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                                        type="radio" name="flexRadioDefault" id="flexRadioDefault1"
                                                        value='student'
                                                        onChange={(e) => setAccountType(e.target.value)}
                                                        checked={accountType === 'student'}
                                                    />
                                                    <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault1">
                                                        a Student
                                                    </label>
                                                </div>
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                                        type="radio" name="flexRadioDefault" id="flexRadioDefault2"
                                                        value='official'
                                                        onChange={(e) => setAccountType(e.target.value)}
                                                        checked={accountType === 'official'}
                                                    />
                                                    <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault2">
                                                        an Official
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div class="mb-4">
                                        <input
                                            type="email"
                                            class="form-control block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    {/* <div class="mb-4">
                                        <input
                                            class="form-control block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            placeholder="Whatsapp Number"
                                            value={number}
                                            onChange={(e) => setNumber(e.target.value)}
                                        />
                                    </div> */}
                                    <div class="mb-4">
                                        <input
                                            class="form-control block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            placeholder="Telegram Username"
                                            value={telegramUsername}
                                            onChange={(e) => setTelegramUsername(e.target.value)}
                                        />
                                    </div>




                                    <button
                                        type="submit"
                                        className={clsx("inline-block px-7 my-6 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full", loading && 'cursor-not-allowed  bg-gray-400 hover:bg-gray-400 focus:bg-gray-400 ')}
                                        data-mdb-ripple="true"
                                        data-mdb-ripple-color="light"
                                        style={{ height: '44px' }}
                                        onClick={(e) => { e.preventDefault(); Join() }}
                                    >
                                        {loading ? <div role="status">
                                            <svg style={{ height: '20px', scale: '1.2' }} class="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                            <span class="sr-only">Loading...</span>
                                        </div> : 'Join'}
                                    </button>
                                    {error && <span className='text-red-500' > {error}</span>}



                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default JoinPage