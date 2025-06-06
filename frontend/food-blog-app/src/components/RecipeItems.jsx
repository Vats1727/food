import React, { useEffect, useRef, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import foodImg from '../assets/foodRecipe.png'
import { BsStopwatchFill } from "react-icons/bs"
import { FaHeart, FaThumbsUp, FaPrint } from "react-icons/fa"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import axios from 'axios'

export default function RecipeItems() {
  const recipes = useLoaderData()
  const [allRecipes, setAllRecipes] = useState([])
  let path = window.location.pathname === "/myRecipe"
  let favItems = JSON.parse(localStorage.getItem("fav")) ?? []
  const [isFavRecipe, setIsFavRecipe] = useState(false)
  const navigate = useNavigate()
  const printRef = useRef(null)

  useEffect(() => {
    setAllRecipes([...recipes].sort((a, b) => b.likes - a.likes))
  }, [recipes])

  const onDelete = async (id) => {
    await axios.delete(`http://localhost:5000/recipe/${id}`)
    setAllRecipes(prev => prev.filter(recipe => recipe._id !== id))
    let filterItem = favItems.filter(recipe => recipe._id !== id)
    localStorage.setItem("fav", JSON.stringify(filterItem))
  }

  const favRecipe = (item) => {
    let filterItem = favItems.filter(recipe => recipe._id !== item._id)
    favItems = favItems.filter(recipe => recipe._id === item._id).length === 0 ? [...favItems, item] : filterItem
    localStorage.setItem("fav", JSON.stringify(favItems))
    setIsFavRecipe(prev => !prev)
  }

  const handleLike = async (id) => {
    try {
      const res = await axios.post(`http://localhost:5000/recipe/like/${id}`, {}, {
        headers: {
          'authorization': 'bearer ' + localStorage.getItem("token")
        }
      })
      setAllRecipes(prev =>
        [...prev.map(r => r._id === id ? res.data : r)].sort((a, b) => b.likes - a.likes)
      )
    } catch (err) {
      console.error("Like failed", err.response?.data || err.message)
      alert("Error liking recipe.")
    }
  }

  const printRecipe = (item) => {
    const printContent = `
      <div>
        <h2>${item.title}</h2>
        <img src="http://localhost:5000/images/${item.coverImage}" width="300" />
        <p><strong>Time:</strong> ${item.time}</p>
        <p><strong>Ingredients:</strong></p>
        <ul>${item.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
        <p><strong>Instructions:</strong></p>
        <p>${item.instructions}</p>
        <p><strong>Likes:</strong> ${item.likes || 0}</p>
      </div>
    `
    const newWindow = window.open('', '', 'width=800,height=600')
    newWindow.document.write('<html><head><title>Print Recipe</title></head><body>')
    newWindow.document.write(printContent)
    newWindow.document.write('</body></html>')
    newWindow.document.close()
    newWindow.print()
  }

  return (
    <div className='card-container'>
      {
        allRecipes?.map((item, index) => (
          <div key={index} className='card' onDoubleClick={() => navigate(`/recipe/${item._id}`)}>
            <img src={`http://localhost:5000/images/${item.coverImage}`} width="120px" height="100px" />
            <div className='card-body'>
              <div className='title'>{item.title}</div>
              <div className='icons'>
                <div className='timer'><BsStopwatchFill />{item.time}</div>
                {
                  (!path) ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <FaHeart onClick={() => favRecipe(item)}
                        style={{ color: (favItems.some(res => res._id === item._id)) ? "red" : "" }} />
                      <FaThumbsUp style={{ cursor: "pointer" }} onClick={() => handleLike(item._id)} />
                      <FaPrint style={{ cursor: "pointer" }} onClick={() => printRecipe(item)} />
                      <span style={{ fontSize: "12px" }}>Likes: {item.likes || 0}</span>
                    </div>
                  ) : (
                    <div className='action'>
                      <Link to={`/editRecipe/${item._id}`} className="editIcon"><FaEdit /></Link>
                      <MdDelete onClick={() => onDelete(item._id)} className='deleteIcon' />
                      <FaPrint style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => printRecipe(item)} />
                      <div style={{ fontSize: "12px", marginTop: "5px" }}>Likes: {item.likes || 0}</div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}
