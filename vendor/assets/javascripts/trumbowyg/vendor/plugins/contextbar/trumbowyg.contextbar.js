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
      sidePane: false,
      btns: {
        side: ['p','blockquote','h2','h3','h4','createLink','upload','insertImage','insertImageFromGallery','justifyLeft','justifyCenter','justifyRight','justifyFull','table','unorderedList','orderedList','horizontalRule'],
        text: ['p','blockquote','h2','h3','h4','strong','em','underline','createLink','justifyLeft','justifyCenter','justifyRight','justifyFull','unorderedList','orderedList'],
        table: ['tableAddRow','tableAddColumn','tableDeleteRow','tableDeleteColumn','tableDestroy'],
        a: ['editLink','unlink'],
        img: ['editImage','justifyLeft','justifyCenter','justifyRight']
      },
      mapping: {
        td: 'table',
        tr: 'table'
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

                  // add new btn definitions for editLink (synonym for createLink) and editImage
                  var btnDefEditLink = {
                    title: "Edit link",
                    ico: 'link',
                    fn: function() {
                      t.execCmd('createLink');
                    }
                  };
                  var btnDefEditImage = {
                    title: "Edit image",
                    text: '<i class="fa fa-pencil" />',
                    hasIcon: false,
                    fn: function() {
                      t.saveRange();
                      t.getDefaultImgDblClickHandler().bind(t.doc.getSelection().focusNode)();
                    }
                  };

                  t.addBtnDef('editLink', btnDefEditLink);
                  t.addBtnDef('editImage', btnDefEditImage);

                  var isNullRect = function(rect) {
                    return rect.x == 0 &&
                    rect.y == 0 &&
                    rect.right == 0 &&
                    rect.left == 0 &&
                    rect.top == 0 &&
                    rect.bottom == 0 &&
                    rect.height == 0 &&
                    rect.width == 0;
                  };

                  var detectEditNodeType = function(selectedNode, handledTypes, typeMapping) {
                    var snName = selectedNode.nodeName.toLowerCase(),
                        pnName = selectedNode.parentNode.nodeName.toLowerCase(),
                        handledTypes = $.grep(Object.keys(t.o.plugins.contextbar.btns),function(k){ return (k != 'text' && k!= 'side'); }),
                        typeMapping = t.o.plugins.contextbar.mapping,
                        nodeIndex = -1;

                    // test selected node on handledTypes
                    nodeIndex = $.inArray(snName, handledTypes)
                    // test parent node
                    if (nodeIndex == -1) {
                      nodeIndex = $.inArray(pnName, handledTypes)
                    }
                    // test selected node on type mapping
                    if (nodeIndex == -1 && $.inArray(snName, Object.keys(typeMapping)) != -1) {
                      nodeIndex = $.inArray(typeMapping[snName], handledTypes)
                    }
                    // test parent node
                    if (nodeIndex == -1 && $.inArray(pnName, Object.keys(typeMapping)) != -1) {
                      nodeIndex = $.inArray(typeMapping[pnName], handledTypes)
                    }

                    if (nodeIndex != -1) {
                      return handledTypes[nodeIndex];
                    }
                  };

                  var buildPane = function(selection) {
                    var selection = t.doc.getSelection(),
                        selectedNode = selection.focusNode,
                        anchorNode = selection.anchorNode,
                        parentNode = selectedNode.parentNode,
                        selectFrom = Math.min(selection.anchorOffset,selection.focusOffset),
                        selectTo = Math.max(selection.anchorOffset,selection.focusOffset),
                        selectedText = selectedNode.wholeText,
                        selectionStart = selection.getRangeAt(0).startOffset,
                        nodeRect = selection.getRangeAt(0).getBoundingClientRect(),
                        pane = $("<div class='" + t.o.prefix + "contextbar-pane'></div>"),
                        side = $("<div class='" + t.o.prefix + "contextbar-side'><i class='fa fa-plus'></i></div>"),
                        edRect = t.$ed[0].getBoundingClientRect(),
                        editNodeType = undefined,
                        posX,
                        posY;

                    if (!selection.rangeCount || selectedNode == t.$ed[0]) {
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
                    } else if (editNodeType = detectEditNodeType(selectedNode)) {
                      nodeRect = $(selectedNode).closest(editNodeType)[0].getBoundingClientRect();
                      appendBtnsToPane(pane, t.o.plugins.contextbar.btns[editNodeType], selection);
                    } else if (t.o.plugins.contextbar.sidePane) {
                      appendBtnsToPane(pane, t.o.plugins.contextbar.btns.side, selection);

                      if (isNullRect(nodeRect)) {
                        nodeRect = selectedNode.getBoundingClientRect();
                      }

                      posY = nodeRect.y - edRect.y + Math.max(nodeRect.height, 25) + 5;

                      if (t.o.plugins.contextbar.hideBtnPane) {
                        posY -= (t.$btnPane.height() + 3);
                      }

                      side.css('top', posY + "px");
                      pane.css('top', posY + "px");
                      pane.css('left', "1px");

                      t.$box.append(side);

                      // TODO: insert data on current cursor, not behind node
                      side.on('click', function(){
                        t.$box.append(pane);
                        side.remove();

                        var range = t.doc.createRange();
                        range.selectNodeContents(selectedNode);
                        range.setStart(selectedNode, selectionStart);
                        range.setEnd(selectedNode, selectionStart);
                        t.doc.getSelection().removeAllRanges();
                        t.doc.getSelection().addRange(range);
                      });
                      return;
                    } else {
                      return;
                    }

                    // add edit class
                    if(editNodeType) {
                      pane.addClass(t.o.prefix + "contextbar-pane-edit");
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
                      posY -= (t.$btnPane.height() + 3);
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
                      if (btn == "createLink" && $(selection.focusNode).closest('a').length > 0) {
                        return;
                      }
                      // do not append unlink button when not within an a element
                      if (btn == "unlink" && $(selection.focusNode).closest('a').length == 0) {
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
                      t.$box.find('.' + t.o.prefix + 'contextbar-side').remove();

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
                      // timeout is needed to avoid removing side pane
                      setTimeout(function() {
                        t.$box.find('.' + t.o.prefix + 'contextbar-side').remove();
                      }, 100);
                    });

                    t.$c.on('tbwchange', openPane);
                    t.$ed.on('click', function(e) {
                      // timeout is needed to get an correct updated selection
                      setTimeout(openPane.bind(this, e), 10);
                    });
                    t.$ed.on('keydown', function(e) {
                      var ev = e || window.event;

                      // left, up, right, down arrow
                      if ($.inArray(parseInt(ev.keyCode), [37, 38, 39, 40]) != -1) {
                        // timeout is needed to get an correct updated selection
                        setTimeout(openPane.bind(this, e), 10);
                      }
                    });
                  });
                }
            }
        }
    });
})(jQuery);
