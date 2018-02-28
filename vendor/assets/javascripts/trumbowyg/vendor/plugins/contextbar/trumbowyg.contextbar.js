/*/* ===========================================================
 * trumbowyg.contextbar.js v0.4
 * Contextbar plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Sven Dunemann [dunemann@forelabs.eu]
 */

(function ($) {

  var defaultOptions = {
      enabled: false,
      hideBtnPane: false,
      btnPaneBtns: undefined,
      centerBtnPane: false,
      sidePane: false,
      btns: {
        side: ['p','blockquote','h2','h3','h4','internalLink','createLink','upload','insertImage','insertImageFromGallery','justifyLeft','justifyCenter','justifyRight','justifyFull','table','unorderedList','orderedList','horizontalRule'],
        text: ['p','blockquote','h2','h3','h4','strong','em','underline','createLink','justifyLeft','justifyCenter','justifyRight','justifyFull','unorderedList','orderedList'],
        table: ['tableAddRow','tableAddColumn','tableDeleteRow','tableDeleteColumn','tableDestroy'],
        a: ['editLink','unlink'],
        img: ['editImage','justifyLeft','justifyCenter','justifyRight','deleteImage']
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
                    text: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m505.99-87.12v3.12h3.12l7.88-7.88-3.12-3.12zm13.76-7.51c.33-.33.33-.85 0-1.18l-1.95-1.95c-.33-.33-.85-.33-1.18 0l-1.63 1.64 3.12 3.12z" transform="matrix(.85668 0 0 .85668-431.46 85.958)"/></svg>',
                    hasIcon: false,
                    fn: function() {
                      t.saveRange();
                      t.getDefaultImgDblClickHandler().bind(t.doc.getSelection().focusNode)();
                    }
                  };
                  var btnDefDeleteImage = {
                    title: "Delete image",
                    text: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><g transform="matrix(0.37650603,0,0,0.37650603,-33.738875,-19.449912)"><g transform="matrix(0.94444444,0,0,0.94444444,5.7161365,3.6077199)"><path style="clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;opacity:1;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:#000000;solid-opacity:1;fill:none;fill-opacity:1;fill-rule:nonzero;stroke:#00b393;stroke-width:1.98214173;stroke-linecap:butt;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate" d="M 114.04368,64.938966 A 11.153227,10.96093 0 0 1 102.89045,75.899895 11.153227,10.96093 0 0 1 91.737221,64.938966 11.153227,10.96093 0 0 1 102.89045,53.978037 11.153227,10.96093 0 0 1 114.04368,64.938966 Z" inkscape:connector-curvature="0" /><g style="fill-opacity:1;stroke:#00b393;stroke-width:23.34250641;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" transform="matrix(0.06345829,0,0,0.06345829,94.278428,54.840952)"><path style="fill-opacity:1;stroke:#00b393;stroke-width:22.72358704;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 75.849599,90.003696 c -1.495219,0 -2.973932,0.579096 -4.114132,1.719848 -2.281332,2.281328 -2.281332,5.980605 0,8.26195 L 115.77673,144.0268 c 1.13954,1.14024 2.61853,1.71986 4.11426,1.71986 1.49523,0 3.00667,-0.57962 4.14777,-1.71986 2.28133,-2.28134 2.28133,-5.9806 0,-8.26194 L 79.997436,91.723544 c -1.14058,-1.140752 -2.652617,-1.719848 -4.147837,-1.719848 z m 123.153881,0 c -1.49522,0 -3.00771,0.579096 -4.14794,1.719848 L 71.735467,214.87736 c -2.281332,2.28134 -2.281332,5.98061 0,8.26197 1.140235,1.14023 2.61855,1.71984 4.114132,1.71984 1.495566,0 3.00667,-0.57961 4.147837,-1.71984 L 203.11758,99.985494 c 2.28132,-2.282311 2.28132,-5.979633 0,-8.26195 -1.14128,-1.140752 -2.61889,-1.719848 -4.1141,-1.719848 z M 152.9388,168.13826 c -1.49522,0.0161 -2.98612,0.6012 -4.1141,1.75355 -2.25698,2.30569 -2.20363,6.00496 0.10356,8.26197 l 45.99717,45.01927 c 1.13781,1.11295 2.60626,1.68618 4.08042,1.68618 1.51594,0 3.0374,-0.58515 4.18143,-1.75357 2.25699,-2.30568 2.20365,-6.00496 -0.10355,-8.26196 l -45.99717,-45.01926 c -1.15336,-1.12901 -2.65289,-1.70224 -4.14777,-1.68618 z" inkscape:connector-curvature="0" /></g></g></g></svg>',
                    hasIcon: false,
                    fn: function() {
                      if(t.doc.getSelection().focusNode.nodeName == 'IMG') {
                        t.doc.getSelection().focusNode.remove();
                      }
                    }
                  };

                  t.addBtnDef('editLink', btnDefEditLink);
                  t.addBtnDef('editImage', btnDefEditImage);
                  t.addBtnDef('deleteImage', btnDefDeleteImage);

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
                    t.saveRange();
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

                  var adjustModalPosition = function() {
                    var modal = t.$box.find('.' + t.o.prefix + 'modal'),
                        selection,
                        node,
                        top;

                    if(modal.length == 0) {
                      return;
                    }

                    t.restoreRange();
                    selection = t.doc.getSelection();

                    if(selection.focusNode) {
                      node = selection.focusNode;
                      if(node.nodeType == Node.TEXT_NODE) {
                        node = node.parentNode;
                      }

                      top = Math.max(t.$btnPane.height(), $(node).position().top - t.$ed.position().top);
                      modal.css('top', top + 'px');

                      // center window to modal
                      $(window).scrollTop($(modal).offset().top + ($(modal).height() / 2) - ($(window).height() / 2));
                    }
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

                    if(t.o.plugins.contextbar.btnPaneBtns instanceof Array) {
                      t.$box.addClass(t.o.prefix + 'box-contextbar-modified');
                      t.$btnPane.html('');
                      $.each(t.o.plugins.contextbar.btnPaneBtns, function(index, btn) {
                        var button = t.buildBtn(btn);
                        if(btn == 'historyUndo' || btn == 'historyRedo') {
                          button.addClass('trumbowyg-disable');
                        }
                        t.$btnPane.append(button);
                      });
                    }

                    if(t.o.plugins.contextbar.centerBtnPane) {
                      t.$btnPane.css('text-align', 'center');
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

                    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
                    new MutationObserver(adjustModalPosition).observe(t.$box[0], {childList: true});
                  });
                }
            }
        }
    });
})(jQuery);
