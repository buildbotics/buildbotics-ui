'use strict'

function throttle(func, threshold) {
  var timeout;
  var self;
  var args;

  return function debounced() {
    self = this;
    args = arguments;

    function delayed () {
      func.apply(self, args);
      timeout = null;
    }

    if (!timeout) timeout = setTimeout(delayed, threshold || 100);
  }
}


module.exports = {
  template: '#markdown-editor-template',
  paramAttributes: ['field', 'placeholder'],


  data: function () {
    return {
      editing: true,
      showHelp: false,
      helpSection: 'block',
      helpSubsection: 'breaks'
    }
  },


  events: {
    // Listen for reset signal
    'markdown-editor.reset': function () {
      this.edit();
      this.editor.setValue(this.$parent.$get(this.field));
      Vue.nextTick(function () {this.editor.refresh()});
    }
  },


  compiled: function () {
    var self = this;
    var target = $(this.$el).find('.markdown-content');

    this.editor = CodeMirror(target[0], {
      placeholder: this.placeholder,
      lineWrapping: true,
      tabSize: 2,
      dragDrop: false,
      mode: 'gfm',
      value: this.$parent.$get(this.field),
    })

    // Bind editor changes to component
    this.handler = function (editor) {
      this.$parent.$set(this.field, editor.getValue());
    }.bind(this);

    this.editor.on('change', this.handler);

    Vue.nextTick(function () {self.editor.refresh()});
  },


  beforeDestroy: function () {
    this.editor.off('change', this.handler);
  },


  methods: {
    edit: function (item) {
      $(this.$el).find('.edit-tool').addClass('active');
      $(this.$el).find('.preview-tool').removeClass('active');
      this.editing = true
    },


    preview: function (item) {
      $(this.$el).find('.markdown-preview')
        .html(marked(this.editor.getValue()));

      $(this.$el).find('.edit-tool').removeClass('active');
      $(this.$el).find('.preview-tool').addClass('active');
      this.editing = false;
    },


    insert: function (text) {
      var selection = this.editor.getSelection();
      this.editor.replaceSelection(selection + text);
    },


    prefix: function (prefix) {
      var selections = this.editor.getSelections();

      for (var i = 0; i < selections.length; i++)
        selections[i] = prefix + selections[i].split('\n').join('\n' + prefix);

      this.editor.replaceSelections(selections);
    },


    wrap: function (prefix, suffix) {
      if (typeof suffix == 'undefined') suffix = prefix;

      var selections = this.editor.getSelections();

      for (var i = 0; i < selections.length; i++)
        selections[i] =
        prefix + selections[i].split('\n').join(suffix + '\n' + prefix) +
        suffix;

      this.editor.replaceSelections(selections);
    },


    image: function () {
      this.wrap('![', '](replace with image link)');
    },


    link: function () {
      this.wrap('[', '](replace with link)');
    },


    code: function () {
      var selections = this.editor.getSelections();

      for (var i = 0; i < selections.length; i++) {
        if (selections[i].indexOf('\n') == -1)
          selections[i] = '```' + selections[i] + '```';

        else selections[i] = '```\n' + selections[i] + '\n```\n';
      }

      this.editor.replaceSelections(selections);
    },


    help: function () {
      this.showHelp = !this.showHelp;
    },


    setHelpSection: function (section) {
      if (this.helpSection == section) return;
      this.helpSection = section;

      switch (section) {
      case 'block': this.helpSubsection = 'breaks'; break;
      case 'span': this.helpSubsection = 'links'; break;
      case 'misc': this.helpSubsection = 'auto links'; break;
      }
    },


    setHelpSubsection: function (subsection) {
      this.helpSubsection = subsection;
    }
  }
}
