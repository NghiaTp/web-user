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
                <img src={assets.order_list} alt="" className='icon'/>
                <p className='title'>Orders</p>
            </NavLink>
            <NavLink className="slidebar-option" to='/cancel-order'>
                <img src={assets.cancelled_order} alt="" className='icon'/>
                <p className='title'>Cancelled Order</p>
            </NavLink>
            <NavLink className="slidebar-option" to='/categories'>
                <img src={assets.category} alt="" className='icon'/>
                <p className='title'>Categories & Brand</p>
            </NavLink>
            <NavLink className="slidebar-option" to='/user-manager'>
                <img src={assets.user_icon} alt="" className='icon'/>
                <p className='title'>Quản lí User</p>
            </NavLink>
            <NavLink className="slidebar-option" to='/staff-manager'>
                <img src={assets.staff_icon} alt="" className='icon'/>
                <p className='title'>Quản lí Staff</p>
            </NavLink>
            <NavLink className="slidebar-option" to='/statistical'>
                <img src={assets.statistical_icon} alt="" className='icon'/>
                <p className='title'>Thông kê doanh số</p>
            </NavLink>
        </div>
    </div>
  ) 
}

export default Slidebar