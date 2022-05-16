const main = document.querySelector(".main")

// fonction qui me permet d'afficher tout le contenu de chaque recette sur une carte.
export function displayRecipes(recipes) {
  recipes.forEach((recipe) => {
    const card = `
      <div class="card">
        <div class="card_img" ></div>
        <div class="card_body">
          <div class="card_body_header">
            <h2 class="h5 text-truncate">${recipe.name}</h2>
            <span class="col-4 text-end"><i class="far fa-clock"></i> ${recipe.time} min</span>
          </div>
          <div class="card_body_content">
            <p class="card_body_content_first">
              ${recipe.ingredients.map((ingredient) =>
      `<strong>${ingredient.ingredient}</strong> : ${ingredient.quantity} ${ingredient.unit}`)
      .join('<br />')}
            </p class="card_body_content_second">
            <p>${recipe.description}</p>
          </div>
        </div>
      </div>
      `
    main.insertAdjacentHTML('beforeend', card)
  })
}
