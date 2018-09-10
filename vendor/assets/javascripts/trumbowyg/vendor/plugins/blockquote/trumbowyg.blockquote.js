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
