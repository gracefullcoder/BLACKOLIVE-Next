"use client"
import { addUserDetails, getUserByMail, getUserByContact } from '@/src/actions/User';
import { UserData } from '@/src/types/user';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

function page() {
    const [user, setUser] = useState<UserData>({
        _id: "",
        name: "",
        email: "",
        profileImage: "",
        contact: 0,
        addresses: [],
        orderDetails: [],
        cart: [],
        membershipStatus: []
    });

    const [email, setEmail] = useState("")
    const [contact, setContact] = useState(0);
    const [isAddPresent, setIsAddPresent] = useState(false);
    const [isContact, setIsContact] = useState(false);

    const handleUser = async (e: any) => {
        e.preventDefault();
        console.log(email)
        const res: any = await getUserByMail(email);
        if (res.success) {
            if (res.user) {
                setUser(res.user);
            } else {
                toast.error("User doesn't exist!")
            }
        } else {
            toast.error("Failed to fetch user data")
        }
    }

    const handleUserPhno = async (e: any) => {
        e.preventDefault();
        console.log(email)
        const res: any = await getUserByContact(contact);
        if (res.success) {
            if (res.user) {
                setUser(res.user);
            } else {
                toast.error("User doesn't exist!")
            }
        } else {
            toast.error("Failed to fetch user data")
        }
    }

    const handleBasicInfo = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const res = await addUserDetails(email, formData)
    }


    useEffect(() => {
        if (user.contact) setIsContact(true);
        if (user?.addresses?.length) setIsAddPresent(true);
    }, [user])
    return (
        <div>create Order
            <form onSubmit={(e) => handleUser(e)}>
                <input type="email" onChange={(e: any) => setEmail(e.target.value)} className='border-black border' />
                <button>Check User</button>
            </form>

            <br />
            <br />

            //check by mobile number

            <h1>Check by phone number</h1>
            <form onSubmit={(e) => handleUserPhno(e)}>
                <input type="number" onChange={(e: any) => setContact(e.target.value)} className='border-black border' />
                <button>Check User</button>
            </form>

            {(!isAddPresent || !isContact) &&
                <form onSubmit={handleBasicInfo}>
                    add basic details
                    <br />
                    {/* <input type="email" name = 'con' value={email} onChange={(e: any) => setEmail(e.target.value)} className='border-black border' /> */}
                    <input type='tel' name='contact' className='border-black border' />
                    <input type="number" name='number' className='border-black border' />
                    <button>sub</button>
                </form>}
        </div>
    )
}


export default page