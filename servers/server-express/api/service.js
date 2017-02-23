// -----------------------------------------------------------------------------
// SERVICE HELPERS FOR RESPONSE HANDLING
// -----------------------------------------------------------------------------

module.exports = {

  // Send response when GET
  responseGET: (res, resource, err, data) => {
    const type = `get`
    const messageError = `Something wrong when getting ${resource}. Please try again.`
    const messageFail = `That ${resource} data is not found.`
    const statusError = 400   // BAD REQUEST
    const statusFail = 404    // NOT FOUND
    const statusSuccess = 200 // OK
    response({type, res, resource, err, data, messageError, messageFail, statusError, statusFail, statusSuccess})
  },

  // Send response when POST
  responsePOST: (res, resource, err, data) => {
    const type = `create`
    const messageError = `Something wrong when adding ${resource}. Please try again.`
    const messageFail = `That ${resource} data is already exist.`
    const statusError = 400   // BAD REQUEST
    const statusFail = 409    // CONFLICT
    const statusSuccess = 201 // CREATED
    response({type, res, resource, err, data, messageError, messageFail, statusError, statusFail, statusSuccess})
  },

  // Send response when PUT
  responsePUT: (res, resource, err, data) => {
    const type = `update`
    const messageError = `Something wrong when updating ${resource}. Please try again.`
    const messageFail = `That ${resource} data cannot be updated, probably because conflict.`
    const statusError = 400   // BAD REQUEST
    const statusFail = 304    // NOT MODIFIED
    const statusSuccess = 200 // OK
    response({type, res, resource, err, data, messageError, messageFail, statusError, statusFail, statusSuccess})
  },

  // Send response when DELETE
  responseDELETE: (res, resource, err, data) => {
    const type = `delete`
    const messageError = `Something wrong when deleting ${resource}. Please try again.`
    const messageFail = `That ${resource} data is already gone.`
    const statusError = 400   // BAD REQUEST
    const statusFail = 410    // GONE
    const statusSuccess = 200 // OK
    response({type, res, resource, err, data, messageError, messageFail, statusError, statusFail, statusSuccess})
  },

  // Response sender template
  response: (e) => { // event via object parameter and destructuring assignment
    if (e.err) {
      e.res.status(e.statusError).send({
        s: false,
        id: `${e.resource}_error`,
        e: `${e.err}`,
        m: e.messageError
      })
    } else if (!e.data) {
      e.res.status(e.statusFail).send({
        s: true,
        id: `${e.resource}_${e.type}_failed`,
        m: e.messageFail
      })
    } else {
      e.res.status(e.statusSuccess).send(e.data)
    }
  }
}
