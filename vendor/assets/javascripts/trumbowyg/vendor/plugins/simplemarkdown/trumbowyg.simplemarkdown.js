/*/* ===========================================================
 * trumbowyg.simplemarkdown.js v1.0
 * SimpleMarkdown plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Sven Dunemann
 */

(function ($) {

    var defaultOptions = {
        enabled: true,
        triggerKeyCode: 32,
        rules: {
          '#': ['formatBlock','h2'],
          '##': ['formatBlock','h3'],
          '###': ['formatBlock','h4'],
          '.h2': ['formatBlock','h2'],
          '.h3': ['formatBlock','h3'],
          '.h4': ['formatBlock','h4'],
          '>': ['formatBlock','blockquote'],
          '.p': ['formatBlock','p'],
          '.q': ['formatBlock','blockquote'],
          '.l': 'justifyLeft',
          '.c': 'justifyCenter',
          '.r': 'justifyRight',
          '.f': 'justifyFull',
          '>>': 'indent',
          '<<': 'outdent',
          '*': 'insertUnorderedList',
          '+': 'insertUnorderedList',
          '-': 'insertUnorderedList',
          '1.': 'insertOrderedList',
          '___': 'insertHorizontalRule',
          '---': 'insertHorizontalRule',
          '`': ['formatBlock','code']
        }
    };

    'use strict';
    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                simplemarkdown: {
                  enabled: 'Markdown enabled',
                  disabled: 'Markdown disabled'
                }
            },
            de: {
              simplemarkdown: {
                enabled: 'Markdown aktiv',
                disabled: 'Markdown inaktiv'
              }
            },
        },
        plugins: {
            simplemarkdown: {
                init: function (t) {
                    t.o.plugins.simplemarkdown = $.extend(true, {}, defaultOptions, t.o.plugins.simplemarkdown || {});

                    var translations = [t.lang.simplemarkdown.disabled, t.lang.simplemarkdown.enabled];

                    var analyze = function(e) {
                      var rules = t.o.plugins.simplemarkdown.rules,
                          selection = t.doc.getSelection(),
                          selectedNode = selection.focusNode,
                          selectFrom = Math.min(selection.anchorOffset,selection.focusOffset),
                          selectTo = Math.max(selection.anchorOffset,selection.focusOffset),
                          selectedText = selectedNode.wholeText,
                          range = t.doc.createRange(),
                          selector,
                          character,
                          cmd,
                          param,
                          newValue;

                      // return when not enabled
                      if (!t.o.plugins.simplemarkdown.enabled) return;

                      // Only analyze when
                      // keyCode matched triggerKeyCode and
                      // there is no active selection
                      // and we are currently within a TEXT_NODE
                      if (!e || e.keyCode != t.o.plugins.simplemarkdown.triggerKeyCode || !selection || !selection.isCollapsed || selectFrom != selectTo || selectedNode.nodeType != Node.TEXT_NODE) return;

                      // save character
                      character = String.fromCharCode(e.keyCode);

                      // fetch selector
                      selector = selectedText.slice(0, selectFrom).split(character).slice(-1)[0].trim();

                      // abort if selector is not within rules
                      if ($.inArray(selector, Object.keys(rules)) === -1) return;

                      // if keyCode is 32 (space), editor replaces space by non breaking space (160)
                      if (e.keyCode == 32) character = String.fromCharCode(160);

                      // execute command
                      if (Array.isArray(rules[selector])) {
                        cmd = rules[selector][0];
                        param = rules[selector][1];
                      } else {
                        cmd = rules[selector];
                      }

                      t.execCmd(cmd, param);

                      // remove selector from node
                      selectedNode = t.doc.getSelection().focusNode;
                      newValue = selectedNode.wholeText.replace(new RegExp(selector + character), '');
                      if (newValue.length == 0) {
                        var emptyNode = t.doc.createElement("BR");
                        selectedNode.replaceWith(emptyNode);
                        selectedNode = emptyNode;
                      } else {
                        selectedNode.nodeValue = newValue;
                      }

                      // place cursor to end of node
                      range.setStartAfter(selectedNode);
                      range.setEndAfter(selectedNode);
                      t.doc.getSelection().removeAllRanges();
                      t.doc.getSelection().addRange(range);
                    }

                    var btnTitle = function() {
                      return translations[+t.o.plugins.simplemarkdown.enabled];
                    };

                    var btnText = function() {
                      var cls = '';
                      if (t.o.plugins.simplemarkdown.enabled) cls = ' text-success';
                      return '<i class="fa fa-caret-square-o-down' + cls + '" />';
                    };

                    var btnDef = {
                        title: translations[+t.o.plugins.simplemarkdown.enabled],
                        text: btnText(),
                        hasIcon: false,
                        fn: function (btn) {
                          t.o.plugins.simplemarkdown.enabled = !t.o.plugins.simplemarkdown.enabled;
                          t.$btnPane.find("." + t.o.prefix + btn + "-button").
                            attr("title", btnTitle()).
                            html(btnText());
                        }
                    };

                    t.addBtnDef('simplemarkdown', btnDef);
                    t.$c.on('tbwinit', function(){
                      t.$ed.on('keyup', analyze);
                    });
                }
            }
        }
    });
})(jQuery);
