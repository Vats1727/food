import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [editIndex, setEditIndex] = useState(null)
  const [editUser, setEditUser] = useState({})

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = () => {
    axios.get("http://localhost:5000/allUsers")
      .then(res => setUsers(res.data))
  }

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/user/${id}`)
    fetchUsers()
  }

  const handleEdit = (index) => {
    setEditIndex(index)
    setEditUser({ ...users[index] })
  }

  const handleCancel = () => {
    setEditIndex(null)
    setEditUser({})
  }

  const handleUpdate = async () => {
    await axios.put(`http://localhost:5000/user/${editUser._id}`, editUser)
    setEditIndex(null)
    fetchUsers()
  }

  const handleChange = (e) => {
    setEditUser(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className='container'>
      <h2>All Registered Users</h2>
      <table className='table' border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>BP Patient</th>
            <th>Diabetic</th>
            <th>Food Preference</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            editIndex === index ? (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td><input name="firstName" value={editUser.firstName} onChange={handleChange} /></td>
                <td><input name="lastName" value={editUser.lastName} onChange={handleChange} /></td>
                <td>
                  <select name="isBpPatient" value={editUser.isBpPatient} onChange={handleChange}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
                <td>
                  <select name="isDiabetic" value={editUser.isDiabetic} onChange={handleChange}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
                <td>
                  <select name="foodPreference" value={editUser.foodPreference} onChange={handleChange}>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Vegan">Vegan</option>
                    <option value="All">All</option>
                  </select>
                </td>
                <td>
                  <button onClick={handleUpdate}>Update</button>
                  <button onClick={handleCancel}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.isBpPatient}</td>
                <td>{user.isDiabetic}</td>
                <td>{user.foodPreference}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  )
}
