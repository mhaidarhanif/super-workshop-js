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
        url: `${api}/books/actions/seed`,
        headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
      })
        .done((data) => {
          getDataFromAPI()
        })
        .fail((xhr, textStatus, err) => {
          sweetAlert('Sorry!', JSON.parse(xhr.responseText).message, 'error')
        })
    })

    // -------------
    // Book Seed Lot

    $('#book-seed-lot-button').on('click', () => {
      $.ajax({
        url: `${api}/books/actions/seed-lot`,
        headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
      })
        .done((data) => {
          getDataFromAPI()
        })
        .fail((xhr, textStatus, err) => {
          sweetAlert('Sorry!', JSON.parse(xhr.responseText).message, 'error')
        })
    })

    // ---------------
    // Book Delete All

    $('#book-delete-all-button').on('click', () => {
      swal({
        title: `Sure to delete all books?`,
        text: 'You will not be able to recover this!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, delete them all!',
        cancelButtonText: 'No, let them be!',
        closeOnConfirm: true,
        closeOnCancel: true
      }, function (isConfirm) {
        if (isConfirm) {
          // Request to DELETE ALL
          $.ajax({
            method: 'DELETE',
            url: `${api}/books`,
            headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
          })
          .done(data => getDataFromAPI())
          .fail((xhr, textStatus, err) => sweetAlert('Sorry!', JSON.parse(xhr.responseText).message, 'error'))
        } else {
          // Cancel DELETE all
          swal('Cancelled', `All books are safe. :)`, 'error')
        }
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
        sweetAlert('Sorry!', JSON.parse(xhr.responseText).message, 'error')
      })
  }

  function confirmDeleteBook (isbn) {
    swal({
      title: `Sure to delete book with ISBN ${isbn}?`,
      text: 'You will not be able to recover this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, let it be!',
      closeOnConfirm: true,
      closeOnCancel: true
    }, function (isConfirm) {
      if (isConfirm) {
        // Request to DELETE
        $.ajax({
          method: 'DELETE',
          url: `${api}/books/${isbn}`,
          headers: { 'Authorization': localStorage.getItem('token') }
        })
        .done(data => compileBooksContent(getDataFromAPI()))
        .fail(err => console.log('Error', err))
        // Successfully deleted
        swal('Deleted!', `Book with ISBN ${isbn} has been deleted.`, 'success')
      } else {
        // Cancel DELETE
        swal('Cancelled', `Book with ISBN ${isbn} is safe. :)`, 'error')
      }
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
    confirmDeleteBook(isbn)
  })

  // ---------------------------------------------------------------------------
  // ENERGIZE!
  // ---------------------------------------------------------------------------

  compileMenu()
  compileBookEditor()
  compileBooksHeader()
  getDataFromAPI()
})
