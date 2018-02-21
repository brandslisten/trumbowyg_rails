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
                insertImageFromGallery: 'Aus Gallerie'
            },
        },
        plugins: {
            insertImageFromGallery: {
                init: function (t) {
                    t.o.plugins.insertImageFromGallery = $.extend(true, {}, defaultOptions, t.o.plugins.insertImageFromGallery || {});
                    var btnDef = {
                        title: t.lang['insertImageFromGallery'],
                        text: '<i class="fa fa-image" style="margin-right: 11px;" /> ' + t.lang['insertImageFromGallery'],
                        hasIcon: false,
                        fn: function () {
                          t.saveRange();

                          blRemoteModal(t.o.plugins.insertImageFromGallery.serverPath, function(container){
                            container.find('.modal').modal('show');
                          });

                          if ($('#' + t.o.prefix + 'insert-from-gallery').length == 0) {
                            node = $('<div style="display: none important!;" id="' + t.o.prefix + 'insert-from-gallery"></div>');

                            node.on("bl.backend.blocks.assets:select", function(e, data) {
                              t.execCmd('insertImage', data.path, undefined, true);
                              var $img = $('img[src="' + data.path + '"]', t.$box);
                              $img.attr('alt', data.description);
                              $img.attr('data-asset-id', data.id);
                              $img.attr('data-copyright', data.copyright_owner);
                            });

                            $("body").append(node);
                          }

                        }
                    };

                    t.addBtnDef('insertImageFromGallery', btnDef);
                }
            }
        }
    });
})(jQuery);
