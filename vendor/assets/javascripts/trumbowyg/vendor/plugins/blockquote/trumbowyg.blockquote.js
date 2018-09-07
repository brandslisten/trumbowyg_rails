(function($) {
  'use strict';

  function buildButtonDef(trumbowyg) {
    return {
      fn: function() {
        var parentQuote = trumbowyg.range.commonAncestorContainer.parentElement.closest('blockquote');
        if (parentQuote) return;
        trumbowyg.execCmd('formatBlock', 'blockquote');
      }
    };
  }

  $.extend(true, $.trumbowyg, {
    plugins: {
      blockquote: {
        init: function(trumbowyg) {
          trumbowyg.addBtnDef('blockquote', buildButtonDef(trumbowyg));
        }
      }
    }
  });
})(jQuery);
