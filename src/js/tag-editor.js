// This file based on code from https://github.com/hnakamur/vue.tag-editor.js
// Copyright declaration from original code follows:
//
// The MIT License (MIT)
// Copyright (c) 2014 Hiroaki Nakamura
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict'


var measure = {
  replace: true,
  template: '#tag-editor-tag-measure-template',
  data: function () {return {text: ''}}
}


var input = {
  replace: true,
  template: '#tag-editor-input-template',


  data: function () {
    return {
      separator: /[, ]+/,
      value: ''
    }
  },


  computed: {
    width: function() {
      var tagMeasure = this.$parent.$.tagMeasure;
      tagMeasure.text = this.value + 'WW';
      return tagMeasure.$el.clientWidth;
    }
  },


  methods: {
    deleteLastTag: function() {
      if (!this.value) this.$parent.tags.pop();
    },


    onBlur: function() {
      this.insertTags();
    },


    onKeyup: function() {
      this.value = this.value
        .replace(/[^\w ]/g, '') // a-z A-Z 0-9 and _
        .replace(/([^ ]\w{32})\w+/g, '$1') // 32 byte tags

      if (this.value && this.separator.test(this.value)) this.insertTags();
    },


    insertTags: function() {
      // Split tag text, text pasted from clipboard may contain separators
      var tags = this.$parent.tags;
      var words = this.value.split(this.separator);
      var changed = false;

      Vue.nextTick(function () {this.value = ''}.bind(this));

      for (var i = 0; i < words.length; i++) {
        var word = words[i];

        if (word && tags.indexOf(word) < 0) {
          tags.push(word);
          changed = true;
        }
      }

      if (changed) this.$emit('change');
    }
  }
}


module.exports = {
  replace: true,
  template: '#tag-editor-template',
  paramAttributes: ['tags'],


  components: {
    'tag-editer-tag-measure': measure,
    'tag-editor-input': input
  },


  ready: function () {
    var self = this;

    // Add/remove focused class
    $(this.$.input.$el).focusin(function () {
      $(self.$el).addClass('tag-editor-focused');
    })

    $(this.$.input.$el).focusout(function () {
      $(self.$el).removeClass('tag-editor-focused');
    })
  },


  methods: {
    refocus: function(e) {
      this.$.input.$el.focus();
    },


    'delete': function(e) {
      this.tags.splice(e.targetVM.$index, 1);
      this.changed();
    },


    changed: function () {
      this.$emit('change');
    }
  }
}
