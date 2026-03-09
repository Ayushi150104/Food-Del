import React from 'react'
import './AppDownload.css'
import {assets} from '../../assets/assets.js'
const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
        <p>
        Download our app to order food on the go!<br/>Tomato App
        </p>
        <div className="app-download-platforms">
            <img src={assets.play_store} alt="" />
            <img src={assets.app_store} alt="" />
        </div>
    </div>
  )
}

export default AppDownload