const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const isPasswordValid = (password) => /^[0-9]{3,10}$/.test(password)
const isNameValid = (name) => /^[A-Za-z]+$/.test(name)


const userSignUp = async (req, res) => {
  const { email, password, firstName, lastName, isBpPatient, isDiabetic, foodPreference } = req.body

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "All fields are required" })
  }

  if (!isEmailValid(email)) {
    return res.status(400).json({ message: "Invalid email format" })
  }

  if (!isPasswordValid(password)) {
    return res.status(400).json({ message: "Password must be numeric and 3-10 digits long" })
  }

  if (!isNameValid(firstName) || !isNameValid(lastName)) {
    return res.status(400).json({ message: "First and last names must contain letters only" })
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" })
  }

  const hashPwd = await bcrypt.hash(password, 10)
  const newUser = await User.create({
    email,
    password: hashPwd,
    firstName,
    lastName,
    isBpPatient,
    isDiabetic,
    foodPreference
  })

  const token = jwt.sign({ email, id: newUser._id }, process.env.SECRET_KEY)
  return res.status(200).json({ token, user: newUser })
}

const userLogin = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" })
  }

  if (!isEmailValid(email)) {
    return res.status(400).json({ message: "Invalid email format" })
  }

  if (!isPasswordValid(password)) {
    return res.status(400).json({ message: "Password must be numeric and 3-10 digits long" })
  }

  const user = await User.findOne({ email })
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email, id: user._id }, process.env.SECRET_KEY)
    return res.status(200).json({ token, user })
  } else {
    return res.status(400).json({ error: "Invalid credentials" })
  }
}


const getUser = async (req, res) => {
  const user = await User.findById(req.params.id)
  res.json({ email: user.email })
}

module.exports = {
  userSignUp,
  userLogin,
  getUser
}
