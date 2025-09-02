import React from 'react'

function register() {
  return (
    <>
        <div className="registerBox">
            <h2>User Management System</h2>
        <div className="registerForm">
            <h2>Register</h2>
            <form action="">
                <div className="inputField">
                    <label for="name"><i class="fa-solid fa-user"></i></label>
                    <input type="text" name="" id="" placeholder='Enter your name...'/>
                </div>
                <div className="inputField">
                    <label for="email"><i class="fa-solid fa-envelope"></i></label>
                    <input type="email" name="" id="" placeholder='Enter your email address...'/>
                </div>
                <div className="inputField">
                    <i class="fa-solid fa-lock"></i>
                <input type="password" name="" placeholder='Enter your password'/>
                </div>
            </form>
            <p classN>Already have an account  <a href=''>Login here</a></p>
            <button>Register</button>
        </div>
        </div>
    
    </>
  )
}

export default register
