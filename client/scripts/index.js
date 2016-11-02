$(document).ready(function () {
  let $description = $('#description')

  // GET DATA
  $.getJSON(`http://localhost:3000/books`, function (data) {
    console.log(data)
    $description.html(`${data[0].id}: ${data[0].name} ($${data[0].price})`)
  })

})
