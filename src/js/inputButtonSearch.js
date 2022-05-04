/**
 *  Récupérer la liste des éléments recherchée dans l'entrée et les renvois
 * */
export const inputButtonSearch = (input, array, listeItems) => {
  input.addEventListener("input", (event) => {
    let resultInputButtonSearch = array.filter((item) => {
      return item
        .toLocaleLowerCase()
        .includes(event.target.value.toLocaleLowerCase())
    })
    console.log(resultInputButtonSearch)

    listeItems.forEach((item) => {
      if (resultInputButtonSearch.includes(item.textContent)) {
        console.log('display')
        item.style.display = "block"
      } else {
        item.style.display = "none"
      }
    })
  })
}
