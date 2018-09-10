(function($) {
  'use strict';

  function blockquoteContainer(t) {
    return (
      t.range.commonAncestorContainer.parentElement.closest('blockquote') ||
      t.range.commonAncestorContainer.nodeName.toLowerCase() === 'blockquote'
    );
  }

  function buildButtonDef(t) {
    return {
      fn: function() {
        !blockquoteContainer(t)
          ? t.execCmd('formatBlock', 'blockquote')
          : console.log('blockquote detected!');
      }
    };
  }

  $.extend(true, $.trumbowyg, {
    plugins: {
      blockquote: {
        init: function(t) {
          t.addBtnDef('blockquote', buildButtonDef(t));
        }
      }
    }
  });
})(jQuery);
