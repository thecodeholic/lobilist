/**
 * Created by Zura on 3/22/2016.
 */
$(function () {

    Lobibox.notify.DEFAULTS = $.extend({}, Lobibox.notify.DEFAULTS, {
        size: 'mini',
        // delay: false,
        position: 'right top'
    });

    var codes = $('.highlight code');
    codes.each(function (ind, el) {
        hljs.highlightBlock(el);
    });

    $('#todo-lists-demo-sorting').lobiList({
        sortable: false,
        lists: [
            {
                title: 'TODO',
                defaultStyle: 'lobilist-info',
                controls: ['edit', 'styleChange'],
                items: [
                    {
                        title: 'Floor cool cinders',
                        description: 'Thunder fulfilled travellers folly, wading, lake.',
                        dueDate: '2015-01-31'
                    }
                ]
            },
            {
                title: 'Controls disabled',
                controls: false,
                items: [
                    {
                        title: 'Composed trays',
                        description: 'Hoary rattle exulting suspendisse elit paradises craft wistful. Bayonets allures prefer traits wrongs flushed. Tent wily matched bold polite slab coinage celerities gales beams.'
                    }
                ]
            }
        ]
    });
    $('#todo-lists-demo-controls').lobiList({
        lists: [
            {
                title: 'TODO',
                defaultStyle: 'lobilist-info',
                controls: ['edit', 'styleChange'],
                items: [
                    {
                        title: 'Floor cool cinders',
                        description: 'Thunder fulfilled travellers folly, wading, lake.',
                        dueDate: '2015-01-31'
                    }
                ]
            },
            {
                title: 'Disabled custom checkboxes',
                defaultStyle: 'lobilist-danger',
                controls: ['edit', 'add', 'remove'],
                useLobicheck: false,
                items: [
                    {
                        title: 'Periods pride',
                        description: 'Accepted was mollis',
                        done: true
                    }
                ]
            },
            {
                title: 'Controls disabled',
                controls: false,
                items: [
                    {
                        title: 'Composed trays',
                        description: 'Hoary rattle exulting suspendisse elit paradises craft wistful. ' +
                        'Bayonets allures prefer traits wrongs flushed. Tent wily matched bold polite slab coinage ' +
                        'celerities gales beams.'
                    }
                ]
            },
            {
                title: 'Disabled todo edit/remove',
                enableTodoRemove: false,
                enableTodoEdit: false,
                items: [
                    {
                        title: 'Composed trays',
                        description: 'Hoary rattle exulting suspendisse elit paradises craft wistful. ' +
                        'Bayonets allures prefer traits wrongs flushed. Tent wily matched bold polite slab coinage ' +
                        'celerities gales beams.'
                    }
                ]
            }
        ]
    });

    (function () {
        var list;

        $('#todo-lists-initialize-btn').click(function () {
            list = $('#todo-lists-demo-events')
                .lobiList({
                    init: function(){
                        console.log('init', arguments);
                        Lobibox.notify('default', {
                            msg: 'init'
                        });
                    },
                    beforeDestroy: function(){
                        console.log('beforeDestroy', arguments);
                        Lobibox.notify('default', {
                            msg: 'beforeDestroy'
                        });
                    },
                    afterDestroy: function(){
                        console.log('afterDestroy', arguments);
                        Lobibox.notify('default', {
                            msg: 'afterDestroy'
                        });
                    },
                    beforeListAdd: function(){
                        console.log('beforeListAdd', arguments);
                        Lobibox.notify('default', {
                            msg: 'beforeListAdd'
                        });
                    },
                    afterListAdd: function(){
                        console.log('afterListAdd', arguments);
                        Lobibox.notify('default', {
                            msg: 'afterListAdd'
                        });
                    },
                    beforeListRemove: function(list){
                        console.log('beforeListRemove', arguments);
                        Lobibox.notify('default', {
                            msg: 'beforeListRemove'
                        });
                    },
                    afterListRemove: function(){
                        console.log('afterListRemove', arguments);
                        Lobibox.notify('default', {
                            msg: 'afterListRemove'
                        });
                    },
                    beforeItemAdd: function(){
                        console.log('beforeItemAdd', arguments);
                        Lobibox.notify('default', {
                            msg: 'beforeItemAdd'
                        });
                    },
                    afterItemAdd: function(){
                        console.log('afterItemAdd', arguments);
                        Lobibox.notify('default', {
                            msg: 'afterItemAdd'
                        });
                    },
                    beforeItemUpdate: function(){
                        console.log('beforeItemUpdate', arguments);
                        Lobibox.notify('default', {
                            msg: 'beforeItemUpdate'
                        });
                    },
                    afterItemUpdate: function(){
                        console.log('afterItemUpdate', arguments);
                        Lobibox.notify('default', {
                            msg: 'afterItemUpdate'
                        });
                    },
                    beforeItemDelete: function(){
                        console.log('beforeItemDelete', arguments);
                        Lobibox.notify('default', {
                            msg: 'beforeItemDelete'
                        });
                    },
                    afterItemDelete: function(){
                        console.log('afterItemDelete', arguments);
                        Lobibox.notify('default', {
                            msg: 'afterItemDelete'
                        });
                    },
                    beforeListDrop: function(){
                        console.log('beforeListDrop', arguments);
                        Lobibox.notify('default', {
                            msg: 'beforeListDrop'
                        });
                    },
                    afterListDrop: function(){
                        console.log('afterListDrop', arguments);
                        Lobibox.notify('default', {
                            msg: 'afterListDrop'
                        });
                    },
                    beforeItemDrop: function(){
                        console.log('beforeItemDrop', arguments);
                        Lobibox.notify('default', {
                            msg: 'beforeItemDrop'
                        });
                    },
                    afterItemDrop: function(){
                        console.log('afterItemDrop', arguments);
                        Lobibox.notify('default', {
                            msg: 'afterItemDrop'
                        });
                    },
                    beforeMarkAsDone: function(){
                        console.log('beforeMarkAsDone', arguments);
                        Lobibox.notify('default', {
                            msg: 'beforeMarkAsDone'
                        });
                    },
                    afterMarkAsDone: function(){
                        console.log('afterMarkAsDone', arguments);
                        Lobibox.notify('default', {
                            msg: 'afterMarkAsDone'
                        });
                    },
                    beforeUnmarkAsDone: function(){
                        console.log('beforeUnmarkAsDone', arguments);
                        Lobibox.notify('default', {
                            msg: 'beforeUnmarkAsDone'
                        });
                    },
                    afterUnmarkAsDone: function(){
                        console.log('afterUnmarkAsDone', arguments);
                        Lobibox.notify('default', {
                            msg: 'afterUnmarkAsDone'
                        });
                    },
                    lists: [
                        {
                            title: 'TODO',
                            defaultStyle: 'lobilist-info',
                            items: [
                                {
                                    title: 'Floor cool cinders',
                                    description: 'Thunder fulfilled travellers folly, wading, lake.',
                                    dueDate: '2015-01-31'
                                },
                                {
                                    title: 'Periods pride',
                                    description: 'Accepted was mollis',
                                    done: true
                                },
                                {
                                    title: 'Flags better burns pigeon',
                                    description: 'Rowed cloven frolic thereby, vivamus pining gown intruding strangers prank ' +
                                    'treacherously darkling.'
                                },
                                {
                                    title: 'Accepted was mollis',
                                    description: 'Rowed cloven frolic thereby, vivamus pining gown intruding strangers prank ' +
                                    'treacherously darkling.',
                                    dueDate: '2015-02-02'
                                }
                            ]
                        }
                    ]
                })
                .data('lobiList');
        });

        $('#todo-lists-destroy-btn').click(function () {
            list.destroy();
        });
    })();


    $('#todo-lists-demo').lobiList({
        lists: [
            {
                title: 'TODO',
                defaultStyle: 'lobilist-info',
                items: [
                    {
                        title: 'Floor cool cinders',
                        description: 'Thunder fulfilled travellers folly, wading, lake.',
                        dueDate: '2015-01-31'
                    },
                    {
                        title: 'Periods pride',
                        description: 'Accepted was mollis',
                        done: true
                    },
                    {
                        title: 'Flags better burns pigeon',
                        description: 'Rowed cloven frolic thereby, vivamus pining gown intruding strangers prank treacherously darkling.'
                    },
                    {
                        title: 'Accepted was mollis',
                        description: 'Rowed cloven frolic thereby, vivamus pining gown intruding strangers prank treacherously darkling.',
                        dueDate: '2015-02-02'
                    }
                ]
            },
            {
                title: 'DOING',
                items: [
                    {
                        title: 'Composed trays',
                        description: 'Hoary rattle exulting suspendisse elit paradises craft wistful. Bayonets allures prefer traits wrongs flushed. Tent wily matched bold polite slab coinage celerities gales beams.'
                    },
                    {
                        title: 'Chic leafy'
                    },
                    {
                        title: 'Guessed interdum armies chirp writhes most',
                        description: 'Came champlain live leopards twilight whenever warm read wish squirrel rock.',
                        dueDate: '2015-02-04',
                        done: true
                    }
                ]
            }
        ]
    });
});