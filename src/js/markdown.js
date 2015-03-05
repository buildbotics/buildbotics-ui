'use strict'


module.exports = {
  replace: true,
  template: '#markdown-editor-template',
  paramAttributes: ['field', 'placeholder', 'max-length', 'ref'],


  data: function () {
    return {
      editing: true,
      modified: false,
      canUndo: false,
      canRedo: false,
      length: 0,
      showHelp: false,
      helpSection: 'block',
      helpSubsection: 'breaks'
    }
  },


  watch: {
    modified: function (newValue, oldValue) {
      if (newValue != oldValue)
        this.$dispatch('markdown-editor.modified', newValue, this.ref)
    }
  },


  events: {
    // Listen for reset signal
    'markdown-editor.reset': function () {this.reset()},
    'markdown-editor.refresh': function () {this.refresh()},
    'markdown-editor.mark-clean': function () {
      this.editor.markClean();
      this.modified = false;
    }
  },


  compiled: function () {
    if (typeof this.ref == 'undefined') this.ref = Math.random();

    var target = $(this.$el).find('.markdown-content');
    var text = this.$parent.$get(this.field);
    this.length = text.length;

    this.editor = CodeMirror(target[0], {
      placeholder: this.placeholder,
      lineWrapping: true,
      tabSize: 2,
      dragDrop: false,
      mode: 'gfm',
      value: text
    })

    // Bind editor changes to component
    this.onChange = function (editor) {
      var text = editor.getValue();

      this.$parent.$set(this.field, text);
      this.modified = !this.editor.isClean();
      this.canUndo = 0 < this.editor.historySize().undo;
      this.$set('length', text.length);
    }.bind(this);

    this.editor.on('change', this.onChange);

    // On before change
    if (this.maxLength) {
      this.onBeforeChange = function (editor, change) {
        var text = change.text.join('\n');
        var space = this.maxLength - this.length;
        var removed = editor.getRange(change.from, change.to, '');

        if (removed) space += removed.length;

        if (space < text.length) {
          if (change.update) {
            if (0 <= space) text = text.substr(0, space).split('\n');
            else text = [''];

            change.update(undefined, undefined, text)

          } else change.cancel();
        }
      }.bind(this);

      this.editor.on('beforeChange', this.onBeforeChange);
    }

    Vue.nextTick(function () {this.editor.refresh()}.bind(this));
  },


  beforeDestroy: function () {
    this.editor.off('change', this.onChange);
  },


  methods: {
    reset: function () {
      this.refresh();
      this.editor.setValue(this.$parent.$get(this.field));
    },


    refresh: function () {
      this.showHelp = false;
      this.edit();
      Vue.nextTick(function () {this.editor.refresh()}.bind(this));
    },


    undo: function () {
      this.editor.undo();
      this.canRedo = true;
    },


    redo: function () {
      this.editor.redo();
      this.canRedo = 0 < this.editor.historySize().redo;
    },


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
