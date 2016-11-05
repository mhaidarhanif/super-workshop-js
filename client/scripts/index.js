/*global $, jQuery, EJS, Handlebars, Router */
$(document).ready(function () {

  const api = `http://localhost:3000/api`
  const $menuPanel = $('#menu-panel-template').html()
  const $booksListTable = $('#books-list-table')
  const $booksList = $('#books-list-template').html()

  function getData() {
    $.getJSON(`${api}/books`, (data) => {
      let list = Handlebars.compile($booksList)
      $booksListTable.append(list(data))
    })
  }

  function searchData() {
    let $searhInput = $('input#search').val();
    $.ajax({
        method: "POST",
        url: "/api/data/search",
        data: { letter: searhLetter, frequency: serachFrequency },
        dataType: "json"
      })
      .done(function (data) {
        drawTable(data);
      }).fail(function () {
        errorMessage(true, "something wrong, please call administrator");
      });
  }

  // Append menu panel based on session
  $('#menu').append(Handlebars.compile($menuPanel))

  // Get initial data
  getData()

  // Search input
  $('input#search').keyup((e) => {
    searchData()
  })

})
