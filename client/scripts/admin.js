/*global $, jQuery, EJS, Handlebars, Router */
$(document).ready(function () {

  if (Auth.getUser().username !== 'admin') window.location = '/'

  const $bookEditor = $('#book-editor')
  const $bookEditorTemplate = $('#book-editor-template').html()

  compileMenu()
  compileEmptyBookEditor()
  compileBooksHeader()
  getDataFromAPI()

  // ---------------------------------------------------------------------------
  // VIEW+ACTION: Books Action
  // ---------------------------------------------------------------------------

  function compileEmptyBookEditor() {

    $bookEditor.append(Handlebars.compile($bookEditorTemplate))
    $bookEditor.hide()

    // --------
    // Book Add

    // Show book editor template
    $('#book-add-button').on('click', (e) => {
      $bookEditor.show()
    })

    // onSubmit, post a new book
    $('#book-editor-form').submit((e) => {
      e.preventDefault()
      let dataInput = {
        isbn: $('#book-editor-form input[name=isbn]').val(),
        name: $('#book-editor-form input[name=name]').val(),
        price: $('#book-editor-form input[name=price]').val(),
      }
      $.ajax({
          method: 'POST',
          url: $('#book-editor-form').attr('action'),
          data: dataInput,
          headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
        })
        .done((data) => {
          getDataFromAPI()
        })
        .fail((xhr, textStatus, err) => {
          alert(JSON.parse(xhr.responseText).message)
        })
    })

    // onClick, cancel the form
    $('#book-editor-form input[name=addCancel]').on('click', (e) => {
      $bookEditor.hide()
    })

    // --------------
    // Book Seed Some

    $('#book-seed-button').on('click', () => {
      $.ajax({
          url: `${api}/books/seed`,
          headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
        })
        .done((data) => {
          getDataFromAPI()
        })
        .fail((xhr, textStatus, err) => {
          alert(JSON.parse(xhr.responseText).message)
        })
    })

    // -------------
    // Book Seed Lot

    $('#book-seed-lot-button').on('click', () => {
      $.ajax({
          url: `${api}/books/seedlot`,
          headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
        })
        .done((data) => {
          getDataFromAPI()
        })
        .fail((xhr, textStatus, err) => {
          alert(JSON.parse(xhr.responseText).message)
        })
    })

    // ---------------
    // Book Delete All

    $('#book-delete-all-button').on('click', () => {
      $.ajax({
          method: 'DELETE',
          url: `${api}/books`,
          headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
        })
        .done((data) => {
          getDataFromAPI()
        })
        .fail((xhr, textStatus, err) => {
          alert(JSON.parse(xhr.responseText).message)
        })
    })

  }

  // ---------
  // Book List

  // Update book by ISBN. But first, get its data.
  $booksListTable.on('click', 'td.update', function () {
    // $('#book-editor').show()
    let isbn = $(this).attr('data-update')
    $.getJSON({
        url: `${api}/books/${isbn}`,
        headers: { 'Authorization': Auth.getToken() }
      })
      .done((data) => {
        compileBookEditor(data)
        $('#book-isbn').val(data.isbn)
        $('#book-name').val(data.name)
        $('#book-price').val(data.price)
        $('#book-editor').show()
      }).fail((err) => {
        console.log('Error', err)
      })
  })

  // Remove book by ISBN

  $booksListTable.on('click', 'td.remove', function () {
    // $('#book-editor').hide()
    let isbn = $(this).attr('data-remove')
    if (confirm(`Sure to delete book with ISBN ${isbn}?`)) {
      $.ajax({
          method: 'DELETE',
          url: `${api}/books/${isbn}`,
          headers: { 'Authorization': localStorage.getItem('token') }
        })
        .done((data) => {
          compileBooksContent(getDataFromAPI())
        }).fail((err) => {
          console.log('Error', err)
        })
    }
  })

})
