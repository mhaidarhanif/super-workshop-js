/*global $, jQuery, EJS, Handlebars, Router */
$(document).ready(function () {
  const api = `http://localhost:3000/api`

  let $listOfBooks = $('#books-list-template-admin').html()

  // Get all data from server
  $.getJSON(`${api}/books`, (data) => {
    // console.log(data)
    // console.log($listOfBooks)
    let test = Handlebars.compile($listOfBooks)
    $('#books-list-table').append(test(data))
  })

})
