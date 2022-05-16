// fonction qui me permet d'injecté chaque ingredient, appareil ou ustensile dans les
// champs des recherches.
export const dropdownButtons = (input, tags, recipes, articles) => {
  let ingredients = []
  let appliance = []
  let utensils = []

  for (let recipe of recipes) {
    for (let ingredient1 of recipe.ingredients) {
      ingredients.push(ingredient1.ingredient)
    }
    ingredients = Array.from(new Set(ingredients))
    ingredients.sort((a, b) => a.localeCompare(b))

    appliance.push(recipe.appliance)
    appliance = Array.from(new Set(appliance))
    appliance.sort((a, b) => a.localeCompare(b))

    for (let utensil1 of recipe.ustensils) {
      utensils.push(utensil1)
    }
    utensils = Array.from(new Set(utensils))
    utensils.sort((a, b) => a.localeCompare(b))
  }

  if (articles === "ingredient") {
    tags.innerHTML = ingredients
      .map((article) => `<li class="items items_ingredient" data-selected="false">${article}</li>`).join("")
  }

  if (articles === "appliance") {
    tags.innerHTML = appliance
      .map((article) => `<li class="items items_appliance" data-selected="false">${article}</li>`).join("")
  }

  if (articles === "ustensils") {
    tags.innerHTML = utensils
      .map((article) => `<li class="items items_utensils" data-selected="false">${article}</li>`).join("")
  }
}
