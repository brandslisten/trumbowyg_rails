/*/* ===========================================================
 * trumbowyg.insertemoji.js v1.0
 * InsertEmoji plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Sven Dunemann
 */

(function ($) {

    'use strict';
    $.extend(true, $.trumbowyg, {
        plugins: {
            insertemoji: {
                _focusNode: undefined,
                init: function (trumbowyg) {
                  trumbowyg.o.plugins.insertemoji = $.extend(true, {}, trumbowyg.o.plugins.insertemoji || {});

                  trumbowyg.$c.on('tbwinit', function(){
                    trumbowyg.$ed.on('mouseup keyup', function(){
                      trumbowyg.o.plugins.insertemoji._focusNode = trumbowyg.doc.getSelection().focusNode;
                    });

                    $(trumbowyg.doc).on('bl:form:emoji:insert', function(e, data){
                      var node = trumbowyg.o.plugins.insertemoji._focusNode,
                          range = trumbowyg.doc.createRange(),
                          newNode = trumbowyg.doc.createTextNode(data.alt);

                      if (trumbowyg.$ed.html() == "") {
                        // if there is no content in editor, create an empty span element
                        trumbowyg.$ed[0].appendChild(newNode);
                      } else {
                        // insert emoji behind last focused node
                        range.setStartAfter(node);
                        range.setEndAfter(node);
                        trumbowyg.doc.getSelection().removeAllRanges();
                        trumbowyg.doc.getSelection().addRange(range);

                        trumbowyg.range.insertNode(newNode);
                      }

                      // now set cursor right after emoji
                      range = trumbowyg.doc.createRange()
                      range.setStartAfter(newNode);
                      range.setEndAfter(newNode);
                      trumbowyg.doc.getSelection().removeAllRanges();
                      trumbowyg.doc.getSelection().addRange(range);

                      // save new node as focused node
                      trumbowyg.o.plugins.insertemoji._focusNode = trumbowyg.doc.getSelection().focusNode;
                      trumbowyg.saveRange();
                      trumbowyg.syncCode();
                    });

                  });
                }
            }
        }
    });
})(jQuery);
