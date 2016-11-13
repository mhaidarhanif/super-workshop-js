/*global $, jQuery, EJS, Handlebars, Router */

// ---------------------------------------------------------------------------
// GLOBAL VARIABLES
// ---------------------------------------------------------------------------

const api = `http://localhost:3000/api`
const auth = `http://localhost:3000/auth`

const $menuPanelTemplate = $('#menu-panel-template').html()
const $booksListTable = $('#books-list-table')
const $booksListHeader = $('#books-list-header')
const $booksListFooter = $('#books-list-footer')
const $booksListHeaderFooterTemplate = $('#books-list-header-footer-template').html()
const $booksListContent = $('#books-list-content')
const $booksListContentTemplate = $('#books-list-content-template').html()

// ---------------------------------------------------------------------------
// AUTHENTICATION
// ---------------------------------------------------------------------------

const Auth = {
  authenticateUser: (data) => {
    if (data.status === 'error') console.log('No account:', data)
    Auth.deauthenticateUser()
    console.log('data:', data)
    localStorage.setItem('token', data.token)
    console.log('token:', localStorage.getItem('token'))
    window.location = '/'
  },
  isUserAuthenticated: () => {
    console.log('token:', localStorage.getItem('token'))
    return localStorage.getItem('token') !== null
  },
  deauthenticateUser: () => {
    // $.ajax(`${api}/auth/signout`)
    // req.session.destroy()
    localStorage.removeItem('token')
  },
  getToken: () => {
    return localStorage.getItem('token')
  },
  getUser: () => {
    let token = Auth.getToken()
    if (!token) return {}
    else {
      return jwt_decode(token)
    }
  }
}

// ---------------------------------------------------------------------------
// VIEW
// ---------------------------------------------------------------------------

Handlebars.registerHelper('ifCond', function (v1, v2, options) {
  if (v1 === v2) return options.fn(this)
  else return options.inverse(this)
})

const compileMenu = () => {
  $('#menu').append(Handlebars.compile($menuPanelTemplate)(Auth.getUser()))

  // Search input on typing
  $('#search input').keyup((e) => {
    searchData()
  })

  // Sign out menu
  $('#menuSignOut').on('click', (e) => {
    Auth.deauthenticateUser()
  })
}

const compileBooksHeader = () => {
  let template = Handlebars.compile($booksListHeaderFooterTemplate)
  $booksListTable.append(template)
}

const compileBooksContent = (data) => {
  let template = Handlebars.compile($booksListContentTemplate)
  $booksListContent.html(template({ books: data }))
}

const getDataFromAPI = () => {
  $.getJSON(`${api}/books`, (data) => {
    compileBooksContent(data)
  })
}

const searchData = () => {
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
