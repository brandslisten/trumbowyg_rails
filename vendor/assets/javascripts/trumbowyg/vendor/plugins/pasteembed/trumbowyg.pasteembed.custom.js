/* ===========================================================
 * trumbowyg.pasteembed.js v1.1
 * Url paste to iframe or auto link converting. Plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Sven Dunemann [dunemann@forelabs.eu]
 */

(function($) {
    "use strict";

    var defaultOptions = {
      enabled: false,
      filters: {
        youtube: {
          regex: "/(?:https?:\/\/)?(?:(?:\w+\.)?youtube\.com[\w\/]*\/watch\?[\w&=]*v\=|youtu.be\/)([-\w]+)(?:&[-\w=]*)*/",
          src: "//www.youtube-nocookie.com/embed/%{id}"
        }
      }
    };

    $.extend(true, $.trumbowyg, {
        plugins: {
            pasteEmbed: {
                init: function(trumbowyg) {
                    trumbowyg.o.plugins.pasteEmbed = $.extend(true, {}, defaultOptions, trumbowyg.o.plugins.pasteEmbed || {});

                    if (!trumbowyg.o.plugins.pasteEmbed.enabled) {
                      return;
                    }

                    trumbowyg.pasteHandlers.push(function(pasteEvent) {
                        try {
                          var clipboardData = (pasteEvent.originalEvent || pasteEvent).clipboardData,
                              pastedData = clipboardData.getData("Text");

                          if (pastedData.startsWith("http")) {
                            pasteEvent.stopPropagation();
                            pasteEvent.preventDefault();

                            var url = pastedData.trim(),
                                newEl = undefined;

                            // go through all filters


                            // when filters have not created a new element, fallback to auto link
                            if (newEl === undefined) {
                              newEl = $("<a>", {
                                href: url,
                                text: url
                              });
                            }

                            var node = trumbowyg.doc.getSelection().focusNode,
                                range = trumbowyg.doc.createRange();

                            if (trumbowyg.$ed.html() == "") {
                              // if there is no content in editor, create an empty span element
                              trumbowyg.$ed[0].appendChild(newEl[0]);
                            } else {
                              // insert element behind last focused node
                              range.setStartAfter(node);
                              range.setEndAfter(node);
                              trumbowyg.doc.getSelection().removeAllRanges();
                              trumbowyg.doc.getSelection().addRange(range);

                              trumbowyg.range.insertNode(newEl[0]);
                            }

                            // now set cursor right after element
                            range = trumbowyg.doc.createRange()
                            range.setStartAfter(newEl[0].lastChild);
                            range.setEndAfter(newEl[0].lastChild);
                            trumbowyg.doc.getSelection().removeAllRanges();
                            trumbowyg.doc.getSelection().addRange(range);

                            // save range
                            trumbowyg.saveRange();
                            trumbowyg.syncCode();
                          }
                        } catch (c) {}
                    });
                }
            }
        }
    });
})(jQuery);
