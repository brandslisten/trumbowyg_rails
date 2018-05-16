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
                init: function (t) {
                  t.o.plugins.insertemoji = $.extend(true, {}, t.o.plugins.insertemoji || {});

                  t.$c.on('tbwinit', function(){
                    t.$ed.on('mouseup keyup', function(){
                      t.o.plugins.insertemoji._focusNode = t.doc.getSelection().focusNode;
                    });

                    $(t.doc).on('bl:form:emoji:insert', function(e, data){
                      var node = t.o.plugins.insertemoji._focusNode,
                          range = t.doc.createRange(),
                          newNode = t.doc.createTextNode(data.alt),
                          _inEd = function(node) {
                            var _self, parents;
                            if ('classList' in node) {
                              _self = node.classList.contains("trumbowyg-editor")
                            }
                            parents = $(node).parents().filter(function(_,e) {
                              return e.classList.contains("trumbowyg-editor")
                            }).length
                            return (_self || parents)
                          };

                      if (t.$ed.html() == "") {
                        // if there is no content in editor, create an empty span element
                        t.$ed[0].appendChild(newNode);
                      } else {
                        if (!node) { return }
                        if (node.nodeName === "#text" && !_inEd(node)) { return }
                        if (node.nodeName !== "#text" && !_inEd(node)) { return }

                        // insert emoji behind last focused node
                        range.setStartAfter(node);
                        range.setEndAfter(node);
                        t.doc.getSelection().removeAllRanges();
                        t.doc.getSelection().addRange(range);

                        if (!t.range.commonAncestorContainer || !_inEd(t.range.commonAncestorContainer)) {
                          return
                        }
                        t.range.insertNode(newNode);
                      }

                      // now set cursor right after emoji
                      range = t.doc.createRange()
                      range.setStartAfter(newNode);
                      range.setEndAfter(newNode);
                      t.doc.getSelection().removeAllRanges();
                      t.doc.getSelection().addRange(range);

                      // save new node as focused node
                      t.o.plugins.insertemoji._focusNode = t.doc.getSelection().focusNode;
                      t.saveRange();
                      t.syncCode();
                    });

                  });
                },
            }
        }
    });
})(jQuery);
