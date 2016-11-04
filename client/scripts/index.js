/*global $, jQuery, EJS, Handlebars, Router */
$(document).ready(function () {
  let api = `http://localhost:3000/api`
  let $description = $('#description')

  // Get all data from server
  $.getJSON(`${api}/books`, function (data) {
    // console.log(data)
    $description.html(`${data[0].isbn}: ${data[0].name} ($${data[0].price})`)
  })

})
