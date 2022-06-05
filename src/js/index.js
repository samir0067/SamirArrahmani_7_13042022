import {recipes} from "./recipes.js"
import {dropdownButtons} from "./dropdownButtons.js"
import {displayRecipes} from './displayRecipes.js'
import {closeDropdownMenu, openDropdownMenu} from './openCloseDropdown.js'
import {createTagsByColor} from './ctreateTagsByColor.js'
import {
  dropdownAppliance,
  dropdownIngredient,
  dropdownListeAppliance,
  dropdownListeIngredient,
  dropdownListUtensils,
  dropdownUtensils,
  idInputAppliance,
  idInputIngredient,
  idInputUtensils,
  idLabels,
  idSearchBar,
  inputContentAppliance,
  inputContentIngredient,
  inputContentUtensils,
  mainRecipes
} from './domElement.js'

dropdownButtons(idInputIngredient, dropdownListeIngredient, recipes, "ingredient")
dropdownButtons(idInputAppliance, dropdownListeAppliance, recipes, "appliance")
dropdownButtons(idInputUtensils, dropdownListUtensils, recipes, "ustensils")

openDropdownMenu(dropdownIngredient, inputContentIngredient)
openDropdownMenu(dropdownAppliance, inputContentAppliance)
openDropdownMenu(dropdownUtensils, inputContentUtensils)

closeDropdownMenu(dropdownIngredient, inputContentIngredient)
closeDropdownMenu(dropdownAppliance, inputContentAppliance)
closeDropdownMenu(dropdownUtensils, inputContentUtensils)

const listItems = document.querySelectorAll(".items")

let itemsIngredient = document.querySelectorAll(".items_ingredient")
let itemsAppliance = document.querySelectorAll(".items_appliance")
let itemsUtensils = document.querySelectorAll(".items_utensils")

displayRecipes(recipes)

let filterResult = []
let searchResult = []

// écouter l'événement de l'entrée de la barre de recherche en fonction des tags s’il y en a.
idSearchBar.addEventListener("input", () => {
  if (idLabels.children[0]) {
    filteringFromSearchBar(searchResult)
  } else {
    filteringFromSearchBar(recipes)
  }
})

// Filtrer à partir de la barre de recherche
function filteringFromSearchBar(recipesList) {
  filterResult = []
  let i = 0
  if (idSearchBar.value.length >= 3) {
    while (i < recipesList.length) {
      if (
        recipesList[i].name.toLocaleLowerCase().includes(idSearchBar.value.toLocaleLowerCase()) ||
        recipesList[i].description.toLocaleLowerCase().includes(idSearchBar.value.toLocaleLowerCase()) ||
        recipesList[i].ingredients.some((ingredient) => ingredient.ingredient.toLocaleLowerCase().includes(idSearchBar.value.toLocaleLowerCase()))
      ) {
        filterResult.push(recipesList[i])
      }
      filterResult = Array.from(new Set(filterResult))
      mainRecipes.innerHTML = ""
      displayRecipes(filterResult)
      displayRemainingItemsList(filterResult)
      sortingItems(filterResult)
      i++
    }
    // afficher le message d'erreur si moins qu'une recette sinon supprimer le message d'erreur
    if (mainRecipes.children.length < 1) {
      document.querySelector(".error_message").style.display = "block"
    } else if (mainRecipes.children.length >= 1) {
      document.querySelector(".error_message").style.display = "none"
    }
  } else if (idSearchBar.value.length < 3 && idLabels.childElementCount === 0) {
    mainRecipes.innerHTML = ""
    displayRecipes(recipes)
    displayRemainingItemsList(recipes)
    sortingItems(recipes)
    document.querySelector(".error_message").style.display = "none"
  } else if (idSearchBar.value.length < 3 && idLabels.children[0]) {
    mainRecipes.innerHTML = ""
    displayRecipes(searchResult)
    displayRemainingItemsList(searchResult)
    sortingItems(searchResult)
    document.querySelector(".error_message").style.display = "none"
  }
}

for (let item of listItems) {
  item.addEventListener("click", function() {
    item.dataset.selected = item.dataset.selected === "true" ? "false" : "true"
    resettingInputWhenClickingListItem()
  })
}

//  réinitialiser la liste des recettes à la suppression d'un tag
function closeLabel(selectedItems) {
  const closing = document.querySelectorAll(".tag_close")
  for (let i = 0; i < closing.length; i++) {
    closing[i].addEventListener("click", (event) => {
      selectedItems.forEach((label) => {
        if (label.textContent === event.target.parentNode.children[0].textContent) {
          label.dataset.selected = label.dataset.selected === "true" ? "false" : "true"
          resettingInputWhenClickingListItem()
        }
      })
    })
  }
}

// Réinitialisation de la saisie de texte et affichage des recettes lors d'un clic sur un élément de la liste
function resettingInputWhenClickingListItem() {
  const selectedItems = Array.from(document.querySelectorAll(".items[data-selected='true']"))
  idInputIngredient.value = ""
  idInputAppliance.value = ""
  idInputUtensils.value = ""
  createTagsByColor(selectedItems)
  // filtre en fonction du nombre de balises sélectionnées
  for (let items of selectedItems) {
    if (selectedItems.length === 1) {
      if (idSearchBar.value.length < 3) {
        filteringRecipeWithLabels(items, recipes)
      } else if (idSearchBar.value.length >= 3) {
        filteringRecipeWithLabels(items, filterResult)
      }
    } else if (selectedItems.length >= 2) {
      if (idSearchBar.value.length < 3) {
        filteringRecipeWithLabels(items, searchResult)
      } else if (idSearchBar.value.length >= 3) {
        filteringRecipeWithLabels(items, searchResult)
      }
    }
  }
  closeLabel(selectedItems)
  sortingItems(selectedItems)
}



// retourne un tableau filtrer avec la recette des étiquettes
function filteringRecipeWithLabels(list, recettes) {
  searchResult = recettes.filter((recipe) => {
    const filterItems = recipe.ingredients.filter((ingredient) => {
      if (ingredient.ingredient.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())) {
        return ingredient.ingredient.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())
      } else if (recipe.appliance.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())) {
        return recipe.appliance.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())
      }
    })
    const filterInputItems = recipe.ustensils.filter((utensil) => {
      if (utensil.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())) {
        return utensil.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())
      }
    })
    return !!((filterItems && filterItems.length > 0) || (filterInputItems && filterInputItems.length > 0))
  })
  mainRecipes.innerHTML = ""
  displayRecipes(searchResult)
  displayRemainingItemsList(searchResult)
  sortingItems(searchResult)
}

// Afficher les éléments restants de la liste
function displayRemainingItemsList(recipes) {
  let listRecipes = []

  for (let recipe of recipes) {
    for (let ingredient of recipe.ingredients) {
      listRecipes.push(ingredient.ingredient)
    }
    for (let utensil of recipe.ustensils) {
      listRecipes.push(utensil)
    }
    listRecipes.push(recipe.appliance)
    listRecipes = Array.from(new Set(listRecipes))
  }

  for (let item of listItems) {
    if (listRecipes.includes(item.textContent)) {
      if (item.dataset.selected === "true") {
        item.style.display = "none"
      } else if (item.dataset) {
        item.style.display = "block"
      }
    } else {
      item.style.display = "none"
    }
  }
}

// Recherche avancée pour liste déroulante
function SearchItemsInput(input, array, listeItems) {
  input.addEventListener("input", (event) => {
    let resultSearchInput = array.filter((item) => {
      return item.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase())
    })
    for (let item of listeItems) {
      if (resultSearchInput.includes(item.textContent)) {
        item.style.display = "block"
      } else {
        item.style.display = "none"
      }
    }
  })
}

// Tri la list des recettes dans le dropdown
function sortingItems(recipes) {
  let listIngredients = []
  let listAppliances = []
  let listUtensils = []

  for (let recipe of recipes) {
    for (let ingredient of recipe.ingredients) {
      listIngredients.push(ingredient.ingredient)
    }
    listIngredients = Array.from(new Set(listIngredients))

    listAppliances.push(recipe.appliance)
    listAppliances = Array.from(new Set(listAppliances))

    for (let utensil of recipe.ustensils) {
      listUtensils.push(utensil)
    }
    listUtensils = Array.from(new Set(listUtensils))
  }

  SearchItemsInput(idInputIngredient, listIngredients, itemsIngredient)
  SearchItemsInput(idInputAppliance, listAppliances, itemsAppliance)
  SearchItemsInput(idInputUtensils, listUtensils, itemsUtensils)
}
