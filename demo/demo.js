/**
 * Created by Zura on 3/22/2016.
 */
$(function () {
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
                removeItemButton: false,
                editItemButton: false,
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
    $('#todo-lists-initialize-btn').click(function () {
        $('#todo-lists-demo-events').lobiList({
            onInit: function () {
                Lobibox.notify('success', {
                    size: 'mini',
                    delay: false,
                    sound: false,
                    msg: 'LobiList is initialized'
                });
            },
            onAdd: function (list) {
                Lobibox.notify('warning', {
                    size: 'mini',
                    delay: false,
                    sound: false,
                    msg: 'List added'
                });
            },
            onRemove: function (list) {
                Lobibox.confirm({
                    msg: 'Are you sure you want to delete the list',
                    callback: function (box, type) {
                        if (type === 'yes') {
                            list.remove(true);
                        }
                    }
                });
                return false;
            },
            afterRemove: function () {
                Lobibox.notify('info', {
                    size: 'mini',
                    delay: false,
                    sound: false,
                    msg: 'List after remove'
                });
            },
            onItemAdd: function () {
                Lobibox.notify('info', {
                    size: 'mini',
                    delay: false,
                    sound: false,
                    msg: 'Before item is added'
                });
            },
            afterItemAdd: function () {
                Lobibox.notify('info', {
                    size: 'mini',
                    delay: false,
                    sound: false,
                    msg: 'After item is added'
                });
            },
            onItemUpdate: function () {
                Lobibox.notify('error', {
                    size: 'mini',
                    delay: false,
                    sound: false,
                    msg: 'Before item is updated'
                });
            },
            afterItemUpdate: function () {
                Lobibox.notify('error', {
                    size: 'mini',
                    delay: false,
                    sound: false,
                    msg: 'After item is updated'
                });
            },
            onItemDelete: function () {
                Lobibox.notify('warning', {
                    size: 'mini',
                    delay: false,
                    sound: false,
                    msg: 'Before item is deleted'
                });
            },
            afterItemDelete: function () {
                Lobibox.notify('warning', {
                    size: 'mini',
                    delay: false,
                    sound: false,
                    msg: 'After item is deleted'
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
        });
    });
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