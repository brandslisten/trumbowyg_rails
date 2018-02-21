/*/* ===========================================================
 * trumbowyg.externallink.js v1.0
 * ExternalLink plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Sven Dunemann
 */

(function ($) {
    'use strict';
    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                externalLink: 'Add Link'
            },
            de: {
                externalLink: 'Link einfügen'
            },
        },
        plugins: {
            externalLink: {
                init: function (t) {
                  t.o.plugins.externalLink = $.extend(true, {}, t.o.plugins.externalLink || {});
                  var btnDef = {
                      ico: 'create-link',
                      fn: function () {
                        var documentSelection = t.doc.getSelection(),
                            node = documentSelection.focusNode,
                            url,
                            title,
                            text,
                            target;

                        while (['A', 'DIV'].indexOf(node.nodeName) < 0) {
                            node = node.parentNode;
                        }

                        if (node && node.nodeName === 'A') {
                            var $a = $(node);
                            url = $a.attr('href');
                            title = $a.attr('title');
                            target = $a.attr('target');
                            text = $a.text();
                            var range = t.doc.createRange();
                            range.selectNode(node);
                            documentSelection.removeAllRanges();
                            documentSelection.addRange(range);
                        } else {
                          target = '_blank';
                          text = new XMLSerializer().serializeToString(documentSelection.getRangeAt(0).cloneContents());
                        }

                        t.saveRange();

                        t.openModalInsert(t.lang.createLink, {
                            url: {
                                label: 'URL',
                                required: true,
                                value: url
                            },
                            title: {
                                label: t.lang.title,
                                value: title
                            },
                            text: {
                                label: t.lang.text,
                                value: text
                            },
                            target: {
                                label: t.lang.target,
                                value: target,
                                type: 'text',
                                attributes: { disabled: 'disabled' }
                            }
                        }, function (v) { // v is value
                            var link = $(['<a href="', v.url, '">', v.text || v.url, '</a>'].join(''));
                            if (v.title.length > 0) {
                                link.attr('title', v.title);
                            }
                            if (v.target.length > 0) {
                                link.attr('target', v.target);
                            }
                            t.range.deleteContents();
                            t.range.insertNode(link[0]);
                            t.syncCode();
                            t.$c.trigger('tbwchange');
                            return true;
                        });
                    }
                };

                t.addBtnDef('createLink', btnDef);
              }
          }
      }
  });
})(jQuery);
