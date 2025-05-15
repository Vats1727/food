const express=require("express")
const { getRecipes,getRecipe,addRecipe,editRecipe,deleteRecipe,upload} = require("../controller/recipe")
const verifyToken = require("../middleware/auth")
const router=express.Router()
const Recipes = require("../models/recipe")

router.get("/",getRecipes) 
router.get("/:id",getRecipe) 
router.post("/",upload.single('file'),verifyToken ,addRecipe) 
router.put("/:id",upload.single('file'),editRecipe) 
router.delete("/:id",deleteRecipe) 

router.post("/like/:id", async (req, res) => {
    try {
      const recipe = await Recipes.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: 1 } },
        { new: true }
      )
  
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" })
      }
      
  
      res.json(recipe)
    } catch (err) {
      res.status(400).json({ message: "Error liking recipe", error: err.message })
    }
  })
  

module.exports=router