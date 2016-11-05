/*global $, jQuery, EJS, Handlebars, Router */
$(document).ready(function () {

  const api = `http://localhost:3000/api`
  const $menuPanel = $('#menu-panel-template').html()
  const $booksListTable = $('#books-list-table')
  const $booksListContent = $('#books-list-content')
  const $booksList = $('#books-list-template').html()

  function getAccountProfile() {
    let token = localStorage.getItem('token')
    if (!token) return {}
    else {
      let profile = jwt_decode(token)
      return profile
    }
  }

  function compileBooksList(data) {
    let list = Handlebars.compile($booksList)
    $booksListContent.append(list(data))
  }

  function getDataFromAPI() {
    $.getJSON(`${api}/books`, (data) => {
      compileBooksList(data)
    })
  }

  function searchData() {
    let $isbn = $('input#searchByISBN').val();
    let $name = $('input#searchByName').val();
    // console.log($searchInput)
    $.ajax({
        method: 'POST',
        url: `${api}/books/search`,
        data: { isbn: $isbn, name: $name },
        dataType: 'json'
      })
      .done((data) => {
        // console.log(data)
        compileBooksList(data)
      })
      .fail((err) => {
        errorMessage(true, 'Something wrong')
      })
  }

  // Append menu panel based on profile
  let profile = getAccountProfile()
  $('#menu').append(Handlebars.compile($menuPanel)(profile))

  // Get initial data
  getDataFromAPI()

  // Search input
  $('#search input').keyup((e) => {
    searchData()
  })

})
