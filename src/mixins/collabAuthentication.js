var hbpHello = require('../assets/hbp.hello.js').hellojs
// replace this with your collab app id
hbpHello.init({
  hbp: '74b1a180-3646-45ac-b53c-ebd905cec418'
})

export default {
  data () {
    return {
      authenticated: false,
      collabAPI: 'https://services.humanbrainproject.eu/collab/v0/'
    }
  },
  methods: {
    login (displayMethod) {
      if (displayMethod === undefined) { displayMethod = 'page' }
      var that = this
      hbpHello.login('hbp', {'display': displayMethod, force: false}).then(function (event) {
        if (event.authResponse.access_token) {
          that.saveAuthentication(that, event.authResponse)
        }
      }, function (e) {
        console.debug('Authentication Error', e)
      });
    },
    logout () {
      return new Promise(function (resolve, reject) {
        var that = this
        hbpHello.logout('hbp').then(function (event) {
          that.authenticated = false;
          console.debug('User Logout OK')
          resolve();
        }, function (e) {
          console.debug('Logout Error', e)
          reject();
        });
      })
    },
    searchCollab (param) {
      this.collabResults = []
      var that = this
      return new Promise(function (resolve, reject) {
        that.$http.get(that.collabAPI + 'mycollabs/?search=' + param).then(function (response) {
          if (param.length > 0) {
            resolve(response.body.results)
          }
        }, function (responseError) {
          if (responseError.status === 401) {
            that.collabResults.push = 'Getting your collabs ...'
            that.logout().then(function () {
              console.debug('Getting new token')
              that.login();
            })
          } else {
            reject(responseError)
          }
        })
      })
    },
    getLocalToken () {
      var helloStorage = window.localStorage.hello
      if (helloStorage) {
        var hbpStorage = JSON.parse(helloStorage).hbp
      }
      return hbpStorage
    }
  }
}
