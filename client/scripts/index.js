/*global $, jQuery, EJS, Handlebars, Router */
$(document).ready(function () {

  const api = `http://localhost:3000/api`
  const $menuPanel = $('#menu-panel-template').html()
  const $booksListTable = $('#books-list-table')
  const $booksListContent = $('#books-list-content')
  const $booksList = $('#books-list-template').html()

  function getData() {
    $.getJSON(`${api}/books`, (data) => {
      let list = Handlebars.compile($booksList)
      $booksListContent.append(list(data))
    })
  }

  function renderDataFromSearch(data) {
    let list = Handlebars.compile($booksList)
    $booksListContent.html(list(data))
  }

  function searchData() {
    let $isbn = $('input#searchByISBN').val();
    let $name = $('input#searchByName').val();
    // console.log($searchInput)
    $.ajax({
        method: "POST",
        url: `${api}/books/search`,
        data: { isbn: $isbn, name: $name },
        dataType: "json"
      })
      .done((data) => {
        // console.log(data)
        renderDataFromSearch(data)
      })
      .fail((err) => {
        errorMessage(true, 'Something wrong')
      })
  }

  // Append menu panel based on session
  $('#menu').append(Handlebars.compile($menuPanel))

  // Get initial data
  getData()

  // Search input
  $('#search input').keyup((e) => {
    searchData()
  })

})
