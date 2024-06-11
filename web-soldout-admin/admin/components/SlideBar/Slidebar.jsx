import React from 'react'
import './Slidebar.css'
import { assets } from '../../src/assets/assets'
import {NavLink} from 'react-router-dom'

const Slidebar = () => {
  return (
    <div className='slidebar'>
        <div className="slidebar-options">
            <NavLink className="slidebar-option" to="/add">
                <img src={assets.add_logo} alt="" className='icon'/>
                <p className='title'>Add Product</p>
            </NavLink>
            <NavLink className="slidebar-option" to='/list'>
                <img src={assets.check_pakage} alt="" className='icon'/>
                <p className='title'>List Product</p>
            </NavLink>
            <NavLink className="slidebar-option" to='/orders'>
                <img src={assets.check_pakage} alt="" className='icon'/>
                <p className='title'>Orders</p>
            </NavLink>
        </div>
    </div>
  ) 
}

export default Slidebar