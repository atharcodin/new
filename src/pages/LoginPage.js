import React, { useState, useEffect } from 'react'
import SchoolImage from '../media/school.jpg'
import CrimeImage from '../media/crime.jpg'
import PoliceImage from '../media/police4.svg'
import clsx from 'clsx';
//import {db} from firebase-config.js that's in root directory of project
import { db } from '../firebase-config'

//import link form react router 
import { Link } from 'react-router-dom'

import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, serverTimestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';


function LoginPage() {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('matric') || sessionStorage.getItem('matric')) {
            navigate("/Home");
        } else {
            navigate("/");
        }
    }, [])




    const [matric, setMatric] = useState('')
    const [password, setPassword] = useState('')

    const [rememberMe, setRememberMe] = useState(false)


    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const [success, setSuccess] = useState(false)

    const Login = async (matric, password) => {
        if (!matric || !password) { setError('Please fill in all fields'); return; }
        setLoading(true)

        matric = matric.toLowerCase().replace(/\s/g, '');
        password = password.toLowerCase();

        const q = query(collection(db, "accs"), where("matric", "==", matric), where("password", "==", password));

        const querySnapshot = await getDocs(q);

        var matrics = []
        querySnapshot.forEach((doc) => {
            matrics.push(doc.data())
        });

        if (matrics.length > 0) {

            setSuccess(true)
            setError('')
            console.log('success')

            if (rememberMe) {
                localStorage.setItem('matric', matrics[0].matric)
            } else {
                sessionStorage.setItem('matric', matrics[0].matric)
            }
            navigate("/Home");

        } else {
            setError("Invalid credentials !")
        }
        setLoading(false)
        console.log(matrics);

    };

    return (
        <div style={{ background: 'grey', height: '100vh' }} >
            {/* add vignette from bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0" />


            <img src={SchoolImage} className='school-image transition ease-in duration-500	' alt="School" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />


            <div className='LoginCard shadow-2xl' >
                <section className="">
                    <div className="container px-6 py-8 h-full ">
                        <div className="flex justify-center items-center flex-wrap text-gray-800">

                            <div className="w-10/12 ">

                                <h2 className=' text-4xl  my-12 font-bold  flex justify-center '  >Login</h2>


                                <form>
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            className="form-control block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            placeholder="MATRIC"
                                            value={matric}
                                            onChange={(e) => setMatric(e.target.value)}

                                        />
                                    </div>

                                    <div className="mb-4">
                                        <input
                                            type="password"
                                            className="form-control block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mb-12">
                                        <div className="form-group form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                                id="exampleCheck3"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}

                                            />
                                            <label className="form-check-label inline-block text-gray-800 text-sm " htmlFor="exampleCheck2"
                                            >Remember me</label>
                                        </div>

                                    </div>


                                    <button
                                        type="submit"
                                        className={clsx("inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full", loading && 'cursor-not-allowed  bg-gray-400 hover:bg-gray-400 focus:bg-gray-400 ')}
                                        data-mdb-ripple="true"
                                        data-mdb-ripple-color="light"
                                        style={{height:'44px'}}
                                        onClick={(e) => { e.preventDefault(); Login(matric, password, rememberMe) }}
                                    >
                                        {loading ? <div role="status">
                                            <svg style={{ height: '20px', scale: '1.2' }} className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                            <span className="sr-only">Loading...</span>
                                        </div> : 'Sign in'}
                                    </button>
                                    {error && <span className='text-red-500' > {error}</span>}


                                     {/* <div
                                        className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5"
                                    >
                                        <p className="text-center font-semibold mx-4 mb-0">OR</p>
                                    </div>

                                    <Link
                                        className="text-blue-600 hover:text-blue-700 font-semibold text-base cursor-pointer  transition duration-300 ease-in-out mb-4 w-full flex justify-center "
                                        style={{pointerEvents:'none', cursor:'not-allowed', opacity:'0.5', filter:'grayscale(100%)'}}
                                        
                                        to="/join"
                                    >
                                        Create an account
                                    </Link>  */}

                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default LoginPage