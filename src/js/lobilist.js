//Author      : @arboshiki
/**
 * Generates random string of n length.
 * String contains only letters and numbers
 *
 * @param {int} n
 * @returns {String}
 */
Math.randomString = function (n) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < n; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};
$(function () {
    var List = function ($lobiList, options) {
//------------------------------------------------------------------------------
//----------------PROTOTYPE VARIABLES-------------------------------------------
//------------------------------------------------------------------------------
        this.$lobiList = $lobiList;
        this.$el = null;
        this.$elWrapper = null;
        this.$options = options;
        this.$items = [];
        this.$globalOptions = $lobiList.$options;
//------------------------------------------------------------------------------
//-----------------PRIVATE VARIABLES--------------------------------------------
//------------------------------------------------------------------------------        
        var me = this,
            $ul, $header, $title,
            $form, $footer, $body;
//------------------------------------------------------------------------------
//----------------PROTOTYPE FUNCTIONS-------------------------------------------
//------------------------------------------------------------------------------

        /**
         * Add item. If <code>action.insert</code> url is provided request is sent to the server.
         * Server respond: <code>{"success": Boolean, "msg": String}</code>
         * If <code>respond.success</code> is true item is added.
         * Otherwise <big>Lobibox</big> error notification is shown with the message server responded and item is not added.
         *
         * @param {Object} item "item options"
         * @returns {List}
         */
        this.addItem = function (item) {
            if (_triggerEvent('beforeItemAdd', [me, item]) === false){
                return me;
            }

            item = _processItemData(item);
            if (me.$globalOptions.actions.insert) {
                $.ajax(me.$globalOptions.actions.insert, {
                        data: item,
                        method: 'POST'
                    })
                    //res is JSON object of format {"success": Boolean, "id": Number, "msg": String}
                    .done(function (res) {
                        if (res.success) {
                            item.id = res.id;
                            _addItemToList(item);
                        } else {
                            console.error(res.msg);
                        }
                    });
            } else {
                item.id = me.$lobiList.getNextId();
                _addItemToList(item);
            }
            return me;
        };

        /**
         * Update item. If <code>action.update</code> url is provided request is sent to the server.
         * Server respond: <code>{"success": Boolean, "msg": String}</code>
         * If <code>respond.success</code> is true item is updated.
         * Otherwise <code>Lobibox</code> error notification is shown with the message server responded and item is not updated.
         *
         * @param {Object} item "item options"
         * @returns {List}
         */
        this.updateItem = function (item) {
            if (_triggerEvent('beforeItemUpdate', [me, item]) === false) {
                return me
            }
            if (me.$globalOptions.actions.update) {
                $.ajax(me.$globalOptions.actions.update, {
                        data: item,
                        method: 'POST'
                    })
                    //res is JSON object of format {"id": Number, "success": Boolean, "msg": String}
                    .done(function (res) {
                        if (res.success) {
                            _updateItemInList(item);
                        } else {
                            console.error("Error updating event");
                        }
                    });
            }
            _triggerEvent('afterItemUpdate', [me, item]);
            return me;
        };

        /**
         * Delete item from the list. If <code>action.delete</code> url is provided request is sent to the server.
         * Server respond: <code>{"success": Boolean, "msg": String}</code>
         * If <code>respond.success</code> is true item is deleted from the list.
         * Otherwise <code>Lobibox</code> error notification is shown with the message server responded and item is not deleted.
         *
         * @param {Object} item "item options"
         * @param {Boolean} discardEvent "trigger 'onItemDelete' event or not.
         *                                The event is triggered by default but disabling event is necessary when you
         *                                already listen the event and show custom confirm dialog. After confirm dialog
         *                                approvement you can call this method dynamically and give second parameter as true
         *                                which does not trigger the event again and item will be deleted"
         * @returns {List}
         */
        this.deleteItem = function (item, discardEvent) {
            if (discardEvent || (!discardEvent && _triggerEvent('beforeItemDelete', [me, item]) !== false)) {
                if (me.$globalOptions.actions.delete) {
                    $.ajax(me.$globalOptions.actions.delete, {
                            data: item,
                            method: 'POST',
                            async: false
                        })
                        //res is JSON object of format
                        .done(function (res) {
                            if (res.success) {
                                _removeItemFromList(item);
                            } else {
                                console.error("Error during delete: "+res.msg);
                            }
                        });
                } else {
                    _removeItemFromList(item);
                }
            }
            return me;
        };

        /**
         * If item does not have id, it is considered as new and adds to the list.
         * If it has id it is updated. If update and insert actions are provided corresponding request is sent to the server
         *
         * @param {Object} item "Item options"
         * @returns {List}
         */
        this.saveOrUpdateItem = function (item) {
            if (item.id) {
                me.updateItem(item);
            } else {
                me.addItem(item);
            }
            return me;
        };

        /**
         * Start title editing
         *
         * @returns {List}
         */
        this.startTitleEditing = function () {
            var input = _createInput();
            $title.attr('data-old-title', $title.html());
            input.val($title.html());
            input.insertAfter($title);
            $title.addClass('hide');
            $header.addClass('title-editing');
            input[0].focus();
            input[0].select();
            return me;
        };

        /**
         * Finish title editing
         *
         * @returns {List}
         */
        this.finishTitleEditing = function () {
            var $input = $header.find('input');
            $title.html($input.val()).removeClass('hide').removeAttr('data-old-title');
            $input.remove();
            $header.removeClass('title-editing');
            return me;
        };

        /**
         * Cancel title editing
         *
         * @returns {List}
         */
        this.cancelTitleEditing = function () {
            var $input = $header.find('input');
            if ($input.length === 0) {
                return me;
            }
            $title.html($title.attr('data-old-title')).removeClass('hide');
            $input.remove();
            $header.removeClass('title-editing');
            return me;
        };

        /**
         * Remove list
         *
         * @param {Boolean} discardEvent "trigger 'beforeListRemove' event or not.
         *                                The event is triggered by default but disabling event is necessary when you
         *                                already listen the event and show custom confirm dialog. After confirm dialog
         *                                approvement you can call this method dynamically and give second parameter as true
         *                                which does not trigger the event again and list will be removed"
         * @returns {List}
         */
        this.remove = function (discardEvent) {
            if (discardEvent || (!discardEvent && _triggerEvent('beforeListRemove', [me]) !== false)) {
                me.$lobiList.$lists.splice(me.$el.index(), 1);
                me.$elWrapper.remove();
                _triggerEvent('afterListRemove', [me]);
            }

            return me;
        };

        /**
         * Start editing of item
         *
         * @param {number} id "id of the item"
         * @returns {List}
         */
        this.editItem = function (id) {
            var $item = me.$lobiList.$el.find('li[data-id=' + id + ']');
            var $form = $item.closest('.lobilist').find('.lobilist-add-todo-form');
            var $footer = $item.closest('.lobilist').find('.lobilist-footer');

            $form.removeClass('hide');
            $footer.addClass('hide');
            $form[0].id.value = $item.attr('data-id');
            $form[0].title.value = $item.find('.lobilist-item-title').html();
            $form[0].description.value = $item.find('.lobilist-item-description').html() || '';
            $form[0].dueDate.value = $item.find('.lobilist-item-duedate').html() || '';
            return me;
        };

//------------------------------------------------------------------------------
//-----------------PRIVATE FUNCTIONS--------------------------------------------
//------------------------------------------------------------------------------
        function _processItemData(item) {
            return $.extend({}, $.fn.lobiList.OPTIONS.itemOptions, item);
        }

        function _init() {
            if (!me.$options.id) {
                me.$options.id = Math.randomString(10);
            }
            var $wrapper = $('<div>', {
                'class': 'lobilist-wrapper'
            });
            var $div = $('<div>', {
                'id': me.$options.id,
                'class': 'lobilist'
            }).appendTo($wrapper);

            if (me.$options.defaultStyle) {
                $div.addClass(me.$options.defaultStyle);
            }
            me.$el = $div;
            me.$elWrapper = $wrapper;
            $header = _createHeader();
            $title = _createTitle();
            $body = _createBody();
            $ul = _createList();
            if (options.items) {
                _createItems(options.items);
            }
            $form = _createForm();
            $body.append($ul, $form);
            $footer = _createFooter();
            if (me.$globalOptions.sortable)
                _enableSorting();
        }

        function _createHeader() {
            var $header = $('<div>', {
                'class': 'lobilist-header'
            });
            var $actions = $('<div>', {
                'class': 'lobilist-actions'
            }).appendTo($header);
            if (me.$options.controls && me.$options.controls.length > 0) {
                if (me.$options.controls.indexOf('styleChange') > -1) {
                    $actions.append(_createDropdownForStyleChange());
                }

                if (me.$options.controls.indexOf('edit') > -1) {
                    $actions.append(_createEditTitleButton());
                    $actions.append(_createFinishTitleEditing());
                    $actions.append(_createCancelTitleEditing());
                }
                if (me.$options.controls.indexOf('add') > -1) {
                    $actions.append(_createAddNewButton());
                }
                if (me.$options.controls.indexOf('remove') > -1) {
                    $actions.append(_createCloseButton());
                }
            }
            me.$el.append($header);
            return $header;
        }

        function _createTitle() {
            var $title = $('<div>', {
                'class': 'lobilist-title',
                html: me.$options.title
            }).appendTo($header);
            if (me.$options.controls && me.$options.controls.indexOf('edit') > -1) {
                $title.on('dblclick', function () {
                    me.startTitleEditing();
                });
            }
            return $title;
        }

        function _createBody() {
            return $('<div>', {
                'class': 'lobilist-body'
            }).appendTo(me.$el);

        }

        function _createForm() {
            var $form = $('<form>', {
                'class': 'lobilist-add-todo-form hide'
            });
            $('<input>', {
                type: 'hidden',
                name: 'id'
            }).appendTo($form);
            $('<div>', {
                'class': 'form-group'
            }).append(
                $('<input>', {
                    'type': 'text',
                    name: 'title',
                    'class': 'form-control',
                    placeholder: 'TODO title'
                })
            ).appendTo($form);
            $('<div>', {
                'class': 'form-group'
            }).append(
                $('<textarea>', {
                    rows: '2',
                    name: 'description',
                    'class': 'form-control',
                    'placeholder': 'TODO description'
                })
            ).appendTo($form);
            $('<div>', {
                'class': 'form-group'
            }).append(
                $('<input>', {
                    'type': 'text',
                    name: 'dueDate',
                    'class': 'form-control',
                    placeholder: 'Due Date'
                })
            ).appendTo($form);
            var $ft = $('<div>', {
                'class': 'lobilist-form-footer'
            });
            $('<button>', {
                'class': 'btn btn-primary btn-sm btn-add-todo',
                html: 'Add'
            }).appendTo($ft);
            $('<button>', {
                type: 'button',
                'class': 'btn btn-default btn-sm btn-discard-todo',
                html: '<i class="glyphicon glyphicon-remove-circle"></i>'
            }).click(function () {
                $form.addClass('hide');
                $footer.removeClass('hide');
            }).appendTo($ft);
            $ft.appendTo($form);

            _formHandler($form);

            me.$el.append($form);
            return $form;
        }

        function _formHandler($form) {
            $form.on('submit', function (ev) {
                ev.preventDefault();
                _submitForm();
            });
        }

        function _submitForm() {
            if (!$form[0].title.value) {
                _showFormError('title', 'Title can not be empty');
                return;
            }
            me.saveOrUpdateItem({
                id: $form[0].id.value,
                title: $form[0].title.value,
                description: $form[0].description.value,
                dueDate: $form[0].dueDate.value
            });
            $form.addClass('hide');
            $footer.removeClass('hide');
        }

        function _createFooter() {
            var $footer = $('<div>', {
                'class': 'lobilist-footer'
            });
            $('<button>', {
                type: 'button',
                'class': 'btn-link btn-show-form',
                'html': 'Add new'
            }).click(function () {
                _resetForm();
                $form.removeClass('hide');
                $footer.addClass('hide');
            }).appendTo($footer);
            me.$el.append($footer);
            return $footer;
        }

        function _createList() {
            var $list = $('<ul>', {
                'class': 'lobilist-items'
            });
            me.$el.append($list);
            return $list;
        }

        function _createItems(items) {
            for (var i = 0; i < items.length; i++) {
                _addItem(items[i]);
            }
        }

        /**
         * This method is called when plugin is initialized
         * and initial items are added to the list
         *
         * @type Object
         */
        function _addItem(item) {
            if (!item.id) {
                item.id = me.$lobiList.getNextId();
            }
            if (_triggerEvent('beforeItemAdd', [me, item]) !== false){
                item = _processItemData(item);
                _addItemToList(item);
            }
        }

        function _createCheckbox() {
            var $item = $('<input>', {
                'type': 'checkbox'
            });
            $item.change(_onCheckboxChange);
            return $('<label>', {
                'class': 'checkbox-inline lobilist-check'
            }).append($item);
        }

        function _onCheckboxChange(){
            var $this = $(this);
            if ($this.prop('checked')){
                _triggerEvent('afterMarkAsDone', [me, $this])
            } else {
                _triggerEvent('afterMarkAsUndone', [me, $this])
            }

            $this.closest('.lobilist-item').toggleClass('item-done');
        }

        function _createDropdownForStyleChange() {
            var $dropdown = $('<div>', {
                'class': 'dropdown'
            }).append(
                $('<button>', {
                    'type': 'button',
                    'data-toggle': 'dropdown',
                    'class': 'btn btn-default btn-xs',
                    'html': '<i class="glyphicon glyphicon-th"></i>'
                })
            );
            var $menu = $('<div>', {
                'class': 'dropdown-menu dropdown-menu-right'
            }).appendTo($dropdown);

            for (var i = 0; i < $.fn.lobiList.OPTIONS.listStyles.length; i++) {
                var st = $.fn.lobiList.OPTIONS.listStyles[i];
                $('<div class="' + st + '"></div>')
                    .on('mousedown', function (ev) {
                        ev.stopPropagation()
                    })
                    .click(function () {
                        me.$el.removeClass($.fn.lobiList.OPTIONS.listStyles.join(" "))
                            .addClass(this.className);
                    })
                    .appendTo($menu);
            }
            return $dropdown;
        }

        function _createEditTitleButton() {
            var $btn = $('<button>', {
                'class': 'btn btn-default btn-xs',
                html: '<i class="glyphicon glyphicon-edit"></i>'
            });
            $btn.click(function () {
                me.startTitleEditing();
            });

            return $btn;
        }

        function _createAddNewButton() {
            var $btn = $('<button>', {
                'class': 'btn btn-default btn-xs',
                html: '<i class="glyphicon glyphicon-plus"></i>'
            });
            $btn.click(function () {
                var list = me.$lobiList.addList();
                list.startTitleEditing();
            });
            return $btn;
        }

        function _createCloseButton() {
            var $btn = $('<button>', {
                'class': 'btn btn-default btn-xs',
                html: '<i class="glyphicon glyphicon-remove"></i>'
            });
            $btn.click(_onRemoveListClick);
            return $btn;
        }

        function _onRemoveListClick() {
            me.remove();
            return me;
        }

        function _createFinishTitleEditing() {
            var $btn = $('<button>', {
                'class': 'btn btn-default btn-xs btn-finish-title-editing',
                html: '<i class="glyphicon glyphicon-ok-circle"></i>'
            });
            $btn.click(function () {
                me.finishTitleEditing();
            });
            return $btn;
        }

        function _createCancelTitleEditing() {
            var $btn = $('<button>', {
                'class': 'btn btn-default btn-xs btn-cancel-title-editing',
                html: '<i class="glyphicon glyphicon-remove-circle"></i>'
            });
            $btn.click(function () {
                me.cancelTitleEditing();
            });
            return $btn;
        }

        function _createInput() {
            var input = $('<input>', {
                type: 'text',
                'class': 'form-control'
            });
            input.on('keyup', function (ev) {
                if (ev.which === 13) {
                    me.finishTitleEditing();
                }
            });
            return input;
        }

        function _showFormError(field, error) {
            var $fGroup = $form.find('[name="' + field + '"]').closest('.form-group')
                .addClass('has-error');
            $fGroup.find('.help-block').remove();
            $fGroup.append(
                $('<span>', {
                    'class': 'help-block',
                    html: error
                })
            );
        }

        function _resetForm() {
            $form[0].reset();
            $form[0].id.value = "";
            $form.find('.form-group').removeClass('has-error').find('.help-block').remove();
        }

        function _enableSorting() {
            me.$el.find('.lobilist-items').sortable({
                connectWith: '.lobilist .lobilist-items',
                items: '.lobilist-item',
                handle: '.drag-handler',
                cursor: 'move',
                placeholder: 'lobilist-item-placeholder',
                forcePlaceholderSize: true,
                opacity: 0.9,
                revert: 70,
                update: function(event, ui){
                    _triggerEvent('afterItemReorder', [me, ui.item]);
                }
            });
        }

        function _addItemToList(item) {
//            item =
            var $li = $('<li>', {
                'data-id': item.id,
                'class': 'lobilist-item'
            });
            $li.append($('<div>', {
                'class': 'lobilist-item-title',
                'html': item.title
            }));
            if (item.description) {
                $li.append($('<div>', {
                    'class': 'lobilist-item-description',
                    html: item.description
                }));
            }
            if (item.dueDate) {
                $li.append($('<div>', {
                    'class': 'lobilist-item-duedate',
                    html: item.dueDate
                }));
            }
            $li = _addItemControls($li);
            if (item.done) {
                $li.find('input[type=checkbox]').prop('checked', true);
                $li.addClass('item-done');
            }
            $li.data('lobiListItem', item);
            $ul.append($li);
            _triggerEvent('afterItemAdd', [me, item]);
            return $li;
        }

        function _addItemControls($li) {
            if (me.$options.useCheckboxes) {
                $li.append(_createCheckbox());
            }
            var $itemControlsDiv = $('<div>', {
                'class': 'todo-actions'
            }).appendTo($li);

            if (me.$options.enableTodoEdit) {
                $itemControlsDiv.append($('<div>', {
                    'class': 'edit-todo todo-action',
                    html: '<i class="glyphicon glyphicon-pencil"></i>'
                }).click(function () {
                    me.editItem($(this).closest('li').data('id'));
                }));
            }

            if (me.$options.enableTodoRemove) {
                $itemControlsDiv.append($('<div>', {
                    'class': 'delete-todo todo-action',
                    html: '<i class="glyphicon glyphicon-remove"></i>'
                }).click(function () {
                    me.deleteItem($(this).closest('li').data('lobiListItem'));
                }));
            }

            $li.append($('<div>', {
                'class': 'drag-handler'
            }));
            return $li;
        }

        function _updateItemInList(item) {
            var $li = me.$lobiList.$el.find('li[data-id="' + item.id + '"]');
            $li.find('input[type=checkbox]').prop('checked', item.done);
            $li.find('.lobilist-item-title').html(item.title);
            $li.find('.lobilist-item-description').remove();
            $li.find('.lobilist-item-duedate').remove();


            if (item.description) {
                $li.append('<div class="lobilist-item-description">' + item.description + '</div>');
            }
            if (item.dueDate) {
                $li.append('<div class="lobilist-item-duedate">' + item.dueDate + '</div>');
            }
            $li.data('lobiListItem', item);
        }

        function _triggerEvent(type, data) {
            if (me.$options[type] && typeof me.$options[type] === 'function') {
                return me.$options[type].call(me, data);
            } else {
                return me.$el.trigger(type, data);
            }
        }

        function _removeItemFromList(item) {
            me.$lobiList.$el.find('li[data-id=' + item.id + ']').remove();
            _triggerEvent('afterItemDelete', [me, item]);
        }
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
        _init();
    };
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    var LobiList = function ($el, options) {
//------------------------------------------------------------------------------
//----------------PROTOTYPE VARIABLES-------------------------------------------
//------------------------------------------------------------------------------
        this.$el = null;
        this.$lists = [];
        this.$options = {};
//------------------------------------------------------------------------------
//-----------------PRIVATE VARIABLES--------------------------------------------
//------------------------------------------------------------------------------
        var me = this,
            _nextId = 1;
//------------------------------------------------------------------------------
//----------------PROTOTYPE FUNCTIONS-------------------------------------------
//------------------------------------------------------------------------------
        /**
         *
         * @param {Object} list
         * @returns {List}
         */
        this.addList = function (list) {
            if (!(list instanceof List)) {
                list = new List(me, _processListOptions(list));
            }
            if (_triggerEvent('beforeListAdd', [me, list]) !== false){
                me.$lists.push(list);
                me.$el.append(list.$elWrapper);
                list.$el.data('lobiList', list);
                _triggerEvent('afterListAdd', [me, list]);
            }
            return list;
        };

        this.destroy = function () {
            if (_triggerEvent('beforeDestroy', [me]) !== false) {
                for (var i = 0; i < me.$lists.length; i++) {
                    me.$lists[i].remove();
                }
                if (me.$options.sortable) {
                    me.$el.sortable("destroy");
                }
                _triggerEvent('afterDestroy', [me]);
            }

            // me.$el.removeClass("lobilists").html("");
            // delete me.$options;
            console.log(me);
        };

        /**
         * Get next id which will be assigned to new item
         *
         * @returns {Number}
         */
        this.getNextId = function () {
            return _nextId++;
        };

//------------------------------------------------------------------------------
//-----------------PRIVATE FUNCTIONS--------------------------------------------
//------------------------------------------------------------------------------
        function _processInput(options) {
            options = $.extend({}, $.fn.lobiList.DEFAULT_OPTIONS, options);
            if (options.actions.load) {
                $.ajax(options.actions.load, {
                    async: false
                }).done(function (res) {
                    options.lists = res.lists;
                });
            }
            return options;
        }

        function _processListOptions(listOptions) {
            listOptions = $.extend({}, $.fn.lobiList.OPTIONS.listsOptions, listOptions);

            for (var i in me.$options){
                if (me.$options.hasOwnProperty(i) && listOptions[i] === undefined){
                    listOptions[i] = me.$options[i];
                }
            }
            return listOptions;
        }

        function _init() {
            me.$el.addClass('lobilists');
            if (me.$options.onSingleLine) {
                me.$el.addClass('single-line');
            }
            _createLists();
            if (me.$options.sortable) {
                me.$el.sortable({
                    items: '.lobilist-wrapper',
                    handle: '.lobilist-header',
                    cursor: 'move',
                    placeholder: 'lobilist-placeholder',
                    forcePlaceholderSize: true,
                    opacity: 0.9,
                    revert: 70,
                    update: function(event, ui){
                        _triggerEvent('afterListReorder', [me, ui.item.find('.lobilist').data('lobiList')]);
                    }
                });
            } else {
                me.$el.addClass('no-sortable');
            }
            _triggerEvent('init', [me]);
        }

        function _createLists() {
            for (var i = 0; i < me.$options.lists.length; i++) {
                me.addList(me.$options.lists[i]);
            }
        }

        function _triggerEvent(type, data) {
            if (me.$options[type] && typeof me.$options[type] === 'function') {
                return me.$options[type].call(me, data);
            } else {
                return me.$el.trigger(type, data);
            }
        }

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
        this.$el = $el;
        this.$options = _processInput(options);
        _init();
    };

    $.fn.lobiList = function (option) {
        var args = arguments;
        var ret;
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('lobiList');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('lobiList', (data = new LobiList($this, options)));
            }
            if (typeof option === 'string') {
                args = Array.prototype.slice.call(args, 1);
                ret = data[option].apply(data, args);
            }
        });
    };
    $.fn.lobiList.OPTIONS = {
        'listStyles': ['lobilist-default', 'lobilist-danger', 'lobilist-success', 'lobilist-warning', 'lobilist-info', 'lobilist-primary'],
        listsOptions: {
            id: false,
            title: '',
            items: []
        },
        itemOptions: {
            id: false,
            title: '',
            description: '',
            dueDate: '',
            done: false
        }

    };
    $.fn.lobiList.DEFAULT_OPTIONS = {
        lists: [],
        // Urls to communicate to backend
        actions: {
            'load': '',
            'update': '',
            'insert': '',
            'delete': ''
        },
        useCheckboxes: true,
        enableTodoAdd: false,
        enableTodoRemove: true,
        enableTodoEdit: true,
        sortable: true,
        controls: ['edit', 'add', 'remove', 'styleChange'],
        //List style. Available options: 'lobilist-default', 'lobilist-info', 'lobilist-success', 'lobilist-danger', 'lobilist-warning', 'lobilist-primary'
        defaultStyle: 'lobilist-default',
        onSingleLine: true,

        // Events
        /**
         * @event init
         * Fires when <code>LobiList</code> is initialized
         * @param {LobiList} The <code>LobiList</code> instance
         */
        init: null,
        
        /**
         * @event beforeDestroy
         * Fires before <code>Lobilist</code> is destroyed. Return false if you do not want <code>LobiList</code> to be destroyed.
         * @param {LobiList} The <code>LobiList</code> to be destroyed
         */
        beforeDestroy: null,
        
        /**
         * @event afterDestroy
         * Fires after <code>Lobilist</code> is destroyed.
         * @param {LobiList} The destroyed <code>LobiList</code> instance
         */
        afterDestroy: null,

        /**
         * @event beforeListAdd
         * Fires before <code>List</code> is added to <code>LobiList</code>. Return false to prevent adding list.
         * @param {LobiList} The <code>LobiList</code> instance
         * @param {List} The <code>List</code> instance to be added
         */
        beforeListAdd: null,

        /**
         * @event afterListAdd
         * Fires after <code>List</code> is added to <code>LobiList</code>.
         * @param {LobiList} The <code>LobiList</code> instance
         * @param {List} Just added <code>List</code> instance
         */
        afterListAdd: null,

        /**
         * @event beforeListRemove
         * Fires before <code>List</code> is removed. Returning false will prevent removing the list
         * @param {List} The <code>List</code> to be removed
         */
        beforeListRemove: null,

        /**
         * @event afterListRemove
         * Fires after <code>List</code> is removed
         * @param {List} The remove <code>List</code>
         */
        afterListRemove: null,

        /**
         * @event beforeItemAdd
         * Fires before item is added in <code>List</code>. Return false if you want to prevent removing item
         * @param {List} The <code>List</code> in which the item is going to be added
         * @param {Object} The item object
         */
        beforeItemAdd: null,

        /**
         * @event afterItemAdd
         * Fires after item is added in <code>List</code>
         * @param {List} The <code>List</code> in which the item is added
         * @param {Object} The item object
         */
        afterItemAdd: null,

        /**
         * @event beforeItemUpdate
         * Fires before item is updated. Returning false will prevent updating item
         * @param {List} The <code>List</code> instance
         * @param {Object} The item object which is going to be updated
         */
        beforeItemUpdate: null,

        /**
         * @event afterItemUpdate
         * Fires after item is updated
         * @param {List} The <code>List</code> object
         * @param {Object} The updated item object
         */
        afterItemUpdate: null,

        /**
         * @event beforeItemDelete
         * Fires before item is deleted. Returning false will prevent deleting the item
         * @param {List} The <code>List</code> instance
         * @param {Object} The item object to be deleted
         */
        beforeItemDelete: null,

        /**
         * @event afterItemDelete
         * Fires after item is deleted.
         * @param {List} The <code>List</code> object
         * @param {Object} The deleted item object
         */
        afterItemDelete: null,

        /**
         * @event afterListReorder
         * Fires after <code>List</code> position is changed among its siblings
         * @param {LobiList} The <code>LobiList</code> instance
         * @param {List} The <code>List</code> instance which changed its position
         */
        afterListReorder: null,

        /**
         * @event afterItemReorder
         * Fires after item position is changed (it is reordered) in list
         * @param {List} The <code>List</code> instance
         * @param {Object} The jQuery object of item
         */
        afterItemReorder: null,

        /**
         * @event afterMarkAsDone
         * Fires after item is marked as done.
         * @param {List} The <code>List</code> instance
         * @param {Object} The jQuery checkbox object
         */
        afterMarkAsDone: null,

        /**
         * @event afterMarkAsUndone
         * Fires after item is marked as undone
         * @param {List} The <code>List</code> instance
         * @param {Object} The jQuery checkbox object
         */
        afterMarkAsUndone: null
    };
});