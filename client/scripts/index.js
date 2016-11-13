/*global $, jQuery, EJS, Handlebars, Router */
$(document).ready(function () {

  compileMenu()
  compileBooksHeader()
  getDataFromAPI()

  $('script[type="text/x-handlebars-template"]').remove()

  setTimeout(function () {
    $('#books-list-table').DataTable()
  }, 500);

})
