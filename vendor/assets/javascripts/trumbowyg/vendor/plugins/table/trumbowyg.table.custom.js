/* ===========================================================
 * trumbowyg.table.custom.js v1.2
 * Table plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Lawrence Meckan
 *          Twitter : @absalomedia
 *          Website : absalom.biz
 * Custom Author: Sven Dunemann
 */

(function ($) {
    'use strict';

    var defaultOptions = {
        rows: 8,
        columns: 8,
        styler: 'table'
    };

    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                table: 'Insert table',
                tableAddRow: 'Add row',
                tableAddColumn: 'Add column',
                tableDeleteRow: 'Delete row',
                tableDeleteColumn: 'Delete column',
                tableDestroy: 'Delete table',
                rows: 'Rows',
                columns: 'Columns',
                styler: 'Table class',
                error: 'Error'
            },
            de: {
              table: 'Tabelle einfügen',
              tableAddRow: 'Zeile hinzufügen',
              tableAddColumn: 'Spalte hinzufügen',
              tableDeleteRow: 'Zeile löschen',
              tableDeleteColumn: 'Spalte löschen',
              tableDestroy: 'Tabelle löschen',
              rows: 'Zeilen',
              columns: 'Spalten',
              styler: 'Tabellen Klasse',
              error: 'Error'
            },
            sk: {
                table: 'Vytvoriť tabuľky',
                tableAddRow: 'Pridať riadok',
                tableAddColumn: 'Pridať stĺpec',
                rows: 'Riadky',
                columns: 'Stĺpce',
                styler: 'Tabuľku triedy',
                error: 'Chyba'
            },
            fr: {
                table: 'Insérer un tableau',
                tableAddRow: 'Ajouter des lignes',
                tableAddColumn: 'Ajouter des colonnes',
                rows: 'Lignes',
                columns: 'Colonnes',
                styler: 'Classes CSS sur la table',
                error: 'Erreur'
            },
            cs: {
                table: 'Vytvořit příkaz Table',
                tableAddRow: 'Přidat řádek',
                tableAddColumn: 'Přidat sloupec',
                rows: 'Řádky',
                columns: 'Sloupce',
                styler: 'Tabulku třída',
                error: 'Chyba'
            },
            ru: {
                table: 'Вставить таблицу',
                tableAddRow: 'Добавить строки',
                tableAddColumn: 'Добавить столбцы',
                rows: 'Строки',
                columns: 'Столбцы',
                styler: 'Имя CSS класса для таблицы',
                error: 'Ошибка'
            },
            ja: {
                table: '表の挿入',
                tableAddRow: '行の追加',
                tableAddColumn: '列の追加',
                rows: '行',
                columns: '列',
                styler: '表のクラス',
                error: 'エラー'
            },
            tr: {
                table: 'Tablo ekle',
                tableAddRow: 'Satır ekle',
                tableAddColumn: 'Kolon ekle',
                rows: 'Satırlar',
                columns: 'Kolonlar',
                styler: 'Tablo sınıfı',
                error: 'Hata'
            }
        },

        plugins: {
            table: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.table = $.extend(true, {}, defaultOptions, trumbowyg.o.plugins.table || {});

                    var tableDropdown = {
                        fn: function () {
                          trumbowyg.saveRange();

                          var btnName = 'table';

                          var dropdownPrefix = trumbowyg.o.prefix + 'dropdown',
                              dropdownOptions = { // the dropdown
                              class: dropdownPrefix + '-' + btnName + ' ' + dropdownPrefix + ' ' + trumbowyg.o.prefix + 'fixed-top'
                          };
                          dropdownOptions['data-' + dropdownPrefix] = btnName;
                          var $dropdown = $('<div/>', dropdownOptions);

                          if ($("." + dropdownPrefix + "-" + btnName).length == 0) {
                            trumbowyg.$box.append($dropdown.hide());
                          } else {
                            $dropdown = $("." + dropdownPrefix + "-" + btnName);
                          }

                          // clear dropdown
                          $dropdown.html('');

                          // when active table show AddRow / AddColumn
                          if (trumbowyg.$box.find(".trumbowyg-table-button").hasClass('trumbowyg-active-button')) {
                            $dropdown.append(trumbowyg.buildSubBtn('tableAddRow'));
                            $dropdown.append(trumbowyg.buildSubBtn('tableAddColumn'));
                            $dropdown.append(trumbowyg.buildSubBtn('tableDeleteRow'));
                            $dropdown.append(trumbowyg.buildSubBtn('tableDeleteColumn'));
                            $dropdown.append(trumbowyg.buildSubBtn('tableDestroy'));
                          } else {
                            var tableSelect = $('<table></table>');
                            for (var i = 0; i < trumbowyg.o.plugins.table.rows; i += 1) {
                              var row = $('<tr></tr>').appendTo(tableSelect);
                              for (var j = 0; j < trumbowyg.o.plugins.table.columns; j += 1) {
                                $('<td></td>').appendTo(row);
                              }
                            }
                            tableSelect.find('td').on('mouseover', tableAnimate);
                            tableSelect.find('td').on('mousedown', tableBuild);

                            $dropdown.append(tableSelect);
                            $dropdown.append($('<center>1x1</center>'));
                          }

                          trumbowyg.dropdown(btnName);
                        }
                    };

                    var tableAnimate = function(column_event) {
                      var column = $(column_event.target),
                          table = column.parents('table'),
                          colIndex = this.cellIndex,
                          rowIndex = this.parentNode.rowIndex;

                      // reset all columns
                      table.find('td').removeClass('active');

                      for (var i = 0; i <= rowIndex; i += 1) {
                        for (var j = 0; j <= colIndex; j += 1) {
                          table.find("tr:nth-of-type("+(i+1)+")").find("td:nth-of-type("+(j+1)+")").addClass('active');
                        }
                      }

                      // set label
                      table.next('center').html((colIndex+1) + "x" + (rowIndex+1));
                    };

                    var tableBuild = function(column_event) {
                      var tabler = $('<table></table>');
                      if (trumbowyg.o.plugins.table.styler) {
                        tabler.attr('class', trumbowyg.o.plugins.table.styler);
                      }

                      var column = $(column_event.target),
                          colIndex = this.cellIndex,
                          rowIndex = this.parentNode.rowIndex;

                      for (var i = 0; i <= rowIndex; i += 1) {
                        var row = $('<tr></tr>').appendTo(tabler);
                        for (var j = 0; j <= colIndex; j += 1) {
                          $('<td></td>').appendTo(row);
                        }
                      }

                      trumbowyg.range.deleteContents();
                      trumbowyg.range.insertNode(tabler[0]);
                    };

                    var addRow = {
                      title: trumbowyg.lang['tableAddRow'],
                      text: '<i class="fa fa-plus m-r" /> ' + trumbowyg.lang['tableAddRow'],
                      hasIcon: false,

                        fn: function () {
                          trumbowyg.saveRange();

                          var node = trumbowyg.doc.getSelection().focusNode.parentNode;
                          var table = fetchTable(node);

                          var row = $('<tr></tr>');
                          // add columns according to current columns count
                          for (var i = 0; i < table.childNodes[0].childElementCount; i += 1) {
                            $('<td></td>').appendTo(row);
                          }

                          // add row to table
                          table.appendChild(row[0]);

                          return true;
                        }
                    };

                    var addColumn = {
                      title: trumbowyg.lang['tableAddColumn'],
                      text: '<i class="fa fa-plus m-r" /> ' + trumbowyg.lang['tableAddColumn'],
                      hasIcon: false,

                      fn: function () {
                          trumbowyg.saveRange();

                          var node = trumbowyg.doc.getSelection().focusNode.parentNode;
                          var table = fetchTable(node);

                          // add columns according to current rows count
                          for (var i = 0; i < table.childElementCount; i += 1) {
                            var row = table.childNodes[i];
                            var col = $('<td></td>')
                            row.appendChild(col[0]);
                          }

                          return true;
                      }
                    };

                    var destroy = {
                      title: trumbowyg.lang['tableDestroy'],
                      text: '<i class="fa fa-times m-r" /> ' + trumbowyg.lang['tableDestroy'],
                      hasIcon: false,

                      fn: function () {
                          trumbowyg.saveRange();

                          var node = trumbowyg.doc.getSelection().focusNode.parentNode;
                          var table = fetchTable(node);

                          if (table.tagName == "TBODY") {
                            table = table.parentNode;
                          }

                          table.remove();

                          return true;
                      }
                    };

                    var deleteRow = {
                      title: trumbowyg.lang['tableDeleteRow'],
                      text: '<i class="fa fa-minus m-r" /> ' + trumbowyg.lang['tableDeleteRow'],
                      hasIcon: false,

                      fn: function () {
                          trumbowyg.saveRange();

                          var node = trumbowyg.doc.getSelection().focusNode.parentNode;
                          var row = fetchRow(node);

                          row.remove();

                          return true;
                      }
                    };

                    var deleteColumn = {
                      title: trumbowyg.lang['tableDeleteColumn'],
                      text: '<i class="fa fa-minus m-r" /> ' + trumbowyg.lang['tableDeleteColumn'],
                      hasIcon: false,

                      fn: function () {
                          trumbowyg.saveRange();

                          var node = trumbowyg.doc.getSelection().focusNode;
                          var table = fetchTable(node);
                          var td = fetchCol(node);
                          var colIndex = td.cellIndex;

                          // delete columns according to current rows count
                          for (var i = 0; i < table.childElementCount; i += 1) {
                            var row = table.childNodes[i];
                            row.childNodes[colIndex].remove();
                          }

                          return true;
                      }
                    };

                    var fetchTable = function(node) {
                      if (node.tagName != "TBODY") {
                        return fetchTable(node.parentNode);
                      } else {
                        return node;
                      }
                    };

                    var fetchRow = function(node) {
                      if (node.tagName != "TR") {
                        return fetchRow(node.parentNode);
                      } else {
                        return node;
                      }
                    };

                    var fetchCol = function(node) {
                      if (node.tagName != "TD") {
                        return fetchCol(node.parentNode);
                      } else {
                        return node;
                      }
                    };

                    trumbowyg.addBtnDef('table', tableDropdown);
                    trumbowyg.addBtnDef('tableAddRow', addRow);
                    trumbowyg.addBtnDef('tableAddColumn', addColumn);
                    trumbowyg.addBtnDef('tableDeleteRow', deleteRow);
                    trumbowyg.addBtnDef('tableDeleteColumn', deleteColumn);
                    trumbowyg.addBtnDef('tableDestroy', destroy);
                }
            }
        }
    });
})(jQuery);
