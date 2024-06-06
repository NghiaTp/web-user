import React from 'react'
import './ExploreProduct.css'
import { categories_list } from '../../assets/assets'

const ExploreProduct = ({categories, setCategories}) => {
  return (
    <div className='categories' id='categories'>
      <div className="categories-list">
        {categories_list.map((item,index) => {
          return(
            <div onClick={() => setCategories(prev=>prev===item.categories_name?"All":item.categories_name)} key={index} className='categories-list-item'>
              <img className={categories===item.categories_name?"active":""} src={item.categories_image} alt="" style={{height:90, borderRadius: 9999}}/>
              <p>{item.categories_name}</p>
            </div>
          )
        })}
      </div>
      <hr />
    </div>
  )
}

export default ExploreProduct