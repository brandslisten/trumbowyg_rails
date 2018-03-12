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
        dropdown: true,
        triggerKeyCode: 32,
        rules: {
          '#': ['formatBlock','h2'],
          '##': ['formatBlock','h3'],
          '###': ['formatBlock','h4'],
          '.h2': ['formatBlock','h2'],
          '.h3': ['formatBlock','h3'],
          '.h4': ['formatBlock','h4'],
          '>': ['formatBlock','blockquote'],
          '.q': ['formatBlock','blockquote'],
          '.p': ['formatBlock','p'],
          '.l': 'justifyLeft',
          '.c': 'justifyCenter',
          '.r': 'justifyRight',
          '.b': 'justifyFull',
          '>>': 'indent',
          '<<': 'outdent',
          '*': 'insertUnorderedList',
          '+': 'insertUnorderedList',
          '-': 'insertUnorderedList',
          '1.': 'insertOrderedList',
          '___': 'insertHorizontalRule',
          '---': 'insertHorizontalRule'
        }
    };

    'use strict';
    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                simplemarkdown: {
                  enabled: 'Markdown enabled',
                  disabled: 'Markdown disabled',
                  rules: {
                    '#': 'Headline 2',
                    '.h2': 'Headline 2',
                    '##': 'Headline 3',
                    '.h3': 'Headline 3',
                    '###': 'Headline 4',
                    '.h4': 'Headline 4',
                    '>': 'Quote',
                    '.q': 'Quote',
                    '.p': 'Paragraph',
                    '.l': 'left aligned',
                    '.r': 'right aligned',
                    '.c': 'center aligned',
                    '.b': 'block aligned',
                    '>>': 'Indent',
                    '>>': 'Outdent',
                    '*': 'Unordered list',
                    '+': 'Unordered list',
                    '-': 'Unordered list',
                    '1.': 'Ordered list',
                    '___': 'Horizontale line',
                    '---': 'Horizontale line'
                  }
                }
            },
            de: {
              simplemarkdown: {
                enabled: 'Markdown aktiv',
                disabled: 'Markdown inaktiv',
                rules: {
                  '#': 'H2 Überschrift',
                  '.h2': 'H2 Überschrift',
                  '##': 'H3 Überschrift',
                  '.h3': 'H3 Überschrift',
                  '###': 'H4 Überschrift',
                  '.h4': 'H4 Überschrift',
                  '>': 'Zitat',
                  '.q': 'Zitat',
                  '.p': 'Absatz',
                  '.l': 'Linksbündig',
                  '.r': 'Rechtsbündig',
                  '.c': 'Zentriert',
                  '.b': 'Blocktext',
                  '>>': 'Einrücken vergrößern',
                  '<<': 'Einrücken verkleinern',
                  '*': 'Ungeordnete Liste',
                  '+': 'Ungeordnete Liste',
                  '-': 'Ungeordnete Liste',
                  '1.': 'Geordnete Liste',
                  '___': 'Horizontale Linie',
                  '---': 'Horizontale Linie'
                }
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
                      // make selector regexp safe
                      selector = selector.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                      if(t.doc.getSelection().focusNode != t.$ed[0]) selectedNode = t.doc.getSelection().focusNode;
                      newValue = selectedNode.wholeText.replace(new RegExp(selector + character), '');
                      if (newValue.length == 0 &&
                          t.doc.getSelection().focusNode != t.$ed[0] &&
                          $.inArray(cmd, ['insertUnorderedList','insertOrderedList']) == -1
                      ) {
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

                      if (t.o.plugins.simplemarkdown.dropdown) {
                        t.$btnPane.find("." + t.o.prefix + "simplemarkdown-button").hover(function(){
                          var btnName = 'simplemarkdown';

                          var dropdownPrefix = t.o.prefix + 'dropdown',
                              dropdownOptions = { // the dropdown
                              class: dropdownPrefix + '-' + btnName + ' ' + dropdownPrefix + ' ' + t.o.prefix + 'fixed-top'
                          };
                          dropdownOptions['data-' + dropdownPrefix] = btnName;
                          var $dropdown = $('<div/>', dropdownOptions);

                          if ($("." + dropdownPrefix + "-" + btnName).length == 0) {
                            t.$box.append($dropdown.hide());
                          } else {
                            $dropdown = t.$box.find("." + dropdownPrefix + "-" + btnName);
                          }

                          // clear dropdown
                          $dropdown.html('');

                          // list all rules
                          var table = $('<table></table>');
                          $(Object.keys(t.o.plugins.simplemarkdown.rules)).each(function(index, key){
                            table.append($("<tr><td>" + key + "</td><td>" + t.lang.simplemarkdown.rules[key] + "</td></tr>"));
                          });

                          $dropdown.append(table);
                          t.dropdown(btnName);
                        });
                      }
                    });
                }
            }
        }
    });
})(jQuery);
