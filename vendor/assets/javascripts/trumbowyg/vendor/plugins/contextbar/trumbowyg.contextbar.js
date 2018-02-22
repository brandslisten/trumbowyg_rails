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
        text: ['p','blockquote','h2','h3','h4','strong','em','underline','createLink','justifyLeft','justifyCenter','justifyRight','justifyFull','unorderedList','orderedList'],
        table: ['tableAddRow','tableAddColumn','tableDeleteRow','tableDeleteColumn','tableDestroy'],
        a: ['unlink'],
        img: ['justifyLeft','justifyCenter','justifyRight']
      }
  };

    'use strict';
    $.extend(true, $.trumbowyg, {
        plugins: {
            contextbar: {
                init: function (t) {
                  var opts = $.extend(true, {}, t.o.plugins.contextbar || {});

                  t.o.plugins.contextbar = $.extend(true, {}, defaultOptions, t.o.plugins.contextbar || {});
                  // overwrite btns if present in opts
                  if(opts && opts.btns) {
                    t.o.plugins.contextbar.btns = $.extend(true, {}, opts.btns);
                  }

                  if (!t.o.plugins.contextbar.enabled) {
                    return;
                  }

                  var buildPane = function(selection) {
                    var selection = t.doc.getSelection(),
                        selectedNode = selection.focusNode,
                        anchorNode = selection.anchorNode,
                        parentNode = selectedNode.parentNode,
                        selectFrom = Math.min(selection.anchorOffset,selection.focusOffset),
                        selectTo = Math.max(selection.anchorOffset,selection.focusOffset),
                        selectedText = selectedNode.wholeText,
                        nodeRect = selection.getRangeAt(0).getBoundingClientRect(),
                        pane = $("<div class='" + t.o.prefix + "contextbar-pane'></div>"),
                        edRect = t.$ed[0].getBoundingClientRect(),
                        posX,
                        posY;

                    if (!selection.rangeCount) {
                      return;
                    }

                    // generate pane
                    if (!selection.isCollapsed && selectedNode.nodeType == Node.TEXT_NODE) {
                      appendBtnsToPane(pane, t.o.plugins.contextbar.btns.text, selection);

                      if (selectedNode == anchorNode) {
                        // correct nodeRect if needed
                        var textEl = $("<span style='font-size:1em; display:none;'>"+selectedText+"</span>"),
                            delta = 10,
                            range = t.doc.createRange();

                        t.$box.append(textEl);

                        if(nodeRect.width > textEl.width() + delta) {
                          // also fix selection range
                          range.selectNode(selectedNode);
                          t.doc.getSelection().removeAllRanges();
                          t.doc.getSelection().addRange(range);

                          nodeRect = range.getBoundingClientRect();
                        }
                        textEl.remove();
                      }
                    } else if (selectedNode.nodeName == 'TD' || parentNode.nodeName == 'TD') {
                      nodeRect = $(selectedNode).closest('table')[0].getBoundingClientRect();
                      appendBtnsToPane(pane, t.o.plugins.contextbar.btns.table, selection);
                    } else if (selectedNode.nodeName == 'A' || parentNode.nodeName == 'A') {
                      nodeRect = $(selectedNode).closest('a')[0].getBoundingClientRect();
                      appendBtnsToPane(pane, t.o.plugins.contextbar.btns.a, selection);
                    } else if (selectedNode.nodeName == 'IMG' || parentNode.nodeName == 'IMG') {
                      nodeRect = $(selectedNode).closest('img')[0].getBoundingClientRect();
                      appendBtnsToPane(pane, t.o.plugins.contextbar.btns.img, selection);
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

                  var appendBtnsToPane = function(pane, btns, selection) {
                    $.each(btns, function(index, btn) {
                      // do not append create link button within an a element
                      if (btn == "createLink" && $(selection.focusNode).parents('a').length > 0) {
                        return;
                      }

                      pane.append(t.buildBtn(btn));
                    });
                  }

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
                    var openPane = function(e) {
                      var selection = t.doc.getSelection(),
                          range = t.doc.createRange();

                      t.$box.find('.' + t.o.prefix + 'contextbar-pane').remove();

                      // check if focused node is part of clicked target
                      if (e.type != 'tbwchange' && !$.contains(e.target, selection.focusNode)) {
                        // set selection to clicked target
                        range.selectNodeContents(e.target);
                        t.doc.getSelection().removeAllRanges();
                        t.doc.getSelection().addRange(range);
                        selection = t.doc.getSelection();
                      }

                      if (selection.focusNode) {
                        buildPane();
                      }
                    };

                    if(t.o.plugins.contextbar.hideBtnPane) {
                      t.$btnPane.hide();
                    }

                    t.$ed.on('blur', function(){
                      t.$box.find('.' + t.o.prefix + 'contextbar-pane').remove();
                    });

                    t.$c.on('tbwchange', openPane);
                    t.$ed.on('click', function(e) {
                      // timeout is needed to get an correct updated selection
                      setTimeout(openPane.bind(this, e), 10);
                    });
                  });
                }
            }
        }
    });
})(jQuery);
