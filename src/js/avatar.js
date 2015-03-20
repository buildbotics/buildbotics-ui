'use strict'


module.exports = {
  replace: true,
  template: '<img class="avatar" v-attr="src:avatar"/>',
  paramAttributes: ['name', 'size'],

  watch: {
    name: function (name) {
      var size = this.size || 'thumb';
      var url = '/api/profiles/' + name + '/avatar' + '?size=' + size;
      if (!name) url = '';

      this.$set('avatar', url);
    }
  }
}
