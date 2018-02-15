/*/* ===========================================================
 * trumbowyg.upload.overwrite.js v1.0
 * Overwrite for upload plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Sven Dunemann
 */

(function ($) {
    'use strict';
    $.extend(true, $.trumbowyg, {
        "plugins": {
          "upload": {
            "success": function(data, trumbowyg, $modal, values) {
              if (!!data.url) {
                  var url = data.url;
                  trumbowyg.execCmd('insertImage', url);
                  var $img = $('img[src="' + url + '"]', trumbowyg.$box);
                  $img.attr('alt', values.alt);
                  $img.attr('data-asset-id', data.id);
                  $img.attr('data-copyright', data.copyright_owner);

                  if (trumbowyg.o.imageWidthModalEdit && parseInt(values.width) > 0) {
                      $img.attr({
                          width: values.width
                      });
                  }
                  setTimeout(function () {
                      trumbowyg.closeModal();
                  }, 250);
                  trumbowyg.$c.trigger('tbwuploadsuccess', [trumbowyg, data, url]);
              } else {
                  trumbowyg.addErrorOnModalField(
                      $('input[type=file]', $modal),
                      trumbowyg.lang[data.message]
                  );
                  trumbowyg.$c.trigger('tbwuploaderror', [trumbowyg, data]);
              }
            }
          }
        }
    });
})(jQuery);
