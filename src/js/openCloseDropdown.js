// ouverture et fermeture du menu déroulant
export function openDropdownMenu(inactive, active) {
  inactive.addEventListener("click", () => {
    inactive.style.display = "none"
    active.style.display = "block"
  })
}

export function closeDropdownMenu(inactive, active) {
  document.addEventListener("click", (event) => {
    if (event.target.parentNode !== active && event.target.parentNode !== inactive) {
      inactive.style.display = "block"
      active.style.display = "none"
    }
  })
}
