import React, { useState } from 'react'
import axios from 'axios'
import './InputForm.css' 

export default function InputForm({ setIsOpen }) {
  const [formData, setFormData] = useState({
    email: "", password: "", firstName: "", lastName: "",
    isBpPatient: "No", isDiabetic: "No", foodPreference: "Veg"
  })
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")

  const validateForm = () => {
    const { email, password, firstName, lastName } = formData
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const numericRegex = /^[0-9]{3,10}$/
    const nameRegex = /^[A-Za-z]+$/

    if (!email || !emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (!numericRegex.test(password)) {
      setError("Password must be numeric and 3-10 digits long")
      return false
    }
    if (isSignUp) {
      if (!nameRegex.test(firstName)) {
        setError("First name should contain letters only")
        return false
      }
      if (!nameRegex.test(lastName)) {
        setError("Last name should contain letters only")
        return false
      }
    }
    setError("")
    return true
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const endpoint = isSignUp ? "signUp" : "login"
    try {
      const res = await axios.post(`http://localhost:5000/${endpoint}`, formData)
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      setIsOpen()
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "An error occurred")
    }
  }

  return (
    <div className="form-wrapper">
      <form className='form' onSubmit={handleOnSubmit}>
        <div className='form-control'>
          <label>Email</label>
          <input
            type="email"
            className='input'
            required
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className='form-control'>
          <label>Password</label>
          <input
            type="password"
            className='input'
            required
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        {isSignUp && (
          <>
            <div className='form-control'>
              <label>First Name</label>
              <input
                type="text"
                className='input'
                required
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className='form-control'>
              <label>Last Name</label>
              <input
                type="text"
                className='input'
                required
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <div className='form-control'>
              <label>Are you a BP patient?</label>
              <select
                className='input'
                onChange={(e) => setFormData({ ...formData, isBpPatient: e.target.value })}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div className='form-control'>
              <label>Are you a Diabetic patient?</label>
              <select
                className='input'
                onChange={(e) => setFormData({ ...formData, isDiabetic: e.target.value })}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div className='form-control'>
              <label>Diet Preference</label>
              <select
                className='input'
                onChange={(e) => setFormData({ ...formData, foodPreference: e.target.value })}
              >
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Vegan">Vegan</option>
                <option value="All">All</option>
              </select>
            </div>
          </>
        )}

        <button type='submit'>{isSignUp ? "Sign Up" : "Login"}</button><br />
        {error && <h6 className='error'>{error}</h6>}
        <p onClick={() => setIsSignUp(prev => !prev)}>
          {isSignUp ? "Already have an account?" : "Create new account"}
        </p>
      </form>
    </div>
  )
}
