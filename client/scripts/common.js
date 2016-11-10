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
