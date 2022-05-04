export const inputButtonSearch = (input, array, listeItems) => {
  input.addEventListener("input", (e) => {
    let resultInputButtonSearch = array.filter((item) => {
      return item
        .toLocaleLowerCase()
        .includes(e.target.value.toLocaleLowerCase())
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
