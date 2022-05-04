import {recipes} from "./recipes.js"
import {dropdownButtons} from "./dropDownButtons.js"
import {displayRecipes} from './displayRecipes.js'
import {displayOtherItemsList} from './displayOtherItemsList.js'
import {sorting} from './sorting.js'
import {
  inputContentAppliance,
  dropdownAppliance,
  inputAppliance,
  inputIngredient,
  inputContentIngredient,
  dropdownIngredient,
  inputContentUtensils,
  dropdownUtensils,
  inputUtensils,
  dropdownSubContainerAppliances,
  dropdownSubContainerIngredients,
  dropdownSubContainerUtensils,
  tags,
  searchBar,
  main,
} from './domElement.js'

let resultSearch = []

displayRecipes(recipes)

//--------------------------------------------------------------------------------------------------------//
//********************************************** DROPDOWN ************************************************//
//--------------------------------------------------------------------------------------------------------//

dropdownButtons(inputIngredient, dropdownSubContainerIngredients, recipes, "ingredient")
dropdownButtons(inputAppliance, dropdownSubContainerAppliances, recipes, "appliance")
dropdownButtons(inputUtensils, dropdownSubContainerUtensils, recipes, "utensils")

const openDropDown = (inactive, active) => {
  inactive.addEventListener("click", () => {
    inactive.style.display = "none"
    active.style.display = "block"
    active.firstChild.nextElementSibling.focus()
  })
}
openDropDown(dropdownIngredient, inputContentIngredient)
openDropDown(dropdownAppliance, inputContentAppliance)
openDropDown(dropdownUtensils, inputContentUtensils)

const closeDropdownFromOutside = (inputActive, inputInactive) => {
  document.addEventListener("click", (e) => {
    if (e.target.parentNode !== inputActive && e.target.parentNode !== inputInactive) {
      inputActive.style.display = "none"
      inputInactive.style.display = "block"
    }
  })
}
closeDropdownFromOutside(inputContentIngredient, dropdownIngredient)
closeDropdownFromOutside(inputContentAppliance, dropdownAppliance)
closeDropdownFromOutside(inputContentUtensils, dropdownUtensils)

function closeDropDown(input, inputParent, arrowUp, buttonParent) {
  if (input.id === inputParent) {
    document.querySelector(arrowUp).addEventListener("click", function() {
      input.style.display = "none"
      buttonParent.style.display = "block"
    })
  }
}
closeDropDown(inputContentIngredient, ".input_content_ingredient", ".arrow_ingredient", dropdownIngredient)
closeDropDown(inputContentAppliance, ".input_content_appliance", ".arrow_appliance", dropdownAppliance)
closeDropDown(inputContentUtensils, ".input_content_utensils", ".arrow_utensils", dropdownUtensils)

const items = document.querySelectorAll(".items")

let resultFilter = []

//--------------------------------------------------------------------------------------------------------//
//********************************************** SEARCH BAR **********************************************//
//--------------------------------------------------------------------------------------------------------//

searchBar.addEventListener("input", () => {
  if (tags.children[0]) {
    filterFromSearchBar(resultSearch)
  } else {
    filterFromSearchBar(recipes)
  }
})

const filterFromSearchBar = (ArrayRecipes) => {
  resultFilter = []

  if (searchBar.value.length > 2) {
    for (let i = 0; i < ArrayRecipes.length; i++) {
      if (
        ArrayRecipes[i].name.toLocaleLowerCase().includes(searchBar.value.toLocaleLowerCase()) ||
        ArrayRecipes[i].description.toLocaleLowerCase().includes(searchBar.value.toLocaleLowerCase()) ||
        ArrayRecipes[i].ingredients.some(ingredient => ingredient.ingredient.toLocaleLowerCase().includes(searchBar.value.toLocaleLowerCase()))
      ) {
        resultFilter.push(ArrayRecipes[i])
      }
      resultFilter = Array.from(new Set(resultFilter))
      main.innerHTML = ""
      sorting(resultFilter)
      displayRecipes(resultFilter)
      displayOtherItemsList(resultFilter)
    }

    if (main.children.length < 1) {
      document.querySelector(".error_message").style.display = "block"
    }
    if (main.children.length >= 1) {
      document.querySelector(".error_message").style.display = "none"
    }
  }
  if (searchBar.value.length < 3 && tags.children[0]) {
    main.innerHTML = ""
    sorting(resultSearch)
    displayRecipes(resultSearch)
    displayOtherItemsList(resultSearch)
    document.querySelector(".error_message").style.display = "none"
  }
  if (searchBar.value.length < 3 && tags.childElementCount === 0) {
    main.innerHTML = ""
    sorting(recipes)
    displayRecipes(recipes)
    displayOtherItemsList(recipes)
    document.querySelector(".error_message").style.display = "none"
  }
}

items.forEach((item) => {
  item.addEventListener("click", function() {
    this.dataset.selected = this.dataset.selected === "true" ? "false" : "true"
    tagProcessingForRecipes()
  })
})

//--------------------------------------------------------------------------------------------------------//
//********************************************** TAGS LIST ***********************************************//
//--------------------------------------------------------------------------------------------------------//

const filterRecipeWithTags = (list, filteringRecipes) => {
  resultSearch = filteringRecipes.filter((recipe) => {
    const filterAllElements = recipe.ingredients.filter((ingredient) => {
      if (ingredient.ingredient.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())) {
        return ingredient.ingredient.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())
      }
      if (recipe.appliance.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())) {
        return recipe.appliance.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())
      }
    })

    const filterElementDeux = recipe.utensils.filter((utensil) => {
      if (utensil.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())) {
        return utensil.toLocaleLowerCase().includes(list.textContent.toLocaleLowerCase())
      }
    })
    return !!((filterAllElements && filterAllElements.length > 0) || (filterElementDeux && filterElementDeux.length > 0))
  })
  main.innerHTML = ""
  displayOtherItemsList(resultSearch)
  displayRecipes(resultSearch)
  sorting(resultSearch)
}

const triSearchBarAndListeTags = (listeTrue, resultFilter) => {
  listeTrue.forEach((liste) => {
    if (listeTrue.length && searchBar.value.length > 2) {
      filterRecipeWithTags(liste, resultFilter)
    }
  })
}

const tagsList = (listValid) => {
  document.getElementById("tags").innerHTML = listValid
    .map((liste) => {
      if (liste.classList[1] === "items_ingredient") {
        return `
        <div class="tag ingredients">
          <li>${liste.textContent}</li>
          <i class="far fa-times-circle tag_close"></i>
        </div>
      `
      }
      if (liste.classList[1] === "items_appliance") {
        return `
      <div class="tag appliance">
        <li>${liste.textContent}</li>
        <i class="far fa-times-circle tag_close"></i>
      </div>
      `
      }
      if (liste.classList[1] === "items_utensils") {
        return `
      <div class="tag utensils">
          <li>${liste.textContent}</li>
          <i class="far fa-times-circle tag_close"></i>
        </div>
      `
      }
    })
    .join("")
}

const closeTag = (listeTrue) => {
  const closing = document.querySelectorAll(".tag_close")
  for (let i = 0; i < closing.length; i++) {
    closing[i].addEventListener("click", (e) => {
      listeTrue.forEach((ingredient) => {
        if (ingredient.textContent === e.target.parentNode.children[0].textContent) {
          ingredient.dataset.selected =
            ingredient.dataset.selected === "true" && "false"
          tagProcessingForRecipes()
          console.log('resultSearch', resultSearch)
        }
      })
    })
  }
}

export const tagProcessingForRecipes = () => {
  const listValide = Array.from(
    document.querySelectorAll(".items[data-selected='true']")
  )
  tagsList(listValide)
  triSearchBarAndListeTags(listValide, resultFilter)
  closeTag(listValide)

  listValide.forEach((liste) => {
    if (listValide.length === 1 && searchBar.value.length < 3) {
      filterRecipeWithTags(liste, recipes)
    }
    if (listValide.length <= 5 && searchBar.value.length < 3) {
      filterRecipeWithTags(liste, recipes)
    }
  })

  if (listValide.length === 0 && searchBar.value.length < 3) {
    main.innerHTML = ""
    displayRecipes(recipes)
    displayOtherItemsList(recipes)
    sorting(recipes)
  }
  if (listValide.length === 0 && searchBar.value.length > 2) {
    main.innerHTML = ""
    displayRecipes(resultFilter)
    displayOtherItemsList(resultFilter)
    sorting(resultFilter)
  }
  inputIngredient.value = ""
  inputAppliance.value = ""
  inputUtensils.value = ""
}

if (searchBar.value.length < 3) {
  sorting(recipes)
}
