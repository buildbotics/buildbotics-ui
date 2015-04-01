'use strict'


module.exports = {
  replace: true,
  template: '#file-editor-template',


  data: function () {
    return {
      modified: false
    }
  },


  events: {
    'file-editor-show': function (file) {this.open(file)}
  },


  ready: function () {
    $(this.$el)
      .find('input[name="visibility"]')
      .change(this.update);
  },


  methods: {
    // From overlay
    overlayClick: function () {this.cancel()},


    open: function (file) {
      this.addOverlay(undefined, this.$parent.$el);

      this.file = file;
      this.$set('name', file.name);

      $(this.$el)
        .find('input[value="' + file.visibility + '"]')
        .prop('checked', true)

      this.$set('caption', file.caption);

      this.$set('show', true);
    },


    close: function () {
      this.removeOverlay();
      this.show = false;
    },


    getVisibility: function () {
      return $(this.$el).find('input[type=radio]:checked').val();
    },


    visibilityChanged: function () {
      return this.getVisibility() != this.file.visibility;
    },


    nameChanged: function () {
      return this.name != this.file.name;
    },


    captionChanged: function () {
      return this.caption != this.file.caption;
    },


    update: function () {
      this.modified =
        this.visibilityChanged() || this.nameChanged() || this.captionChanged();
    },


    cancel: function () {
      this.$dispatch('file-editor.cancel');
      this.close();
    },


    save: function () {
      var data = {
        visibility: this.visibilityChanged() ? this.getVisibility() : undefined,
        rename: this.nameChanged() ? this.name : undefined,
        caption: this.captionChanged() ? this.caption : undefined
      }

      this.$dispatch('file-manager.save', this.file, data)
      this.close();
    }
  },


  mixins: [require('./overlay')('modal')]
}
