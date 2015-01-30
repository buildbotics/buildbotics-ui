/*
 * Adapted from:
 *
 * jQCloud Plugin for jQuery
 *
 * Version 1.0.4
 *
 * Copyright 2011, Luca Ongaro
 * Licensed under the MIT license.
 *
 * Date: 2013-05-09 18:54:22 +0200
 */

'use strict';


// Pairwise overlap detection
function overlapping(a, b) {
  var al = a.left;
  var at = a.top;
  var aw = a.width;
  var ah = a.height;
  var bl = b.left;
  var bt = b.top;
  var bw = b.width;
  var bh = b.height;

  return Math.abs(2.0 * al + aw - 2.0 * bl - bw) < aw + bw + 10 &&
    Math.abs(2.0 * at + ah - 2.0 * bt - bh) < ah + bh;
}


// Helper function to test if an element overlaps others
function hitTest(target, placed) {
  // Check elements for overlap one by one, stop and return false as soon
  // as an overlap is found
  for (var i = 0; i < placed.length; i++)
    if (overlapping(target, placed[i])) return true;

  return false;
}


module.exports = function(element, word_array, options) {
  element = $(element);

  // Default options value
  var default_options = {
    width: element.width(),
    height: element.height(),
    encodeURI: true,
    removeOverflowing: true
  };

  options = $.extend(default_options, options || {});

  // Add the 'tag-cloud' class to the container for easy CSS styling, set
  // container width/height
  element
    .addClass('tag-cloud')
    .width(options.width)
    .height(options.height);

  // Make sure every weight is a number before sorting
  for (var i = 0; i < word_array.length; i++)
    word_array[i].weight = parseFloat(word_array[i].weight, 10);

  // Sort by weight from higest to lowest
  word_array.sort(function(a, b) {return b.weight - a.weight})

  var step = 2.0;
  var placed = [];
  var aspect = options.width / options.height;
  var highest = word_array[0].weight;
  var lowest = word_array[word_array.length - 1].weight;
  var maxBottom = options.height / 2.0;
  var minTop = options.height / 2.0;

  // Function to draw a word, by moving it in spiral until it finds a
  // suitable empty place. This will be iterated on each word.
  $.each(word_array, function (index, word) {
    var weight = 9;

    // Linearly map the original weight to a discrete scale from 1 to 10
    if (lowest < highest)
      weight = Math.round((word.weight - lowest) / (highest - lowest) * 9.0);

    // Append link if word.link attribute was set
    var content;
    if (word.link) {
      // If link is a string, then use it as the link href
      if (typeof word.link === 'string') word.link = {href: word.link};

      // Extend link html options with defaults
      if (options.encodeURI)
        word.link = $.extend(word.link, {
          href: encodeURI(word.link.href).replace(/'/g, '%27')
        });

      content = $('<a>').attr(word.link).text(word.text);

    } else content = word.text;

    // Create span
    var span = $('<span>')
      .addClass('w' + weight)
      .html(content)
      .appendTo(element);

    var width = span.width();
    var height = span.height();
    var cX = (options.width - width) / 2.0;;
    var cY = (options.height - height) / 2.0;
    var left = cX;
    var top = cY;

    // Save a reference to the style property, for better performance
    var style = span[0].style;
    style.position = 'absolute';
    style.left = left + 'px';
    style.top = top + 'px';

    var position = {
      left: left,
      top: top,
      width: width,
      height: height
    }

    var radius = 0.0;
    var count = 10000;
    while (hitTest(position, placed)) {
      // Move the word in a spiral
      radius += step;
      var angle = 360 * Math.random();

      position.left = cX + (radius * Math.cos(angle)) * aspect;
      position.top = cY + radius * Math.sin(angle);

      if (!--count) break;
    }

    style.left = (left = position.left) + 'px';
    style.top = (top = position.top) + 'px';

    if (top < minTop) minTop = top;
    var bottom = top + height;
    if (maxBottom < bottom) maxBottom = bottom;

    if (options.removeOverflowing &&
        (left < 0 || top < 0 || (left + width) > options.width ||
         (top + height) > options.height)) {
      span.remove()
      return;
    }

    placed.push(position);
  });

  // Move up to top
  if (0 < minTop) {
    element.find('span').each(function () {
      this.style.top = (parseFloat(this.style.top) - minTop + 5) + 'px';
    });

    element.height(maxBottom - minTop + 10);
  }
}
