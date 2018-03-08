(function ($) {
  var defaultOptions = {
      step: 20,
      max: 1000
  };

  'use strict';

  $.extend(true, $.trumbowyg, {
    langs: {
        de: {
            indentation: {
              indent: 'Einzug vergrößern',
              outdent: 'Einzug verkleinern'
            }
        },
        en: {
            indentation: {
              indent: 'Indent',
              outdent: 'Outdent'
            }
        },
    },
    plugins: {
      indentation: {
        init: function (t) {
          t.o.plugins.indentation = $.extend(true, {}, defaultOptions, t.o.plugins.indentation || {});

          var getSelectionElement = function() {
            var node = t.doc.getSelection().focusNode;
            if (node.nodeType == Node.TEXT_NODE) node = node.parentNode;
            return $(node);
          };

          var indent = function() {
            t.saveRange();
            var el = getSelectionElement(),
                padding = parseInt(el.css('padding-left'));

            padding = Math.min(padding + t.o.plugins.indentation.step, t.o.plugins.indentation.max);
            el.css('padding-left', padding + "px");
            t.syncTextarea();
          };

          var outdent = function() {
            t.saveRange();
            var el = getSelectionElement(),
                padding = parseInt(el.css('padding-left'));

            padding = Math.max(0, padding - t.o.plugins.indentation.step);
            el.css('padding-left', padding + "px");
            t.syncTextarea();
          };

          t.addBtnDef('indent', {
            title: t.lang.indentation['indent'],
            text: '<i class="fa fa-indent" />',
            hasIcon: false,
            fn: indent
          });

          t.addBtnDef('outdent', {
            title: t.lang.indentation['outdent'],
            text: '<i class="fa fa-outdent" />',
            hasIcon: false,
            fn: outdent
          });
        }
      }
    }
  });
})(jQuery);
