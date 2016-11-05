/*global $, jQuery, EJS, Handlebars, Router */
$(document).ready(function () {

  const api = `http://localhost:3000/api`
  const $menuPanel = $('#menu-panel-template').html()
  const $booksListTable = $('#books-list-table')
  const $booksListHeader = $('#books-list-header')
  const $booksListHeaderTemplate = $('#books-list-header-template').html()
  const $booksListContent = $('#books-list-content')
  const $booksListContentTemplate = $('#books-list-content-template').html()

  function getUser() {
    let token = localStorage.getItem('token')
    if (!token) return {}
    else {
      let user = jwt_decode(token)
      return user
    }
  }

  function compileBooksHeader() {
    let template = Handlebars.compile($booksListHeaderTemplate)
    $booksListHeader.append(template({ user: getUser() }))
  }

  function compileBooksContent(data) {
    let template = Handlebars.compile($booksListContentTemplate)
    $booksListContent.append(template({ user: getUser(), books: data }))
  }

  function getDataFromAPI() {
    $.getJSON(`${api}/books`, (data) => {
      compileBooksContent(data)
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
        compileBooksContent(data)
      })
      .fail((err) => {
        errorMessage(true, 'Something wrong')
      })
  }

  // Append menu panel based on user
  let user = getUser()
  $('#menu').append(Handlebars.compile($menuPanel)(user))

  // Get initial data
  compileBooksHeader()
  getDataFromAPI()

  // Search input
  $('#search input').keyup((e) => {
    searchData()
  })

})
