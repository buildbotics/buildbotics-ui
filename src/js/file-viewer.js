'use strict'


module.exports = {
  replace: true,
  template: '#file-viewer-template',
  paramAttributes: ['files'],
  components: {'file-view': require('./file-view')}
}
