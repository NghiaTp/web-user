import soldout_icon from '../assets/image/soldout_logo.png'
import basket_icon from '../assets/image/shopping-basket-icon.png'
import search_icon from '../assets/image/icon_search.png'
import account_icon from '../assets/image/account_icon.png'
import left_icon from '../assets/image/left.png'
import right_icon from '../assets/image/right.png'
import rating_icon from '../assets/image/rating_icon.png'
import add_icon from '../assets/image/add_icon.png'
import remove_icon from '../assets/image/remove_icon.png'
import cross_icon from './image/cross_icon.png'
import profile_icon from './image/avatar.jpg'
import logout_icon from './image/logout_icon.png'
import favorite_icon from './image/favorite_icon.png'
import order_list from './image/order_list.png'


//social media icon

import facebook_icon from './image/facebook_icon.png'
import instagram_icon from './image/instagram_icon.jpg'
import tiktok_icon from './image/tiktok_icon.png'


//header-slide

import slide_1 from '../assets/image/iphone-15-pro-slide.jpg'
import slide_2 from '../assets/image/samsung-galaxy-s24-slide.jpg'
import slide_3 from '../assets/image/nubia-neo-2-slide.jpg'
import slide_4 from '../assets/image/v30-vivo-slide.jpg'
import slide_5 from '../assets/image/xiaomi-14-slide.jpg'
import slide_6 from '../assets/image/minor-iv-slide.jpg'
import slide_7 from '../assets/image/huawei-watch-slide.jpg'
import slide_8 from '../assets/image/asus-tuf-slide.jpg'

import header_image from '../assets/image/laptop.jpg'
import samsung_galaxy from '../assets/image/samsung_galaxy_s24.jpeg'
import iphone from '../assets/image/iphone_15.png'

//categories

import phone_categories from '../assets/image/phone_categories.jpg'
import latop_categories from '../assets/image/latop_categories.jpg'
import tablet_categories from '../assets/image/tablet_categories.jpg'
import smartwatch_categories from '../assets/image/watch_categories.jpg'
import pod_categories from '../assets/image/pod_categories.jpg'
import loa_categories from '../assets/image/loa_categories.jpg'
import thenho_categories from '../assets/image/thenho_categories.jpg'
import phukien_categories from '../assets/image/phukien_categories.jpg'
import mayanh_categories from '../assets/image/mayanh_categories.jpg'
import camera_categories from '../assets/image/camera_categories.jpg'


// product data

import iphone_13_promax from '../assets/image/iphone_13_promax.jpg'
import ipad_air_5 from '../assets/image/ipad_air_5.jpg'
import ipad_gen_9 from '../assets/image/ipad_gen_9.jpg'
import ipad_gen_10 from '../assets/image/ipad_gen_10.jpg'
import ipad_mini_6 from '../assets/image/ipad_mini_6.jpg'
import macbook_pro_m1 from '../assets/image/macbook_pro_m1.jpg'
import macbook_air_m1 from '../assets/image/macbook_air_m1.jpg'
import samsung_galaxy_bodspro from '../assets/image/samsung_galaxy_bodspro.jpg'
import samsung_galaxy_s23_fe from '../assets/image/samsung_galaxy_s23_fe.jpg'
import samsung_galaxy_s23_plus from '../assets/image/samsung_galaxy_s23_plus.jpg'
import samsung_galaxy_s23 from '../assets/image/samsung_galaxy_s23.jpg'
// import samsung_galaxy_s24 from '../assets/image/samsung_galaxy_s24.jpeg';

export const assets = {
    add_icon,
    cross_icon,
    remove_icon,
    slide_1,
    slide_2,
    slide_3,
    slide_4,
    slide_5,
    slide_6,
    slide_7,
    slide_8,
    soldout_icon,
    basket_icon,
    search_icon,
    account_icon,
    rating_icon,
    left_icon,
    right_icon,
    header_image,
    samsung_galaxy,
    iphone,
    phone_categories,
    latop_categories,
    tablet_categories,
    smartwatch_categories,
    phukien_categories,
    thenho_categories,
    pod_categories,
    loa_categories,
    iphone_13_promax,
    macbook_air_m1,
    macbook_pro_m1,
    ipad_air_5,
    ipad_gen_10,
    ipad_mini_6,
    ipad_gen_9,
    samsung_galaxy_bodspro,
    samsung_galaxy_s23,
    // samsung_galaxy_s24,
    samsung_galaxy_s23_fe,
    facebook_icon,
    instagram_icon,
    tiktok_icon,
    samsung_galaxy_s23_plus,
    profile_icon,
    logout_icon,
    favorite_icon,
    order_list
}

// data danh mục

export const categories_list = [
    {
        categories_name: "Điện thoại",
        categories_image: phone_categories
    },
    {
        categories_name: "Laptop",
        categories_image: latop_categories
    },
    {
        categories_name: "Tablet",
        categories_image: tablet_categories
    },
    {
        categories_name: "Máy ảnh",
        categories_image: mayanh_categories
    },
    {
        categories_name: "Phụ kiện",
        categories_image: phukien_categories
    },
    {
        categories_name: "Smartwatch",
        categories_image: smartwatch_categories
    },
    {
        categories_name: "Loa",
        categories_image: loa_categories
    },
    {
        categories_name: "Camera",
        categories_image: camera_categories
    },
    {
        categories_name: "Tai nghe",
        categories_image: pod_categories
    },
]

// product list

export const product_list = [
    {
        _id: '1',
        name: 'Iphone 13 Pro Max',
        image: iphone_13_promax,
        price: 23000000,
        description: 'Trả góp 0%',
        categories: 'Điện thoại',
        brand: 'Apple'
    },
    {
        _id: '2',
        name: 'Macbook Air M1',
        image: macbook_air_m1,
        price: 23000000,
        description: 'Trả góp 0%',
        categories: 'Laptop',
        brand: 'Apple'
    },
    {
        _id: '3',
        name: 'Macbook Pro M1',
        image: macbook_pro_m1,
        price: 23000000,
        description: 'Trả góp 0%',
        categories: 'Laptop',
        brand: 'Apple'
    },
    {
        _id: '4',
        name: 'Ipad Air 5',
        image: ipad_air_5,
        price: 23000000,
        description: 'Trả góp 0%',
        categories: 'Tablet',
        brand: 'Apple'
    },
    {
        _id: '5',
        name: 'Ipad Gen 10',
        image: ipad_gen_10,
        price: 23000000,
        description: 'Trả góp 0%',
        categories: 'Tablet',
        brand: 'Apple'
    },
    {
        _id: '6',
        name: 'Ipad Gen 9',
        image: ipad_gen_9,
        price: 23000000,
        description: 'Trả góp 0%',
        categories: 'Tablet',
        brand: 'Apple'
    },
    {
        _id: '7',
        name: 'Ipad mini 6',
        image: ipad_mini_6,
        price: 23000000,
        description: 'Trả góp 0%',
        categories: 'Tablet',
        brand: 'Apple'
    },
    {
        _id: '8',
        name: 'Samsung Galaxy 23 FE',
        image: samsung_galaxy_s23_fe,
        price: 23000000,
        description: 'Trả góp 0%',
        categories: 'Điện thoại',
        brand: 'Samsung'
    },
    {
        _id: '9',
        name: 'Samsung Galaxy 23',
        image: samsung_galaxy_s23,
        price: 23000000,
        description: 'Trả góp 0%',
        categories: 'Điện thoại',
        brand: 'Samsung'
    },
    {
        _id: '10',
        name: 'Samsung Galaxy 23 Plus',
        image: samsung_galaxy_s23_plus,
        price: 23000000,
        description: 'Trả góp 0%',
        categories: 'Điện thoại',
        brand: 'Samsung'
    },
    {
        _id: '11',
        name: 'Samsung Galaxy Bods Pro',
        image: samsung_galaxy_bodspro,
        price: 23000000,
        description: 'Trả góp 0%',
        categories: 'Tai nghe',
        brand: 'Samsung'
    },
]