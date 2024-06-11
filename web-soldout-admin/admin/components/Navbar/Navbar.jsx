import React from 'react'
import './Navbar.css'
import { assets } from '../../src/assets/assets'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={assets.logo} alt="" className='logo'/>
        <img src={assets.avatar} alt=""  className='profile'/>
    </div>
  )
}

export default Navbar