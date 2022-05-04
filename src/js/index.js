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

function closeDropDownByArrow(a, b, c, d) {
  if (a.id === b) {
    document.querySelector(c).addEventListener("click", function() {
      a.style.display = "none"
      d.style.display = "block"
    })
  }
}
closeDropDownByArrow(inputContentIngredient, ".input_content_ingredient", ".arrow_ingredient", dropdownIngredient)
closeDropDownByArrow(inputContentAppliance, ".input_content_appliance", ".arrow_appliance", dropdownAppliance)
closeDropDownByArrow(inputContentUtensils, ".input_content_utensils", ".arrow_utensils", dropdownUtensils)

const closeDropdownFromOutside = (inputActive, inputInactive) => {
  document.addEventListener("click", (e) => {
    if (
      e.target.parentNode !== inputActive &&
      e.target.parentNode !== inputInactive
    ) {
      inputActive.style.display = "none"
      inputInactive.style.display = "block"
    }
  })
}

closeDropdownFromOutside(inputContentIngredient, dropdownIngredient)
closeDropdownFromOutside(inputContentAppliance, dropdownAppliance)
closeDropdownFromOutside(inputContentUtensils, dropdownUtensils)

//--------------------------------------------------------------------------------------------------------//
//********************************************** SEARCH BAR **********************************************//
//--------------------------------------------------------------------------------------------------------//

searchBar.addEventListener("input", () => {
  if (tags.children[0]) {
    mainBarSearchFilter(resultSearch)
  } else {
    mainBarSearchFilter(recipes)
  }
})

const mainBarSearchFilter = (ArrayRecipes) => {
  const inputValueToLowerCase = searchBar.value.toLocaleLowerCase()
  resultFilter = []

  if (searchBar.value.length > 2) {
    for (let i = 0; i < ArrayRecipes.length; i++) {
      if (
        ArrayRecipes[i].name
          .toLocaleLowerCase()
          .includes(inputValueToLowerCase) ||
        ArrayRecipes[i].description
          .toLocaleLowerCase()
          .includes(inputValueToLowerCase) ||
        ArrayRecipes[i].ingredients.some((ingredient) =>
          ingredient.ingredient
            .toLocaleLowerCase()
            .includes(inputValueToLowerCase)
        )
      ) {
        resultFilter.push(ArrayRecipes[i])
      }

      resultFilter = Array.from(new Set(resultFilter))
      main.innerHTML = ""
      displayRecipes(resultFilter)
      sorting(resultFilter)
      displayOtherItemsList(resultFilter)
    }

    if (main.children.length < 1) {
      document.querySelector(".error_message").style.display = "block"
    } else if (main.children.length >= 1) {
      document.querySelector(".error_message").style.display = "none"
    }
  } else if (searchBar.value.length < 3 && tags.children[0]) {
    main.innerHTML = ""
    sorting(resultSearch)
    displayRecipes(resultSearch)
    displayOtherItemsList(resultSearch)
    document.querySelector(".error_message").style.display = "none"
  } else if (searchBar.value.length < 3 && tags.childElementCount === 0) {
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
  })
})

if (searchBar.value.length < 3) {
  sorting(recipes)
}
