/*/* ===========================================================
 * trumbowyg.history.js v1.0
 * history plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Sven Dunemann [dunemann@forelabs.eu]
 */

(function ($) {

    // You should not overwrite these internal used variables!
    var defaultOptions = {
        _stack: [],
        _index: -1
    };

    'use strict';
    $.extend(true, $.trumbowyg, {
        langs: {
            de: {
                history: {
                  redo: 'Wiederholen',
                  undo: 'Rückgängig'
                }
            },
            en: {
              history: {
                redo: 'Redo',
                undo: 'Undo'
              }
            },
        },
        plugins: {
            history: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.history = $.extend(true, {}, defaultOptions, trumbowyg.o.plugins.history || {});
                    var btnBuildDefRedo = {
                        title: trumbowyg.lang.history['redo'],
                        ico: 'redo',
                        key: 'Y',
                        fn: function () {
                          if (trumbowyg.o.plugins.history._index < trumbowyg.o.plugins.history._stack.length - 1) {
                            var index = ++trumbowyg.o.plugins.history._index;
                            var newState = trumbowyg.o.plugins.history._stack[index];

                            trumbowyg.execCmd('html', newState);
                            // because of some semantic optimisations we have to save the state back
                            // to history
                            trumbowyg.o.plugins.history._stack[index] = trumbowyg.$ed.html();

                            carretToEnd();
                          }
                        }
                    };

                    var btnBuildDefUndo = {
                        title: trumbowyg.lang.history['undo'],
                        ico: 'undo',
                        key: 'Z',
                        fn: function () {
                          if (trumbowyg.o.plugins.history._index > 0) {
                            var index = --trumbowyg.o.plugins.history._index;
                            var newState = trumbowyg.o.plugins.history._stack[index];

                            trumbowyg.execCmd('html', newState);
                            // because of some semantic optimisations we have to save the state back
                            // to history
                            trumbowyg.o.plugins.history._stack[index] = trumbowyg.$ed.html();

                            carretToEnd();
                          }
                        }
                    };

                    var pushToHistory = function(e) {
                      var latestState = trumbowyg.o.plugins.history._stack.slice(-1)[0] || "<p></p>",
                          newState = trumbowyg.$ed.html(),
                          focusEl = trumbowyg.doc.getSelection().focusNode,
                          focusElText = "",
                          latestStateTagsList,
                          newStateTagsList;

                      latestStateTagsList = $("<div>" + latestState + "</div>").find("*").map(function() { return this.localName; });
                      newStateTagsList = $("<div>" + newState + "</div>").find("*").map(function() { return this.localName; });
                      if (focusEl) {
                        focusElText = focusEl.outerHTML || focusEl.textContent;
                      }

                      if ($.inArray(newState, trumbowyg.o.plugins.history._stack) == -1) {
                        // a new stack entry is defined when current insert ends on a whitespace character
                        // or count of node elements has been changed
                        if(focusElText.slice(-1).match(/\s/) || !arraysAreIdentical(latestStateTagsList,newStateTagsList) || trumbowyg.o.plugins.history._index <= 0) {
                          trumbowyg.o.plugins.history._index = ++trumbowyg.o.plugins.history._index;
                          // remove newer entries in history when something new was added
                          // because timeline was changes with interaction
                          trumbowyg.o.plugins.history._stack = trumbowyg.o.plugins.history._stack.slice(
                            0, trumbowyg.o.plugins.history._index
                          );
                          // now add new state to modifed history
                          trumbowyg.o.plugins.history._stack.push(newState);
                        } else {
                          // modify last stack entry
                          trumbowyg.o.plugins.history._stack[trumbowyg.o.plugins.history._index] = newState;
                        }
                      }

                    };

                    var arraysAreIdentical = function(a, b) {
                      if (a === b) return true;
                      if (a == null || b == null) return false;
                      if (a.length != b.length) return false;

                      for (var i = 0; i < a.length; ++i) {
                        if (a[i] !== b[i]) return false;
                      }
                      return true;
                    };

                    var carretToEnd = function() {
                      var node = trumbowyg.doc.getSelection().focusNode,
                          range = trumbowyg.doc.createRange();

                      if(node.childNodes.length > 0) {
                        range.setStartAfter(node.childNodes[node.childNodes.length-1]);
                        range.setEndAfter(node.childNodes[node.childNodes.length-1]);
                        trumbowyg.doc.getSelection().removeAllRanges();
                        trumbowyg.doc.getSelection().addRange(range);
                      }
                    };

                    trumbowyg.$c.on('tbwinit tbwchange', pushToHistory);

                    trumbowyg.addBtnDef('historyRedo', btnBuildDefRedo);
                    trumbowyg.addBtnDef('historyUndo', btnBuildDefUndo);
                }
            }
        }
    });
})(jQuery);
