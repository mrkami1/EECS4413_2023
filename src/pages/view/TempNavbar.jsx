import React from 'react'
import { Link } from 'react-router-dom'

export const TempNavbar = () => {
  return (
    <div className='navbox'>
        <div className='leftside'>
            Logo IMG
        </div>
        <div className='rightside'>
            <Link to='/Register' className='navlinks'>Register</Link>
            <Link to='/Login' className='navlinks'>Login</Link>
        </div>
    </div>
  )
}

