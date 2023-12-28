import React from 'react'

const Toast = ({msg, setmsg}) => {

    const handleClose = () => {
        setmsg(null)
    }
  return (
    <div className={`toast ${msg? "":"hidden"} `} >
    <div className='closeBtn' onClick={handleClose}>X</div>
     {msg && (
        <p>{msg}</p>
      )}
    </div>
  )
}

export default Toast
