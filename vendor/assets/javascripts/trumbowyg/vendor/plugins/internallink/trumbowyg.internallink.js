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
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.internalLink = $.extend(true, {}, defaultOptions, trumbowyg.o.plugins.internalLink || {});
                    var btnDef = {
                        title: trumbowyg.lang['internalLink'],
                        text: '<i class="fa fa-exchange" />',
                        hasIcon: false,
                        fn: function () {
                          trumbowyg.saveRange();
                          new bl_app.internalLinkTool(trumbowyg.range, trumbowyg.o.plugins.internalLink.serverPath);
                        }
                    };

                    trumbowyg.addBtnDef('internalLink', btnDef);
                }
            }
        }
    });
})(jQuery);
