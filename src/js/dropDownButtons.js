export const dropdownButtons = (input, tags, recipes, article) => {
  let ingredients = []
  let appliance = []
  let utensils = []

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => ingredients.push(ingredient.ingredient))
    ingredients = Array.from(new Set(ingredients))
    ingredients.sort((a, b) => a.localeCompare(b))

    appliance.push(recipe.appliance)
    appliance = Array.from(new Set(appliance))
    appliance.sort((a, b) => a.localeCompare(b))

    recipe.utensils.forEach((utensil) => utensils.push(utensil))
    utensils = Array.from(new Set(utensils))
    utensils.sort((a, b) => a.localeCompare(b))
  })

  if (article === "ingredient") {
    tags.innerHTML = ingredients
      .map((item) => `<li class="items items_ingredient" data-selected="false">${item}</li>`).join("")
  }

  if (article === "appliance") {
    tags.innerHTML = appliance
      .map((item) => `<li class="items items_appliance" data-selected="false">${item}</li>`).join("")
  }

  if (article === "utensils") {
    tags.innerHTML = utensils
      .map((item) => `<li class="items items_utensils" data-selected="false">${item}</li>`).join("")
  }
}
