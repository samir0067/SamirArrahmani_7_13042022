import {recipes} from "./recipes.js"
import {dropdownButtons} from "./dropdownButtons.js"
import {displayRecipes} from './displayRecipes.js'

// TODO Création de la recherche d'entrée
const inputIngredient = document.getElementById("inputIngredient")
const inputAppliance = document.getElementById("inputAppliance")
const inputUtensils = document.getElementById("inputUtensils")

const dropdownListeIngredient = document.querySelector(".dropdown_subContainer_ingredients")
const dropdownListeAppliance = document.querySelector(".dropdown_subContainer_appliances")
const dropdownListUtensils = document.querySelector(".dropdown_subContainer_utensils")

dropdownButtons(inputIngredient, dropdownListeIngredient, recipes, "ingredient")
dropdownButtons(inputAppliance, dropdownListeAppliance, recipes, "appliance")
dropdownButtons(inputUtensils, dropdownListUtensils, recipes, "ustensils")

const dropdownIngredient = document.querySelector(".dropdown_ingredient")
const dropdownAppliance = document.querySelector(".dropdown_appliance")
const dropdownUtensils = document.querySelector(".dropdown_utensils")

const inputContentIngredient = document.querySelector(".input_content_ingredient")
const inputContentAppliance = document.querySelector(".input_content_appliance")
const inputContentUtensils = document.querySelector(".input_content_utensils")

const containerRecipes = document.querySelector(".main")
const listItems = document.querySelectorAll(".items")

const searchInput = document.getElementById("searchBar")
const listeTags = document.getElementById("tags")

let itemsIngredient = document.querySelectorAll(".items_ingredient")
let itemsAppliance = document.querySelectorAll(".items_appliance")
let itemsUtensils = document.querySelectorAll(".items_utensils")

displayRecipes(recipes)

function openDropDown(inputInactive, inputActive) {
  inputInactive.addEventListener("click", () => {
    inputInactive.style.display = "none"
    inputActive.style.display = "block"
    inputActive.firstChild.nextElementSibling.focus()
  })
}

openDropDown(dropdownIngredient, inputContentIngredient)
openDropDown(dropdownAppliance, inputContentAppliance)
openDropDown(dropdownUtensils, inputContentUtensils)

// TODO fermer le menu déroulant en cliquant à l'extérieur
function closeDropdownMenuByClicking(inputActive, inputInactive) {
  document.addEventListener("click", (event) => {
    if (event.target.parentNode !== inputActive && event.target.parentNode !== inputInactive) {
      inputActive.style.display = "none"
      inputInactive.style.display = "block"
    }
  })
}

closeDropdownMenuByClicking(inputContentIngredient, dropdownIngredient)
closeDropdownMenuByClicking(inputContentAppliance, dropdownAppliance)
closeDropdownMenuByClicking(inputContentUtensils, dropdownUtensils)

let resultFilter = []

// TODO écouter l'événements de l'input de la bar de recherche
searchInput.addEventListener("input", () => {
  if (listeTags.children[0]) {
    mainBarSearchFilter(resultSearchAndClick)
  } else {
    mainBarSearchFilter(recipes)
  }
})

// TODO Filtrer à partir de la barre de recherche
function mainBarSearchFilter(ArrayRecipes) {
  const inputValueToLowerCase = searchInput.value.toLocaleLowerCase()
  resultFilter = []

  if (searchInput.value.length > 2) {
    for (let i = 0; i < ArrayRecipes.length; i++) {
      if (
        ArrayRecipes[i].name.toLocaleLowerCase().includes(inputValueToLowerCase) ||
        ArrayRecipes[i].description.toLocaleLowerCase().includes(inputValueToLowerCase) ||
        ArrayRecipes[i].ingredients.some((ingredient) => ingredient.ingredient.toLocaleLowerCase().includes(inputValueToLowerCase))
      ) {
        resultFilter.push(ArrayRecipes[i])
      }
      resultFilter = Array.from(new Set(resultFilter))
      containerRecipes.innerHTML = ""
      displayRecipes(resultFilter)
      sorting(resultFilter)
      showRemainingListItems(resultFilter)
    }

    // TODO condition pour afficher ou supprimer le message d'erreur
    if (containerRecipes.children.length < 1) {
      document.querySelector(".error_message").style.display = "block"
    } else if (containerRecipes.children.length >= 1) {
      document.querySelector(".error_message").style.display = "none"
    }
  } else if (searchInput.value.length < 3 && listeTags.children[0]) {
    containerRecipes.innerHTML = ""
    sorting(resultSearchAndClick)
    displayRecipes(resultSearchAndClick)
    showRemainingListItems(resultSearchAndClick)
    document.querySelector(".error_message").style.display = "none"
  } else if (searchInput.value.length < 3 && listeTags.childElementCount === 0) {
    containerRecipes.innerHTML = ""
    sorting(recipes)
    displayRecipes(recipes)
    showRemainingListItems(recipes)
    document.querySelector(".error_message").style.display = "none"
  }
}

let resultSearchAndClick = []

listItems.forEach((item) => {
  item.addEventListener("click", function() {
    this.dataset.choisi = this.dataset.choisi === "true" ? "false" : "true"
    filterRecipesOnClick()
  })
})

//TODO Réinitialisation de la saisie de texte lors d'un clic sur un élément de la liste
function filterRecipesOnClick() {
  const listTrue = Array.from(document.querySelectorAll(".items[data-choisi='true']"))
  inputIngredient.value = ""
  inputAppliance.value = ""
  inputUtensils.value = ""
  createTagsByColor(listTrue)
  triSearchBarAndListeTags(listTrue, resultFilter)

  // TODO filtre en fonction du nombre de balises sélectionnées
  listTrue.forEach((liste) => {
    if (listTrue.length === 1 && searchInput.value.length < 3) {
      filterRecipeWithTags(liste, recipes)
    } else if (listTrue.length === 2 && searchInput.value.length < 3) {
      filterRecipeWithTags(liste, resultSearchAndClick)
    } else if (listTrue.length === 3 && searchInput.value.length < 3) {
      filterRecipeWithTags(liste, resultSearchAndClick)
    } else if (listTrue.length === 4 && searchInput.value.length < 3) {
      filterRecipeWithTags(liste, resultSearchAndClick)
    } else if (listTrue.length === 5 && searchInput.value.length < 3) {
      filterRecipeWithTags(liste, resultSearchAndClick)
    }
  })

  if (listTrue.length === 0 && searchInput.value.length < 3) {
    containerRecipes.innerHTML = ""
    displayRecipes(recipes)
    showRemainingListItems(recipes)
    sorting(recipes)
  }
  if (listTrue.length === 0 && searchInput.value.length > 2) {
    containerRecipes.innerHTML = ""
    displayRecipes(resultFilter)
    showRemainingListItems(resultFilter)
    sorting(resultFilter)
  }
  closingTagOnTheCross(listTrue)
}

// TODO Permet d'afficher les éléments de la liste disponibles selon la recherche par clic ou sur la barre principale
function triSearchBarAndListeTags(listeTrue, resultFilter) {
  listeTrue.forEach((liste) => {
    if (listeTrue.length === 1 && searchInput.value.length > 2) {
      filterRecipeWithTags(liste, resultFilter)
    } else if (listeTrue.length === 2 && searchInput.value.length > 2) {
      filterRecipeWithTags(liste, resultSearchAndClick)
    } else if (listeTrue.length === 3 && searchInput.value.length > 2) {
      filterRecipeWithTags(liste, resultSearchAndClick)
    } else if (listeTrue.length === 4 && searchInput.value.length > 2) {
      filterRecipeWithTags(liste, resultSearchAndClick)
    } else if (listeTrue.length === 5 && searchInput.value.length > 2) {
      filterRecipeWithTags(liste, resultSearchAndClick)
    }
    if (listeTrue.length === 0 && searchInput.value.length > 2) {
      console.log("yes")
      filterRecipeWithTags(liste, resultFilter)
    }
  })
}

// TODO permets de créer des étiquettes de couleur en fonction du type
function createTagsByColor(listTrue) {
  document.getElementById("tags").innerHTML = listTrue
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
function filterRecipeWithTags(list, recettes) {
  resultSearchAndClick = recettes.filter((recipe) => {
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
  containerRecipes.innerHTML = ""
  showRemainingListItems(resultSearchAndClick)
  displayRecipes(resultSearchAndClick)
  sorting(resultSearchAndClick)
}

// TODO Afficher les éléments restants de la liste
function showRemainingListItems(result) {
  let newArr = []
  result.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      newArr.push(ingredient.ingredient)
    })
    recipe.ustensils.forEach((ustensil) => {
      newArr.push(ustensil)
    })
    newArr.push(recipe.appliance)
    newArr = Array.from(new Set(newArr))
  })

  listItems.forEach((item) => {
    if (newArr.includes(item.textContent)) {
      if (item.dataset.choisi === "true") {
        item.style.display = "none"
      } else if (item.dataset) {
        item.style.display = "list-item"
      }
    } else {
      item.style.display = "none"
    }
  })
}

// TODO réinitialiser la liste des recettes à la suppression d'un tag
function closingTagOnTheCross(listeTrue) {
  const croix = document.querySelectorAll(".tag_close")
  for (let i = 0; i < croix.length; i++) {
    croix[i].addEventListener("click", (e) => {
      listeTrue.forEach((ingredient) => {
        if (ingredient.textContent === e.target.parentNode.children[0].textContent) {
          ingredient.dataset.choisi =
            ingredient.dataset.choisi === "true" ? "false" : "true"
          filterRecipesOnClick()
        }
      })
    })
  }
}

// TODO Recherche avancée par liste déroulante
function SearchItemsInput(input, array, listeItems) {
  input.addEventListener("input", (e) => {
    let resultSearchInput = array.filter((item) => {
      return item
        .toLocaleLowerCase()
        .includes(e.target.value.toLocaleLowerCase())
    })
    listeItems.forEach((item) => {
      if (resultSearchInput.includes(item.textContent)) {
        item.style.display = "list-item"
      } else {
        item.style.display = "none"
      }
    })
  })
}

// TODO Tri des articles
function sorting(recipes) {
  let allIngredients = []
  let allAppliances = []
  let allUstensils = []

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => allIngredients.push(ingredient.ingredient))
    allIngredients = Array.from(new Set(allIngredients))

    allAppliances.push(recipe.appliance)
    allAppliances = Array.from(new Set(allAppliances))

    recipe.ustensils.forEach((ustensil) => allUstensils.push(ustensil))
    allUstensils = Array.from(new Set(allUstensils))
  })

  SearchItemsInput(inputIngredient, allIngredients, itemsIngredient)
  SearchItemsInput(inputAppliance, allAppliances, itemsAppliance)
  SearchItemsInput(inputUtensils, allUstensils, itemsUtensils)
}

if (searchInput.value.length < 3) {
  sorting(recipes)
}
