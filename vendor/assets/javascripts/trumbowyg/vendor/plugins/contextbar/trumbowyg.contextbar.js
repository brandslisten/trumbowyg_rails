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
                init: function (t) {
                  t.o.plugins.contextbar = $.extend(true, {}, defaultOptions, t.o.plugins.contextbar || {});

                  if (!t.o.plugins.contextbar.enabled) {
                    return;
                  }

                  t.$c.on('tbwinit', function(){
                    t.$ed.on('click blur', function(){
                      t.$box.find('.' + t.o.prefix + '-contextbar-pane').remove();
                    });

                    t.$ed.on('dblclick', function(){
                      // get selection
                      var selection = t.doc.getSelection(),
                          selectedNode = selection.focusNode,
                          selectedText = $(selectedNode).text().slice(selection.anchorOffset,selection.focusOffset),
                          nodeRect = selection.getRangeAt(0).getBoundingClientRect(),
                          pane = $("<div class='" + t.o.prefix + "-button-pane " + t.o.prefix + "-contextbar-pane'></div>"),
                          edRect = t.$ed[0].getBoundingClientRect();

                      // show nothing when selection has no range
                      if (selection.anchorOffset == selection.focusOffset) {
                        return;
                      }

                      // generate pane
                      if (selectedNode.nodeType == Node.TEXT_NODE) {
                        $.each(t.o.plugins.contextbar.btns.text, function(index, btn) {
                          pane.append(t.buildBtn(btn));
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
                      t.$box.append(pane);
                    });
                  });
                }
            }
        }
    });
})(jQuery);
