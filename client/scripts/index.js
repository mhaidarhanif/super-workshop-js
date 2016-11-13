/*global $, jQuery, EJS, Handlebars, Router */
$(document).ready(function () {

  const api = `http://localhost:3000/api`
  const auth = `http://localhost:3000/auth`

  const $menuPanelTemplate = $('#menu-panel-template').html()
  const $booksListTable = $('#books-list-table')
  const $booksListHeader = $('#books-list-header')
  const $booksListHeaderTemplate = $('#books-list-header-template').html()
  const $booksListContent = $('#books-list-content')
  const $booksListContentTemplate = $('#books-list-content-template').html()

  // ---------------------------------------------------------------------------
  // Energize!
  // ---------------------------------------------------------------------------

  Handlebars.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
      return options.fn(this)
    }
    return options.inverse(this)
  })

  // Append menu panel based on authenticated user account
  $('#menu').append(Handlebars.compile($menuPanelTemplate)(Auth.getUser()))

  // Get initial data from server
  compileBooksHeader()
  getDataFromAPI()

  // Search input on typing
  $('#search input').keyup((e) => {
    searchData()
  })

  // ---------------------------------------------------------------------------
  // ACTION: Account / User / Profile
  // ---------------------------------------------------------------------------

  $('#menuSignOut').on('click', (e) => {
    Auth.deauthenticateUser()
  })

  // ---------------------------------------------------------------------------
  // VIEW: Books List
  // ---------------------------------------------------------------------------

  function compileBooksHeader() {
    let template = Handlebars.compile($booksListHeaderTemplate)
    $booksListHeader.append(template({ user: Auth.getUser() }))
  }

  function compileBooksContent(data) {
    let template = Handlebars.compile($booksListContentTemplate)
    $booksListContent.html(template({ books: data }))
  }

  function getDataFromAPI() {
    $.getJSON(`${api}/books`, (data) => {
      console.log(data)
      compileBooksContent(data)
    })
  }

  function searchData() {
    let $isbn = $('input#searchByISBN').val()
    let $name = $('input#searchByName').val()
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
        console.log('Error', err)
      })
  }

})
