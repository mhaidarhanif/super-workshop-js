/*
global alert, confirm, localStorage
global $, Handlebars,
global api, Auth, getDataFromAPI
global $booksListTable
global compileMenu, compileBooksHeader, compileBooksContent
*/

$(document).ready(function () {
  if (Auth.getUser().username !== 'admin') window.location = '/'

  const $bookEditor = $('#book-editor')
  const $bookEditorTemplate = $('#book-editor-template').html()

  // ---------------------------------------------------------------------------
  // VIEW+ACTION: Books Action
  // ---------------------------------------------------------------------------

  function compileBookEditor () {
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

      let urlInput = $('#book-editor-form').attr('action')
      let isbnInput = $('#book-editor-form input[name=isbn]').val()
      let nameInput = $('#book-editor-form input[name=name]').val()
      let priceInput = $('#book-editor-form input[name=price]').val()
      let dataInput = {
        isbn: isbnInput,
        name: nameInput,
        price: priceInput
      }

      $.ajax({
        url: `${urlInput}/${isbnInput}`,
        success: (data) => {
          modifyBook('PUT', `${urlInput}/${isbnInput}`, dataInput)
        },
        error: (xhr, textStatus, err) => {
          // console.log(JSON.parse(xhr.responseText).message)
          modifyBook('POST', urlInput, dataInput)
        }
      })
    })

    // onClick, cancel the form
    $('#book-editor-form input[name=cancel]').on('click', (e) => {
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

  // -------------------
  // Book List Modifiers

  // Add or update book based on availability
  function modifyBook (methodInput, urlInput, dataInput) {
    // console.log(methodInput, urlInput, dataInput)
    $.ajax({
      method: methodInput,
      url: urlInput,
      data: dataInput,
      headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
    })
      .done((data) => {
        getDataFromAPI()
      })
      .fail((xhr, textStatus, err) => {
        alert(JSON.parse(xhr.responseText).message)
      })
  }

  // Update book by ISBN, only fill the input by its value
  $booksListTable.on('click', 'td.update', function () {
    let isbn = $(this).siblings('.isbn').html()
    let name = $(this).siblings('.name').html()
    let price = $(this).siblings('.price').children('span').html()

    $('#book-editor').show()
    $('#input-book-isbn').val(isbn)
    $('#input-book-name').val(name)
    $('#input-book-price').val(price)
  })

  // Remove book by ISBN
  $booksListTable.on('click', 'td.remove', function () {
    $('#book-editor').hide()
    let isbn = $(this).attr('data-remove')
    if (confirm(`Sure to delete book with ISBN ${isbn}?`)) {
      $.ajax({
        method: 'DELETE',
        url: `${api}/books/${isbn}`,
        headers: { 'Authorization': localStorage.getItem('token') }
      })
        .done((data) => {
          compileBooksContent(getDataFromAPI())
        })
        .fail((err) => {
          console.log('Error', err)
        })
    }
  })

  // ---------------------------------------------------------------------------
  // ENERGIZE!
  // ---------------------------------------------------------------------------

  compileMenu()
  compileBookEditor()
  compileBooksHeader()
  getDataFromAPI()
})
