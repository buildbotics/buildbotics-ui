'use strict'

var debounce = require('./debounce');
var buttons = require('./buttons');


module.exports = {
  replace: true,
  template: '#markdown-editor-template',
  paramAttributes:
    ['field', 'placeholder', 'max-length', 'media', 'buttons', 'ref'],


  data: function () {
    return {
      fullscreen: false,
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


  components: {
    'link-selector': require('./link-selector'),
    'media-selector': require('./media-selector')
  },


  watch: {
    modified: function (newValue, oldValue) {
      if (newValue != oldValue) {
        this.$dispatch('markdown-editor.modified', newValue, this.ref)

        if (newValue) $(this.$el).addClass('modified');
        else $(this.$el).removeClass('modified');
      }
    }
  },


  events: {
    // Listen for reset signal
    'markdown-editor.reset': function () {this.reset()},
    'markdown-editor.refresh': function () {this.refresh()},
    'markdown-editor.mark-clean': function () {
      this.editor.markClean();
      this.modified = false;
    },

    'markdown-editor.fullscreen': function (fullscreen) {
      this.setFullscreen(fullscreen);
    },

    'media-selector-cancel': function () {return false},
    'media-selector-add': function (file, size) {
      var filename = file.url.replace(/^.*\//, '');
      this.wrap('![', '](' + filename + '?size=' + size + ')');
      return false;
    },

    'link-selector-cancel': function () {return false},
    'link-selector-add': function (link, text) {
      this.editor.replaceSelection('[' + text + '](' + link + ')');
      return false;
    }
  },


  compiled: function () {
    // Reference
    if (typeof this.ref == 'undefined') this.ref = Math.random();

    // Buttons
    if (this.buttons)
      $(this.$el)
      .find('> .actions')
      .prepend(buttons.create(this.buttons, function (response) {
        this.$dispatch('markdown-editor.response', response);
      }.bind(this)));

    // Create editor
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

    // Bind field changes
    this.$parent.$watch(this.field, function (value) {
      if (value == this.editor.getValue()) return;
      this.editor.setValue(value);
      this.editor.markClean();
      this.modified = false;
    }.bind(this))


    // Save preview pointer
    this.preview = $(this.$el).find('.markdown-preview-content');
  },


  beforeDestroy: function () {
    this.editor.off('change', this.onChange);
  },


  methods: {
    exitFullscreenOnEscape: function (e) {
      e = e || window.event;
      if (e.keyCode == 27) this.setFullscreen(false);
    },


    setFullscreen: function (fullscreen) {
      this.fullscreen = fullscreen;

      if (this.fullscreen) {
        $(this.$el).addClass('fullscreen');
        this.updatePreview();
        this.editor.on('change', this.updatePreview);
        document.addEventListener('keyup', this.exitFullscreenOnEscape);
        this.refresh();

        $('body').css('overflow-y', 'hidden');
        this.$el.scrollTo(0, 0);

      } else {
        $(this.$el).removeClass('fullscreen');
        this.editor.off('change', this.updatePreview);
        document.removeEventListener('keyup', this.exitFullscreenOnEscape);

        $('body').css('overflow-y', '');
      }
    },


    toggleFullscreen: function () {
      this.setFullscreen(!this.fullscreen);
    },


    focusEditor: function () {
      this.editor.focus();
      if (typeof this.editor.getCursor().xRel == 'undefined')
        this.editor.setCursor(this.editor.lineCount(), 0)
    },


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


    updatePreviewNow: function () {
      this.preview.html(marked(this.editor.getValue()));
    },

    updatePreview: debounce(250, function () {
      this.updatePreviewNow();
    }),


    showPreview: function (item) {
      this.updatePreviewNow();
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


    addMedia: function () {
      this.$broadcast('media-selector-show');
    },


    link: function () {
      this.$broadcast('link-selector-show', this.editor.getSelection());
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
