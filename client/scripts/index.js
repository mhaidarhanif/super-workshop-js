/*global $, jQuery, EJS, Handlebars, Router */
$(document).ready(function () {
  // Configuration
  const api = `http://localhost:3000/api`

  // jQuery objects
  let $description = $('#description')

  // Handlebars templates
  let $listOfBooks = $('#books-list-template').html()

  // ---------------------------------------------------------------------------
  // jQuery DOM

  $description.html(`Changed description`)

  // ---------------------------------------------------------------------------
  // Handlebars DOM

  // Get all data from server
  $.getJSON(`${api}/books`, (data) => {
    // console.log(data)
    // console.log($listOfBooks)

    let test = Handlebars.compile($listOfBooks)
    $('#books-list-table').append(test(data))

  })




})
