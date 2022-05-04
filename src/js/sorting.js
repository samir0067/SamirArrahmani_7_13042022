import {inputButtonSearch} from './inputButtonSearch.js'
import {
  inputAppliance,
  inputIngredient,
  inputUtensils,
  itemAppliances,
  itemIngredients,
  itemUtensils
} from './domElement.js'

export const sorting = (recipes) => {
  let ingredientsList = []
  let appliancesList = []
  let utensilsList = []

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => ingredientsList.push(ingredient.ingredient))
    ingredientsList = Array.from(new Set(ingredientsList))

    appliancesList.push(recipe.appliance)
    appliancesList = Array.from(new Set(appliancesList))

    recipe.utensils.forEach((utensil) => utensilsList.push(utensil))
    utensilsList = Array.from(new Set(utensilsList))
  })

  inputButtonSearch(inputIngredient, ingredientsList, itemIngredients)
  inputButtonSearch(inputAppliance, appliancesList, itemAppliances)
  inputButtonSearch(inputUtensils, utensilsList, itemUtensils)
}
