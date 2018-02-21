/*/* ===========================================================
 * trumbowyg.internallink.js v1.0
 * InternalLink plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Sven Dunemann
 */

(function ($) {

    var defaultOptions = {
        serverPath: ''
    };

    'use strict';
    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                internalLink: 'Insert Internal Link'
            },
            de: {
                internalLink: 'Interne Verlinkung einfügen'
            },
        },
        plugins: {
            internalLink: {
                init: function (t) {
                    t.o.plugins.internalLink = $.extend(true, {}, defaultOptions, t.o.plugins.internalLink || {});
                    var btnDef = {
                        title: t.lang['internalLink'],
                        text: '<i class="fa fa-exchange" />',
                        hasIcon: false,
                        fn: function () {
                          t.saveRange();
                          new bl_app.internalLinkTool(t.range, t.o.plugins.internalLink.serverPath);
                        }
                    };

                    t.addBtnDef('internalLink', btnDef);
                }
            }
        }
    });
})(jQuery);
