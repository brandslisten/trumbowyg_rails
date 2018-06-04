/* ===========================================================
 * trumbowyg.pasteog.js v1.0
 * Open Graph paste Plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Sven Dunemann [dunemann@forelabs.eu]
 */

(function($) {
    "use strict";

    var defaultOptions = {
      enabled: true,
      endpoint: "https://opengrapher.brandslisten.com/?url=%{url}",
      html: '<div class="ogPreviewLink"><a href="%{url}" target="_blank" title="%{title}"rel="nofollow" style="background-image: url(\'%{image}\')" alt="%{title}" class="ogPreviewLink--image" >&nbsp;</a><a href="%{url}" target="_blank" title="%{title}"rel="nofollow"  class="ogPreviewLink--title">%{title}</a><a href="%{url}" target="_blank" title="%{title}"rel="nofollow" class="ogPreviewLink--description">%{description}</a><close/></div><p> <br/> </p>',
      fn: undefined // Has to return a new Node
    };

    $.extend(true, $.trumbowyg, {
        plugins: {
            pasteOG: {
                init: function(t) {
                    t.o.plugins.pasteOG = $.extend(true, {}, defaultOptions, t.o.plugins.pasteOG || {});

                    if (!t.o.plugins.pasteOG.enabled) {
                      return;
                    }
                    t.$c.on('tbwinit', function() {
                      t.$ed.on('click', '.ogPreviewLink close', function(e) {
                        var $element = $(e.currentTarget).parent();
                        var url = $element.find('a[href]')[0].href;
                        $element.replaceWith(url);
                        t.syncCode();
                        t.$c.trigger('tbwchange');
                      });
                    });

                    var callbackFn = t.o.plugins.pasteOG.fn || function(res, url){
                      var node = undefined;

                      // create a new node with og data
                      if(res && res.success && !!Object.keys(res.data).length) {
                        var title = res.data.ogTitle,
                            description = res.data.ogDescription,
                            image = (res.data.hasOwnProperty("ogImage") && res.data.ogImage.url),
                            html = t.o.plugins.pasteOG.html,
                            el;

                        html = html.replace(/\%\{url\}/g, url || '');
                        html = html.replace(/\%\{title\}/g, title || '');
                        html = html.replace(/\%\{description\}/g, description || '');
                        html = html.replace(/\%\{image\}/g, image || '');
                        el = $(html);

                        if (!title) el.find('a').remove();
                        if (!description) el.find('p').remove();
                        if (!image) {
                          el.find('img').remove();
                          // without an image we do not need container class anymore
                          el.removeClass('ogPreviewContainer');
                        }

                        node = el[0];
                      }

                      return node;
                    };

                    t.pasteHandlers.splice(0,0,function(pasteEvent) {
                        try {
                          var clipboardData = (pasteEvent.originalEvent || pasteEvent).clipboardData,
                              pastedData = clipboardData.getData("Text");

                          if (pastedData.startsWith("http")) {
                            pasteEvent.stopPropagation();
                            pasteEvent.preventDefault();

                            var url = pastedData.trim(),
                                newNode = undefined;

                            $.getJSON(t.o.plugins.pasteOG.endpoint.replace("%{url}", encodeURIComponent(url)), function(data){
                              var newNode = callbackFn(data, url),
                                  node = t.doc.getSelection().focusNode,
                                  range = t.doc.createRange();

                              // when the callback returned nothing, fallback to auto link
                              if (newNode === undefined) {
                                newNode = $("<a>", {
                                  href: url,
                                  text: url
                                })[0];
                              }

                              if (t.$ed.html() == "") {
                                // if there is no content in editor, add node and a new br and p element
                                t.$ed[0].appendChild(newNode);
                                t.$ed[0].appendChild(t.doc.createElement("BR"));
                                t.$ed[0].appendChild(t.doc.createElement("P"));
                              } else {
                                // insert element behind last focused node
                                range.setStartAfter(node);
                                range.setEndAfter(node);
                                t.doc.getSelection().removeAllRanges();
                                t.doc.getSelection().addRange(range);

                                t.range.insertNode(newNode);
                              }

                              // now set cursor right after element
                              range = t.doc.createRange()
                              range.setStartAfter(newNode.lastChild);
                              range.setEndAfter(newNode.lastChild);
                              t.doc.getSelection().removeAllRanges();
                              t.doc.getSelection().addRange(range);

                              // save range
                              t.saveRange();
                              t.syncCode();
                              t.$c.trigger('tbwchange');
                            });
                          }
                        } catch (c) {}
                    });
                }
            }
        }
    });
})(jQuery);
