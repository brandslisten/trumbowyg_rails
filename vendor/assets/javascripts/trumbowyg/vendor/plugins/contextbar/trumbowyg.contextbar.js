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
      hideBtnPane: false,
      btns: {
        text: ['p','blockquote','h2','h3','h4','strong','em','underline','createLink','unlink','justifyLeft','justifyCenter','justifyRight','justifyFull','unorderedList','orderedList'],
        table: ['tableAddRow','tableAddColumn','tableDeleteRow','tableDeleteColumn','tableDestroy']
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

                  var buildPane = function(selection) {
                    var selection = t.doc.getSelection(),
                        selectedNode = selection.focusNode,
                        parentNode = selectedNode.parentNode,
                        selectedText = $(selectedNode).text().slice(selection.anchorOffset,selection.focusOffset),
                        nodeRect = selection.getRangeAt(0).getBoundingClientRect(),
                        pane = $("<div class='" + t.o.prefix + "contextbar-pane'></div>"),
                        edRect = t.$ed[0].getBoundingClientRect(),
                        posX,
                        posY;

                    // generate pane
                    if (!selection.isCollapsed && selectedNode.nodeType == Node.TEXT_NODE) {
                      $.each(t.o.plugins.contextbar.btns.text, function(index, btn) {
                        pane.append(t.buildBtn(btn));
                      });
                    } else if (selectedNode.nodeName == 'TD' || parentNode.nodeName == 'TD') {
                      nodeRect = $(selectedNode).parents('table')[0].getBoundingClientRect();

                      $.each(t.o.plugins.contextbar.btns.table, function(index, btn) {
                        pane.append(t.buildBtn(btn));
                      });
                    } else {
                      return;
                    }

                    // place context bar on editor box
                    t.$box.append(pane);

                    // set correct position for pane
                    posX = Math.min(
                      edRect.width - pane.width() - 20,
                      Math.max(
                        nodeRect.x - edRect.x - Math.round(pane.width() / 2) + Math.round(nodeRect.width / 2),
                        1
                      )
                    );
                    posY = nodeRect.y - edRect.y;

                    if (t.o.plugins.contextbar.hideBtnPane) {
                      posY -= 40;
                    } else {
                      posY -= 3;
                    }

                    pane.css('left', posX + "px" );
                    pane.css('top', posY + "px" );

                    pane.on('click', updateButtonPaneStatus);
                    updateButtonPaneStatus();
                  };

                  var updateButtonPaneStatus = function () {
                    var pane = $("." + t.o.prefix + "contextbar-pane", t.doc),
                        prefix = t.o.prefix,
                        tags = t.getTagsRecursive(t.doc.getSelection().focusNode),
                        activeClasses = prefix + 'active-button ' + prefix + 'active';

                    $('.' + prefix + 'active-button', pane).removeClass(activeClasses);
                    $.each(tags, function (i, tag) {
                      var btnName = t.tagToButton[tag.toLowerCase()],
                          $btn = $('.' + prefix + btnName + '-button', pane);

                      if ($btn.length > 0) {
                        $btn.addClass(activeClasses);
                      }
                    });
                  };

                  t.$c.on('tbwinit', function(){
                    var openPane = function() {
                      var selection = t.doc.getSelection(),
                          focusNode = selection.focusNode,
                          parentNode = focusNode.parentNode;

                      t.$box.find('.' + t.o.prefix + 'contextbar-pane').remove();

                      if (!!selection.rangeCount && !selection.isCollapsed) {
                        buildPane();
                      } else if (!!selection.rangeCount) {
                        // go through all supported node types
                        if (focusNode.nodeName == 'TD' || parentNode.nodeName == 'TD') {
                          buildPane();
                        }
                      }
                    };

                    if(t.o.plugins.contextbar.hideBtnPane) {
                      t.$btnPane.hide();
                    }

                    t.$ed.on('blur', function(){
                      t.$box.find('.' + t.o.prefix + 'contextbar-pane').remove();
                    });

                    t.$c.on('tbwchange', openPane);
                    t.$ed.on('click', openPane);
                  });
                }
            }
        }
    });
})(jQuery);
