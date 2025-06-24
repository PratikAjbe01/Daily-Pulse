'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'


const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const { user, isLoaded } = useUser()
   const [userData,setUserData]=useState();



  useEffect(() => {
    const syncUserWithDB = async () => {
   
      if (!isLoaded || !user) return

      try {
        const res = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name:user?.username,
            email: user?.primaryEmailAddress?.emailAddress,
          }),
        })

        const data = await res.json()
        setUserData(data);
      console.log('User saved to neondb',data);
 
      } catch (error) {
        console.error('User sync error:', error)
      } finally {
     
      }
    }

    syncUserWithDB()
  }, [user, isLoaded])

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  )
}

export const useAppUser = () => useContext(UserContext)