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
                          if (t.$ed[0].dataset.uuid == undefined) {
                            t.$ed[0].dataset.uuid = crypto.randomUUID();
                          }
                          var editorID = t.o.prefix + t.$ed[0].dataset.uuid
                          t.saveRange();

                          if ($('#' + editorID).length == 0) {
                            node = $('<div style="display: none important!;" id="' + editorID + '" data-id="' + editorID + '"></div>');

                            node.on("bl.backend.blocks.assets:select", function(e, data) {
                              if(e.target.dataset.id != editorID) { return console.log(e.target) }

                              t.execCmd('insertImage', data.path, undefined, true);
                              var $img = $('img[src="' + data.path + '"]', t.$box);
                              $img.attr('alt', data.description);
                              $img.attr('data-asset-id', data.id);
                              $img.attr('data-copyright', data.copyright_owner);
                              $img.attr('srcset', data.srcset);
                            });

                            $("body").append(node);
                          }
                          var url = t.o.plugins.insertImageFromGallery.serverPath;
                          url = new URL(url, location)
                          url.searchParams.set("browse_button_id", editorID)
                          url = url.toString()

                          blRemoteModal(url, function(container){
                            container.find('.modal').modal('show');
                          });

                        }
                    };

                    t.addBtnDef('insertImageFromGallery', btnDef);
                }
            }
        }
    });
})(jQuery);
