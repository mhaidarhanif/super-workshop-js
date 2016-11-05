/*global $, jQuery, EJS, Handlebars, Router */
$(document).ready(function () {

  const api = `http://localhost:3000/api`
  const $menuPanelTemplate = $('#menu-panel-template').html()

  const $bookEditor = $('#book-editor')
  const $bookEditorTemplate = $('#book-editor-template').html()

  const $booksListTable = $('#books-list-table')
  const $booksListHeader = $('#books-list-header')
  const $booksListHeaderTemplate = $('#books-list-header-template').html()
  const $booksListContent = $('#books-list-content')
  const $booksListContentTemplate = $('#books-list-content-template').html()

  // ---------------------------------------------------------------------------
  // Account / User / Profile
  // ---------------------------------------------------------------------------

  function getUser() {
    let token = localStorage.getItem('token')
    if (!token) return {}
    else {
      let user = jwt_decode(token)
      return user
    }
  }

  // ---------------------------------------------------------------------------
  // Book Editor
  // ---------------------------------------------------------------------------

  function compileEmptyBookEditor() {
    let template = Handlebars.compile($bookEditorTemplate)
    $bookEditor.append(template)
    $bookEditor.hide()
  }

  // Show book editor template
  $('#book-add-button').on('click', (e) => {
    $bookEditor.show()
  })

  // Template: onSubmit, post a new book
  $('#book-editor-form').submit((e) => {
    e.preventDefault()
    $.post({
        url: $('#book-editor-form').attr('action'),
        data: {
          isbn: $('#book-editor-form input[name=isbn]').val(),
          name: $('#book-editor-form input[name=name]').val(),
          price: $('#book-editor-form input[name=price]').val(),
        }
      })
      .done((data) => {
        getDataFromAPI()
      })
      .fail((xhr, textStatus, err) => {
        alert(JSON.parse(xhr.responseText).message)
      })
  })

  // Template: onClick, cancel the form
  $('#book-editor-form input[name=addCancel]').on('click', (e) => {
    $bookEditor.hide()
  })

  // ---------------------------------------------------------------------------
  // Books List
  // ---------------------------------------------------------------------------

  function compileBooksHeader() {
    let template = Handlebars.compile($booksListHeaderTemplate)
    $booksListHeader.append(template({ user: getUser() }))
  }

  function compileBooksContent(data) {
    let template = Handlebars.compile($booksListContentTemplate)
    $booksListContent.html(template({ books: data }))
  }

  function getDataFromAPI() {
    $.getJSON(`${api}/books`, (data) => {
      compileBooksContent(data)
    })
  }

  function searchData() {
    let $isbn = $('input#searchByISBN').val()
    let $name = $('input#searchByName').val()
      // console.log($searchInput)
    $.ajax({
        method: 'POST',
        url: `${api}/books/search`,
        data: { isbn: $isbn, name: $name },
        dataType: 'json'
      })
      .done((data) => {
        compileBooksContent(data)
      })
      .fail((err) => {
        console.log('Error', err)
      })
  }

  // ---------------------------------------------------------------------------
  // Books Action
  // ---------------------------------------------------------------------------

  // Update book by ISBN
  // But first, get its data first
  $booksListContent.on('click', 'td.update', function () {
    // $('#book-editor').show()
    let isbn = $(this).attr('data-update')
    $.getJSON({
        method: 'GET',
        url: `${api}/books/${isbn}`,
        dataType: 'json'
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
  $booksListContent.on('click', 'td.remove', function () {
    // $('#book-editor').hide()
    if (confirm('Sure to delete?')) {
      let isbn = $(this).attr('data-remove')
      console.log(isbn)
      $.ajax({
          method: 'DELETE',
          url: `${api}/books/${isbn}`,
          dataType: 'json'
        })
        .done((data) => {
          compileBooksContent(getDataFromAPI())
        }).fail((err) => {
          console.log('Error', err)
        })
    }
  })

  // ---------------------------------------------------------------------------
  // Energize!
  // ---------------------------------------------------------------------------

  // Append menu panel based on user
  let user = getUser()
  $('#menu').append(Handlebars.compile($menuPanelTemplate)(user))

  // Instantiate the book editor
  compileEmptyBookEditor()

  // Get initial data
  compileBooksHeader()
  getDataFromAPI()

  // Search input
  $('#search input').keyup((e) => {
    searchData()
  })

})
