/* ===========================================================
 * trumbowyg.pastefiltered.js v1.0
 * Customizable filtered paste Plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Sven Dunemann [dunemann@forelabs.eu]
 */
(function($) {
    "use strict";

    var defaultOptions = {
      enabled: true,
      filters: {
        youtube: {
          regex: /(?:https?:\/\/)?(?:(?:\w+\.)?youtube\.com[\w\/]*\/watch\?[\w&=]*v\=|youtu.be\/)([-\w]+)(?:&[-\w=]*)*/,
          html: "<iframe src='//www.youtube-nocookie.com/embed/%{matches[1]}' scrolling='no' type='text/html' frameborder=0 allowfullscreen width='480' height='270' />"
        }
      }
    };

    $.extend(true, $.trumbowyg, {
        plugins: {
            pasteFiltered: {
                init: function(t) {
                    t.o.plugins.pasteFiltered = $.extend(true, {}, defaultOptions, t.o.plugins.pasteFiltered || {});

                    if (!t.o.plugins.pasteFiltered.enabled) {
                      return;
                    }

                    t.pasteHandlers.push(function(pasteEvent) {
                        try {
                          var clipboardData = (pasteEvent.originalEvent || pasteEvent).clipboardData,
                              pastedData = clipboardData.getData("Text");

                          if (pastedData.startsWith("http")) {
                            pasteEvent.stopPropagation();
                            pasteEvent.preventDefault();

                            var url = pastedData.trim(),
                                newEl = undefined;

                            // go through all filters
                            $(Object.keys(t.o.plugins.pasteFiltered.filters)).each(function(index, filter){
                              var opts = t.o.plugins.pasteFiltered.filters[filter],
                                  matches = url.match(opts.regex);

                              if (matches !== null) {
                                var html = opts.html;
                                for(var i=0; i < matches.length; i++) {
                                  html = html.replace("%{matches["+i+"]}", matches[i]);
                                }
                                newEl = $(html);
                              }
                            });

                            // when filters have not created a new element, fallback to auto link
                            if (newEl === undefined) {
                              newEl = $("<a>", {
                                href: url,
                                text: url
                              });
                            }

                            var node = t.doc.getSelection().focusNode,
                                range = t.doc.createRange();

                            if (t.$ed.html() == "") {
                              // if there is no content in editor, create an empty span element
                              t.$ed[0].appendChild(newEl[0]);
                            } else {
                              // insert element behind last focused node
                              range.setStartAfter(node);
                              range.setEndAfter(node);
                              t.doc.getSelection().removeAllRanges();
                              t.doc.getSelection().addRange(range);

                              t.range.insertNode(newEl[0]);
                            }

                            // now set cursor right after element
                            range = t.doc.createRange()
                            range.setStartAfter(newEl[0].lastChild);
                            range.setEndAfter(newEl[0].lastChild);
                            t.doc.getSelection().removeAllRanges();
                            t.doc.getSelection().addRange(range);

                            // save range
                            t.saveRange();
                            t.syncCode();
                          }
                        } catch (c) {}
                    });
                }
            }
        }
    });
})(jQuery);
