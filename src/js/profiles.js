'use strict'


module.exports = {
  replace: true,
  template: '#profiles-template',
  paramAttributes: ['profiles', 'small'],


  ready: function () {
    $(this.$el).addClass('profiles-' + (this.small ? 'small' : 'large'));
  },


  methods: {
    getPicture: function (profile) {
      var avatar = profile.avatar;
      avatar = avatar.replace(/\?sz=\d+$/, '?sz=150'); // Google
      avatar =
        avatar.replace(/\?type=small$/, '?width=150&height=150'); // Facebook

      return avatar.replace(/^https?:/, '');
    }
  }
}
