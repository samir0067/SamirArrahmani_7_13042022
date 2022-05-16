import {recipes} from "./recipes.js"
import {dropdownButtons} from "./dropdownButtons.js"
import {displayRecipes} from './displayRecipes.js'

// TODO Création de la recherche d'entrée
const idInputIngredient = document.getElementById("inputIngredient")
const idInputAppliance = document.getElementById("inputAppliance")
const idInputUtensils = document.getElementById("inputUtensils")

const dropdownListeIngredient = document.querySelector(".dropdown_subContainer_ingredients")
const dropdownListeAppliance = document.querySelector(".dropdown_subContainer_appliances")
const dropdownListUtensils = document.querySelector(".dropdown_subContainer_utensils")

dropdownButtons(idInputIngredient, dropdownListeIngredient, recipes, "ingredient")
dropdownButtons(idInputAppliance, dropdownListeAppliance, recipes, "appliance")
dropdownButtons(idInputUtensils, dropdownListUtensils, recipes, "ustensils")

const dropdownIngredient = document.querySelector(".dropdown_ingredient")
const dropdownAppliance = document.querySelector(".dropdown_appliance")
const dropdownUtensils = document.querySelector(".dropdown_utensils")

const inputContentIngredient = document.querySelector(".input_content_ingredient")
const inputContentAppliance = document.querySelector(".input_content_appliance")
const inputContentUtensils = document.querySelector(".input_content_utensils")

const mainRecipes = document.querySelector(".main")
const listItems = document.querySelectorAll(".items")

const idSearchBar = document.getElementById("searchBar")
const idLabels = document.getElementById("tags")

let itemsIngredient = document.querySelectorAll(".items_ingredient")
let itemsAppliance = document.querySelectorAll(".items_appliance")
let itemsUtensils = document.querySelectorAll(".items_utensils")

displayRecipes(recipes)

// TODO ouverture et fermeture du menu déroulant au clique
function openDropdownMenuByClicking(inactive, active) {
  inactive.addEventListener("click", () => {
    inactive.style.display = "none"
    active.style.display = "block"
    active.firstChild.nextElementSibling.focus()
  })
}

function closeDropdownMenuByClicking(inactive, active) {
  document.addEventListener("click", (event) => {
    if (event.target.parentNode !== active && event.target.parentNode !== inactive) {
      active.style.display = "none"
      inactive.style.display = "block"
    }
  })
}

openDropdownMenuByClicking(dropdownIngredient, inputContentIngredient)
openDropdownMenuByClicking(dropdownAppliance, inputContentAppliance)
openDropdownMenuByClicking(dropdownUtensils, inputContentUtensils)

closeDropdownMenuByClicking(dropdownIngredient, inputContentIngredient)
closeDropdownMenuByClicking(dropdownAppliance, inputContentAppliance)
closeDropdownMenuByClicking(dropdownUtensils, inputContentUtensils)

let filterResult = []

if (idSearchBar.value.length < 3) {
  sortingItems(recipes)
}


// TODO écouter l'événements de l'input de la bar de recherche
idSearchBar.addEventListener("input", () => {
  if (idLabels.children[0]) {
    filteringFromSearchBar(searchResult)
  } else {
    filteringFromSearchBar(recipes)
  }
})

// TODO Filtrer à partir de la barre de recherche
function filteringFromSearchBar(ArrayRecipes) {
  filterResult = []

  if (idSearchBar.value.length >= 3) {
    for (let i = 0; i < ArrayRecipes.length; i++) {
      if (
        ArrayRecipes[i].name.toLocaleLowerCase().includes(idSearchBar.value.toLocaleLowerCase()) ||
        ArrayRecipes[i].description.toLocaleLowerCase().includes(idSearchBar.value.toLocaleLowerCase()) ||
        ArrayRecipes[i].ingredients.some((ingredient) => ingredient.ingredient.toLocaleLowerCase().includes(idSearchBar.value.toLocaleLowerCase()))
      ) {
        filterResult.push(ArrayRecipes[i])
      }
      filterResult = Array.from(new Set(filterResult))
      mainRecipes.innerHTML = ""
      displayRecipes(filterResult)
      sortingItems(filterResult)
      displayRemainingItemsList(filterResult)
    }

    // TODO condition pour afficher ou supprimer le message d'erreur
    if (mainRecipes.children.length < 1) {
      document.querySelector(".error_message").style.display = "block"
    } else if (mainRecipes.children.length >= 1) {
      document.querySelector(".error_message").style.display = "none"
    }
  } else if (idSearchBar.value.length < 3 && idLabels.children[0]) {
    mainRecipes.innerHTML = ""
    sortingItems(searchResult)
    displayRecipes(searchResult)
    displayRemainingItemsList(searchResult)
    document.querySelector(".error_message").style.display = "none"
  } else if (idSearchBar.value.length < 3 && idLabels.childElementCount === 0) {
    mainRecipes.innerHTML = ""
    sortingItems(recipes)
    displayRecipes(recipes)
    displayRemainingItemsList(recipes)
    document.querySelector(".error_message").style.display = "none"
  }
}

let searchResult = []

for (let item of listItems) {
  item.addEventListener("click", function() {
    this.dataset.selected = this.dataset.selected === "true" ? "false" : "true"
    resettingInputWhenClickingListItem()
  })
}

//TODO Réinitialisation de la saisie de texte lors d'un clic sur un élément de la liste
function resettingInputWhenClickingListItem() {
  const selectedItems = Array.from(document.querySelectorAll(".items[data-selected='true']"))
  idInputIngredient.value = ""
  idInputAppliance.value = ""
  idInputUtensils.value = ""
  createTagsByColor(selectedItems)

  // TODO Permet d'afficher les éléments de la liste disponibles selon la recherche par clic ou sur la barre principale
  for (let items of selectedItems) {
    if (selectedItems.length === 1 && idSearchBar.value.length > 2) {
      filteringRecipeWithLabels(items, filterResult)
    } else if (selectedItems.length >= 2 && idSearchBar.value.length > 2) {
      filteringRecipeWithLabels(items, searchResult)
    }
    if (selectedItems.length === 0 && idSearchBar.value.length > 2) {
      filteringRecipeWithLabels(items, filterResult)
    }
  }

  // TODO filtre en fonction du nombre de balises sélectionnées
  for (let items of selectedItems) {
    if (selectedItems.length === 1 && idSearchBar.value.length < 3) {
      filteringRecipeWithLabels(items, recipes)
    } else if (selectedItems.length >= 2 && idSearchBar.value.length < 3) {
      filteringRecipeWithLabels(items, searchResult)
    }
  }
  if (selectedItems.length === 0 && idSearchBar.value.length < 3) {
    mainRecipes.innerHTML = ""
    displayRecipes(recipes)
    displayRemainingItemsList(recipes)
    sortingItems(recipes)
  }
  if (selectedItems.length === 0 && idSearchBar.value.length > 2) {
    mainRecipes.innerHTML = ""
    displayRecipes(filterResult)
    displayRemainingItemsList(filterResult)
    sortingItems(filterResult)
  }
  resetRecipeListWhenLabelDeleted(selectedItems)
}

// TODO permets de créer des étiquettes de couleur en fonction du type
function createTagsByColor(selectedItems) {
  document.getElementById("tags").innerHTML = selectedItems
    .map((liste) => {
      if (liste.classList[1] === "items_ingredient") {
        return `
        <div class="tag ingredients">
          <li>${liste.textContent}</li>
          <i class="far fa-times-circle tag_close"></i>
        </div>`
      } else if (liste.classList[1] === "items_appliance") {
        return `
      <div class="tag appliance">
          <li>${liste.textContent}</li>
          <i class="far fa-times-circle tag_close"></i>
        </div>`
      } else if (liste.classList[1] === "items_utensils") {
        return `
      <div class="tag utensils">
          <li>${liste.textContent}</li>
          <i class="far fa-times-circle tag_close"></i>
        </div>`
      }
    })
    .join("")
}

// TODO permets de filtrer la recette avec des étiquettes
function filteringRecipeWithLabels(list, recettes) {
  searchResult = recettes.filter((recipe) => {
    const filterAllElements = recipe.ingredients.filter((ingredient) => {
      if (ingredient.ingredient.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())) {
        return ingredient.ingredient.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())
      } else if (recipe.appliance.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())) {
        return recipe.appliance.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())
      }
    })
    const filterElementDeux = recipe.ustensils.filter((ustensil) => {
      if (ustensil.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())) {
        return ustensil.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())
      }
    })
    return !!((filterAllElements && filterAllElements.length > 0) || (filterElementDeux && filterElementDeux.length > 0))
  })
  mainRecipes.innerHTML = ""
  displayRemainingItemsList(searchResult)
  displayRecipes(searchResult)
  sortingItems(searchResult)
}

// TODO Afficher les éléments restants de la liste
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

// TODO réinitialiser la liste des recettes à la suppression d'un tag
function resetRecipeListWhenLabelDeleted(selectedLabels) {
  const closing = document.querySelectorAll(".tag_close")
  for (let i = 0; i < closing.length; i++) {
    closing[i].addEventListener("click", (event) => {
      for (let label of selectedLabels) {
        if (label.textContent === event.target.parentNode.children[0].textContent) {
          label.dataset.selected = label.dataset.selected === "true" ? "false" : "true"
          resettingInputWhenClickingListItem()
        }
      }
    })
  }
}

// TODO Recherche avancée pour liste déroulante
function SearchItemsInput(input, array, listeItems) {
  input.addEventListener("input", (event) => {
    let resultSearchInput = array.filter((item) => {
      return item
        .toLocaleLowerCase()
        .includes(event.target.value.toLocaleLowerCase())
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

// TODO Tri des articles
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
