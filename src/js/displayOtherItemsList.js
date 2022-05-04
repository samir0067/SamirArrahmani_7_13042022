import {items} from './domElement.js'

export const displayOtherItemsList = (result) => {
  let arrayItems = []

  result.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => arrayItems.push(ingredient.ingredient))
    recipe.utensils.forEach((utensil) => arrayItems.push(utensil))
    arrayItems.push(recipe.appliance)
    arrayItems = Array.from(new Set(arrayItems))
  })

  items.forEach((items) => {
    if (arrayItems.includes(items.textContent)) {
      if (items.dataset.selected === "true") {
        items.style.display = "none"
      } else if (items.dataset) {
        items.style.display = "block"
      }
    } else {
      items.style.display = "none"
    }
  })
}
