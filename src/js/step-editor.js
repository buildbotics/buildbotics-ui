'use strict'

var notify = require('./notify');


module.exports = {
  replace: true,
  template: '#step-editor-template',
  paramAttributes: ['thing'],


  data: function () {
    return {
      steps: [{title: 'Introduction', text: ''}],
      current: 0,
      modified: false,
      stepsModified: false,
      editorModified: {}
    }
  },


  events: {
    'markdown-editor.modified': function (modified, ref) {
      this.editorModified[ref] = modified;

      var someEditorModified = false;
      $.each(this.editorModified, function (ref, modified) {
        someEditorModified = someEditorModified || modified;
      });

      this.modified = someEditorModified || this.stepsModified;
    },


    'modal-response': function (button) {
      if (button == 'delete') this.delete();
      return false; // Cancel event propagation
    }
  },


  ready: function () {
    this.$set('width', $(this.$el).width());

    if (this.thing.instructions)
      this.steps = this.thing.instructions.map(function (step) {
        return $.extend({}, step)
      })
  },


  methods: {
    // From protect-changes
    needsSave: function () {return this.modified},


    saveChanges: function (defer) {
      this.save(defer);
    },


    discardChanges: function (defer) {
      this.markClean();
      defer.resolve();
    },


    getStepName: function (index) {
      return index ? 'Step ' + index : 'Introduction';
    },


    getStepTitle: function (index) {
      var title = this.steps[index].title;
      if (title) title = title.trim();

      return (!index && title) ? title :
        this.getStepName(index) + (index ? ': ' + title : '')
    },


    markDirty: function () {
      this.modified = this.stepsModified = true;
    },


    markClean: function () {
      this.modified = this.stepsModified = false;
      this.editorModified = {};
      this.$broadcast('markdown-editor.mark-clean');
    },


    save: function (defer) {
      var data = {instructions: this.steps};

      $bb.put(this.$parent.getAPIURL(), data).done(function () {
        this.$set('thing.instructions', this.steps);
        if (typeof defer != 'undefined') defer.resolve();
        this.markClean();

      }.bind(this)).fail(function () {
        if (typeof defer != 'undefined') defer.reject();
        notify.error('Failed to save instructions');
      })
    },


    insert: function () {
      this.steps.splice(this.current + 1, 0, {title: '', text: ''});
      this.markDirty();

      Vue.nextTick(function () {
        this.go(this.current + 1);
      }.bind(this))
    },


    go: function (index) {
      if (index < 0) index = 0;
      if (this.steps.length <= index) index = this.steps.length - 1;

      if (index == this.current) return;

      $(this.$el).find('.track').css({
        transform: 'translate3d(' + -this.width * index + 'px, 0, 0)'
      });

      this.current = index;
      this.$broadcast('markdown-editor.refresh');
    },


    next: function () {this.go(this.current + 1)},
    prev: function () {this.go(this.current - 1)},


    askDelete: function () {
      this.$broadcast('modal-show-delete');
    },


    delete: function () {
      if (this.current == 0) {
        notify.error('Cannot delete Introduction');
        return;
      }

      this.steps.splice(this.current, 1);
      this.markDirty();
      this.go(this.current - 1);
    }
  },


  mixins: [require('./protect-changes')]
}
