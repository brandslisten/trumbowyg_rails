/*/* ===========================================================
 * trumbowyg.contextbar.js v1.0
 * Contextbar plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Sven Dunemann
 */

(function ($) {

  var defaultOptions = {
      enabled: false,
      btns: {
        text: ['p','blockquote','h2','h3','h4','strong','em','underline','createLink','unlink','justifyLeft','justifyCenter','justifyRight','justifyFull','unorderedList','orderedList']
      }
  };

    'use strict';
    $.extend(true, $.trumbowyg, {
        plugins: {
            contextbar: {
                init: function (trumbowyg) {
                  trumbowyg.o.plugins.contextbar = $.extend(true, {}, defaultOptions, trumbowyg.o.plugins.contextbar || {});

                  if (!trumbowyg.o.plugins.contextbar.enabled) {
                    return;
                  }

                  trumbowyg.$c.on('tbwinit', function(){
                    trumbowyg.$ed.on('click blur', function(){
                      trumbowyg.$box.find('.trumbowyg-contextbar-pane').remove();
                    });

                    trumbowyg.$ed.on('dblclick', function(){
                      // get selection
                      var selection = trumbowyg.doc.getSelection(),
                          selectedNode = selection.focusNode,
                          selectedText = $(selectedNode).text().slice(selection.anchorOffset,selection.focusOffset),
                          nodeRect = selection.getRangeAt(0).getBoundingClientRect(),
                          pane = $("<div class='trumbowyg-button-pane trumbowyg-contextbar-pane'></div>"),
                          edRect = trumbowyg.$ed[0].getBoundingClientRect();

                      // show nothing when selection has no range
                      if (selection.anchorOffset == selection.focusOffset) {
                        return;
                      }

                      // generate pane
                      if (selectedNode.nodeType == Node.TEXT_NODE) {
                        $.each(trumbowyg.o.plugins.contextbar.btns.text, function(index, btn) {
                          pane.append(trumbowyg.buildBtn(btn));
                        });
                      }

                      // set correct position for pane
                      pane.css('position', 'absolute');
                      pane.css('display', 'inline-block');
                      pane.css('width', 'auto');
                      pane.css('border', '1px solid #ccc');
                      pane.css('background-color', 'rgba(0,0,0,0.1)');
                      pane.css('left', (nodeRect.x - edRect.x) + "px" );
                      pane.css('top', (nodeRect.y - edRect.y) + "px" );

                      // place context bar on editor box
                      trumbowyg.$box.append(pane);
                    });
                  });
                }
            }
        }
    });
})(jQuery);
