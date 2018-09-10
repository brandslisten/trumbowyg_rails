/* ===========================================================
 * trumbowyg.blockquote.js v0.1
 * Custom blockquote plugin for Brandslisten Trumbowyg Editor
 * https://github.com/brandslisten/trumbowyg_rails
 * ===========================================================
 */

(function($) {
  'use strict';

  function isBlockquote(t) {
    return t.range.startContainer.parentElement.closest('blockquote');
  }

  function wrapBlockquote(t) {
    t.execCmd('formatBlock', 'blockquote');
  }

  function unwrapBlockquote(t) {
    $(isBlockquote(t))
      .contents()
      .unwrap('blockquote');
  }

  function blockquoteButton(t) {
    return {
      fn: function() {
        isBlockquote(t) ? unwrapBlockquote(t) : wrapBlockquote(t);
      }
    };
  }

  $.extend(true, $.trumbowyg, {
    plugins: {
      blockquote: {
        init: function(t) {
          t.addBtnDef('blockquote', blockquoteButton(t));
        }
      }
    }
  });
})(jQuery);
