/**
 *  Récupérer la liste des éléments recherchée dans l'entrée et renvois le total si aucun article
 * */
export const inputButtonSearch = (input, array, listeItems) => {
  input.addEventListener("input", (event) => {
    let resultInputButtonSearch = array.filter((element) => {
      return element
        .toLocaleLowerCase()
        .includes(event.target.value.toLocaleLowerCase())
    })
    listeItems.forEach((element) => {
      if (!resultInputButtonSearch.includes(element.textContent)) {
        element.style.display = "none"
      } else {
        element.style.display = "block"
      }
    })
  })
}
