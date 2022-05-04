/**
 *  Récupérer la liste des éléments recherchée dans l'entrée et les renvois
 * */
export const inputButtonSearch = (input, array, listeItems) => {
  input.addEventListener("input", (event) => {
    let resultInputButtonSearch = array.filter((element) => {
      return element
        .toLocaleLowerCase()
        .includes(event.target.value.toLocaleLowerCase())
    })
    console.log(resultInputButtonSearch)

    listeItems.forEach((element) => {
      if (resultInputButtonSearch.includes(element.textContent)) {
        console.log('display')
        element.style.display = "block"
      } else {
        element.style.display = "none"
      }
    })
  })
}
