// créer des étiquettes de couleur en fonction du type
export function createTagsByColor(selectedTag) {
  document.getElementById("tags").innerHTML = selectedTag
    .map((tag) => {
      if (tag.classList[1] === "items_ingredient") {
        return `
        <div class="tag ingredients">
          <li>${tag.textContent}</li>
          <i class="far fa-times-circle tag_close"></i>
        </div>`
      } else if (tag.classList[1] === "items_appliance") {
        return `
      <div class="tag appliance">
          <li>${tag.textContent}</li>
          <i class="far fa-times-circle tag_close"></i>
        </div>`
      } else if (tag.classList[1] === "items_utensils") {
        return `
      <div class="tag utensils">
          <li>${tag.textContent}</li>
          <i class="far fa-times-circle tag_close"></i>
        </div>`
      }
    })
    .join("")
}
