/*/* ===========================================================
 * trumbowyg.insertimagefromgallery.js v1.0
 * insertImageFromGallery plugin for Trumbowyg
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
                insertImageFromGallery: 'Insert From Gallery'
            },
            de: {
                insertImageFromGallery: 'Aus Gallerie einfügen'
            },
        },
        plugins: {
            insertImageFromGallery: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.insertImageFromGallery = $.extend(true, {}, defaultOptions, trumbowyg.o.plugins.insertImageFromGallery || {});
                    var btnDef = {
                        title: trumbowyg.lang['insertImageFromGallery'],
                        text: '<i class="fa fa-image" style="margin-right: 11px;" /> ' + trumbowyg.lang['insertImageFromGallery'],
                        hasIcon: false,
                        fn: function () {
                          trumbowyg.saveRange();

                          blRemoteModal(trumbowyg.o.plugins.insertImageFromGallery.serverPath, function(container){
                            container.find('.modal').modal('show');
                          });

                          if ($('#trumbowyg-insert-from-gallery').length == 0) {
                            node = $('<div style="display: none important!;" id="trumbowyg-insert-from-gallery"></div>');

                            node.on("bl.backend.blocks.assets:select", function(e, data) {
                              trumbowyg.execCmd('insertImage', data.path, undefined, true);
                            });

                            $("body").append(node);
                          }

                        }
                    };

                    trumbowyg.addBtnDef('insertImageFromGallery', btnDef);
                }
            }
        }
    });
})(jQuery);
