const express = require("express")
const router = express.Router()
const { userLogin, userSignUp, getUser } = require("../controller/user")
const User = require("../models/user")

router.post("/signUp", userSignUp)
router.post("/login", userLogin)
router.get("/user/:id", getUser)


router.get("/allUsers", async (req, res) => {
  const users = await User.find({}, { password: 0 })
  res.json(users)
})


router.put("/user/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updatedUser)
  } catch (error) {
    res.status(400).json({ message: "Update failed", error })
  }
})


router.delete("/user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(400).json({ message: "Delete failed", error })
  }
})

module.exports = router
