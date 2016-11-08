/*global $, jQuery, EJS, Handlebars, Router */
$(document).ready(function () {

  if (getUser().username !== 'admin') window.location = '/'

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
  // Energize!
  // ---------------------------------------------------------------------------

  Handlebars.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
      return options.fn(this)
    }
    return options.inverse(this)
  })

  // Append menu panel based on authenticated user account
  $('#menu').append(Handlebars.compile($menuPanelTemplate)(getUser()))

  // Instantiate the book editor
  compileEmptyBookEditor()

  // Get initial data from server
  compileBooksHeader()
  getDataFromAPI()

  // Search input on typing
  $('#search input').keyup((e) => {
    searchData()
  })

  // ---------------------------------------------------------------------------
  // Account / User / Profile
  // ---------------------------------------------------------------------------

  function getUser() {
    let token = Auth.getToken()
    if (!token) return {}
    else {
      let user = jwt_decode(token)
      return user
    }
  }

  function signOut() {
    Auth.deauthenticateUser()
  }

  $('#menuSignOut').on('click', (e) => {
    signOut()
  })

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
        },
        headers: { 'Authorization': Auth.getToken() }
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
  // But first, get its data
  $booksListContent.on('click', 'td.update', function () {
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
  $booksListContent.on('click', 'td.remove', function () {
    // $('#book-editor').hide()
    if (confirm('Sure to delete?')) {
      let isbn = $(this).attr('data-remove')
      console.log(isbn)
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

const Auth = {
  authenticateUser: (token) => {
    localStorage.setItem('token', token);
  },
  isUserAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },
  deauthenticateUser: () => {
    localStorage.removeItem('token');
  },
  getToken: () => {
    return localStorage.getItem('token');
  }
}
