(function ($) {
  var defaultOptions = {
      margin: 18
  };

  'use strict';

  $.extend(true, $.trumbowyg, {
    langs: {
        de: {
            floating: {
              left: 'linksbündig floaten',
              right: 'rechtsbündig floaten'
            }
        },
        en: {
            floating: {
              left: 'float left',
              right: 'float right'
            }
        },
    },
    plugins: {
      floating: {
        init: function (t) {
          t.o.plugins.floating = $.extend(true, {}, defaultOptions, t.o.plugins.floating || {});

          var getSelectionElement = function() {
            var node = t.doc.getSelection().focusNode;
            if (node.nodeType == Node.TEXT_NODE) node = node.parentNode;
            return $(node);
          };

          var left = function() {
            t.saveRange();
            var el = getSelectionElement();

            el.css('float', "left");
            el.css('margin-left', 0);
            el.css('margin-right', t.o.plugins.floating.margin + "px");
            t.syncTextarea();
          };

          var right = function() {
            t.saveRange();
            var el = getSelectionElement();

            el.css('float', "right");
            el.css('margin-left', t.o.plugins.floating.margin + "px");
            el.css('margin-right', 0);
            t.syncTextarea();
          };

          t.addBtnDef('floatleft', {
            title: t.lang.floating['left'],
            text: '<i class="fa fa-window-maximize fa-rotate-90" />',
            hasIcon: false,
            fn: left
          });

          t.addBtnDef('floatright', {
            title: t.lang.floating['right'],
            text: '<i class="fa fa-window-maximize fa-rotate-270" />',
            hasIcon: false,
            fn: right
          });
        }
      }
    }
  });
})(jQuery);
