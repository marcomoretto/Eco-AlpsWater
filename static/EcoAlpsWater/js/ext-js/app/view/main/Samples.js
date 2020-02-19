Ext.define('EcoAlpsWater.view.main.AddTrackingCommentsWindow', {
    extend: 'Ext.window.Window',
    xtype: 'add_tracking_comment_window',

    requires: [
        'Ext.window.Window',
        'Ext.form.Panel'
    ],

    controller: 'samples',
    bodyPadding: 10,
    title: 'New tracking comment',
    closable: true,
    autoShow: true,
    modal: true,
    width: 900,
    height: 800,
    layout: 'fit',

    items: [
        {
            id: 'new_tracking_comment',
            itemId: 'new_tracking_comment',
            xtype: 'form',
            frame: false,
            bodyPadding: 0,
            scrollable:false,
            border: false,
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },

            items: [{
            xtype: 'fieldset',
            title: 'Comment template fields',
            defaultType: 'textfield',
            defaults: {
                anchor: '100%'
            },

            items: [{
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Type',
                        name: 'type',
                        itemId: 'type',
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        queryMode: 'local',
                        emptyText: 'Select type ...',
                        allowBlank: true,
                        disabled: false,
                        flex: 1,
                        margin: '0 5 0 0',
                        store: {
                            autoLoad: true,
                            fields: ['id', 'name'],
                            data: [{
                                'id': 'send',
                                'name': 'Send sample'
                            }, {
                                'id': 'receive',
                                'name': 'Receive sample'
                            }, {
                                'id': 'store',
                                'name': 'Store sample'
                            }]
                        },
                        listeners: {
                            change: {
                                fn: 'onTrackingCommentsValueChange',
                            }
                        }
                    }, {
                        xtype: 'combobox',
                        fieldLabel: 'Amount',
                        name: 'amount',
                        itemId: 'amount',
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        disabled: false,
                        queryMode: 'local',
                        emptyText: 'Select amount ...',
                        allowBlank: true,
                        flex: 1,
                        margin: '0 5 0 0',
                        store: {
                            autoLoad: true,
                            fields: ['id', 'name'],
                            data: [{
                                'id': 'whole',
                                'name': 'Whole'
                            }, {
                                'id': 'aliquot',
                                'name': 'Aliquot'
                            }]
                        },
                        listeners: {
                            change: {
                                fn: 'onTrackingCommentsValueChange',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Keeper (sender)',
                        name: 'keeper_sender',
                        itemId: 'keeper_sender',
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        disabled: true,
                        queryMode: 'local',
                        emptyText: 'Select institute ...',
                        allowBlank: true,
                        flex: 1,
                        margin: '0 5 0 0',
                        store: {
                            autoLoad: true,
                            fields: ['id', 'name'],
                            proxy: {
                                type: 'ajax',
                                url: '/get_institutes_short_names/',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'rows'
                                }
                            }
                        },
                        listeners: {
                            change: {
                                fn: 'onTrackingCommentsValueChange',
                            }
                        }
                    }, {
                        xtype: 'combobox',
                        fieldLabel: 'Receiver',
                        name: 'receiver',
                        itemId: 'receiver',
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        disabled: true,
                        queryMode: 'local',
                        emptyText: 'Select institute ...',
                        allowBlank: true,
                        flex: 1,
                        margin: '0 5 0 0',
                        store: {
                            autoLoad: true,
                            fields: ['id', 'name'],
                            proxy: {
                                type: 'ajax',
                                url: '/get_institutes_short_names/',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'rows'
                                }
                            }
                        },
                        listeners: {
                            change: {
                                fn: 'onTrackingCommentsValueChange',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'datefield',
                        fieldLabel: 'Date',
                        name: 'date',
                        itemId: 'date',
                        allowBlank: true,
                        disabled: true,
                        flex: 1,
                        margin: '0 5 0 0',
                        listeners: {
                            change: {
                                fn: 'onTrackingCommentsValueChange',
                            }
                        }
                    }, {
                        xtype: 'combobox',
                        fieldLabel: 'Shipping temp',
                        name: 'shipping_temperature',
                        itemId: 'shipping_temperature',
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        disabled: true,
                        queryMode: 'local',
                        emptyText: 'Select temperature ...',
                        allowBlank: true,
                        flex: 1,
                        margin: '0 5 0 0',
                        store: {
                            autoLoad: true,
                            fields: ['id', 'name'],
                            data: [{
                                'id': 'at room temperature',
                                'name': 'Room temperature'
                            }, {
                                'id': 'cooled',
                                'name': 'Cooled'
                            }, {
                                'id': 'frozen',
                                'name': 'Frozen'
                            }]
                        },
                        listeners: {
                            change: {
                                fn: 'onTrackingCommentsValueChange',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Storage period',
                        name: 'storage_period',
                        itemId: 'storage_period',
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        disabled: true,
                        queryMode: 'local',
                        emptyText: 'Select period ...',
                        allowBlank: true,
                        flex: 1,
                        margin: '0 5 0 0',
                        store: {
                            autoLoad: true,
                            fields: ['id', 'name'],
                            data: [{
                                'id': 'short',
                                'name': 'Short'
                            }, {
                                'id': 'long',
                                'name': 'Long'
                            }]
                        },
                        listeners: {
                            change: {
                                fn: 'onTrackingCommentsValueChange',
                            }
                        }
                    }, {
                        xtype: 'combobox',
                        fieldLabel: 'Quantity unit',
                        name: 'quantity_unit',
                        itemId: 'quantity_unit',
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        disabled: true,
                        queryMode: 'local',
                        emptyText: 'Select unit ...',
                        allowBlank: true,
                        flex: 1,
                        margin: '0 5 0 0',
                        store: {
                            autoLoad: true,
                            fields: ['id', 'name'],
                            data: [{
                                'id': 'L',
                                'name': 'L'
                            }, {
                                'id': 'mL',
                                'name': 'mL'
                            }, {
                                'id': 'μL',
                                'name': 'μL'
                            }]
                        },
                        listeners: {
                            change: {
                                fn: 'onTrackingCommentsValueChange',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Temperature °C',
                        name: 'temperature',
                        itemId: 'temperature',
                        emptyText: 'Select temperature ...',
                        allowBlank: true,
                        disabled: true,
                        flex: 1,
                        margin: '0 5 0 0',
                        listeners: {
                            change: {
                                fn: 'onTrackingCommentsValueChange',
                            }
                        }
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: 'Quantity',
                        name: 'quantity',
                        itemId: 'quantity',
                        emptyText: 'Select quantity ...',
                        allowBlank: true,
                        disabled: true,
                        flex: 1,
                        margin: '0 5 0 0',
                        listeners: {
                            change: {
                                fn: 'onTrackingCommentsValueChange',
                            }
                        }
                    }
                ]
            }]}, {
                xtype: 'textareafield',
                fieldLabel: 'Comment',
                name: 'tracking_comment',
                itemId: 'tracking_comment',
                allowBlank: false,
                flex: 5
            }
            ],
            bbar: [
                '->', {
                    xtype: 'button',
                    glyph: 'f086',
                    itemId: 'add_comment',
                    text: 'Add comment',
                    formBind: true,
                    listeners: {
                        click: {
                            fn: 'onAddCommentTrackingComment'
                        }
                    }
                }
            ]
        }
    ],

    listeners: {

    },

    initComponent: function() {
        this.callParent();
    }
});

Ext.define('EcoAlpsWater.view.main.ViewSampleDetailsWindow', {
    extend: 'Ext.window.Window',
    xtype: 'view_sample_details',

    requires: [
        'Ext.window.Window',
        'Ext.form.Panel',
        'EcoAlpsWater.view.main.NewSampleStep0'
    ],

    controller: 'samples',
    bodyPadding: 10,
    title: 'Sample details',
    closable: true,
    autoShow: true,
    modal: true,
    width: 800,
    height: 800,
    layout: 'card',
    sample_id: null,

    items: [
        {
            id: 'detail-card-0',
            xtype: 'new_sample_step_0'
        },
        {
            id: 'detail-card-1',
            xtype: 'new_sample_step_1'
        },
        {
            id: 'detail-card-2',
            xtype: 'new_sample_step_2'
        },
        {
            id: 'detail-card-3',
            xtype: 'new_sample_step_3'
        }
    ],

    bbar: [
        {
            itemId: 'card-edit',
            text: 'Edit mode',
            handler: 'editMode',
            glyph: 'f044'
        },
        {
            itemId: 'card-update',
            text: 'Update',
            handler: 'updateSample',
            glyph: 'f062',
            hidden: true
        },
        '->',
        {
            itemId: 'card-prev',
            text: '&laquo; Previous',
            handler: 'showPrevious',
            disabled: true
        },
        {
            itemId: 'card-next',
            text: 'Next &raquo;',
            handler: 'showNext'
        }
    ],

    listeners: {
        afterrender: 'onSampleDetailWindowAfterRender'
    },

    initComponent: function() {
        this.callParent();
        this.controller.getComboBoxValues()
    }
});

var tooltipRenderer = function(value, metaData) {
    metaData.tdAttr = Ext.String.format('data-qtip="{0}"', value);
    return value;
};

var eawSamplesGridStore = new Ext.data.JsonStore({
    autoLoad: false,
    pageSize: 50,
    remoteSort: true,
    proxy: {
        type: 'ajax',
        timeout: 120000,
        url: '/get_samples/',
        reader: {
            type: 'json',
            rootProperty: 'rows',
            totalProperty: 'total'
        },
        actionMethods: {
            read: 'POST'
        }
    },
    fields: ['sample_id']
});

Ext.define('EcoAlpsWater.LiveFilter', {
    extend: 'Ext.form.field.Text',
    xtype: 'eaw_livefilter',
    requires: [
        'Ext.form.field.Text'
    ],
    
    controller: 'samples',

    labelWidth:'auto',

    listeners: {
        change: 'onLiveFilterChange'
    }
});

Ext.define('EcoAlpsWater.Paging', {
    extend: 'Ext.toolbar.Paging',
    xtype: 'eaw_paging',
    requires: [
        'Ext.toolbar.Paging'
    ],

    listeners: {
        beforechange: function(pagingtoolbar, page, eOpts) {

        }
    }
});

Ext.define('EcoAlpsWater.AdvancedSearchField', {
    extend: 'Ext.Container',
    xtype: 'eaw_advanced_search_field',

    layout: 'hbox',
    margin: '0 0 5 0',
    items: [
        {
            xtype: 'combobox',
            fieldLabel: '',
            name: 'field_name',
            itemId: 'field_name',
            valueField: 'id',
            displayField: 'name',
            queryMode: 'local',
            emptyText: 'Field name',
            allowBlank: false,
            flex: 5,
            margin: '0 5 0 0',
            store: {
                autoLoad: true,
                fields: ['id', 'name'],
                proxy: {
                    type: 'ajax',
                    url: '/get_search_field_names/',
                    reader: {
                        type: 'json',
                        rootProperty: 'rows'
                    }
                }
            },
            listeners: {
                change: {
                    fn: 'onChangeSearchField'
                }
            }
        }, {
            xtype: 'combobox',
            fieldLabel: '',
            name: 'field_contains',
            itemId: 'field_contains',
            valueField: 'id',
            displayField: 'name',
            typeAhead: true,
            queryMode: 'local',
            emptyText: 'Contains',
            allowBlank: false,
            flex: 5,
            margin: '0 5 0 0',
            store: Ext.create('Ext.data.Store', {
                fields: ['id', 'name'],
                data : [
                    {"id": "contains", "name": "CONTAINS"},
                    {"id": "doesnt_contain", "name": "DOESN'T CONTAIN"},
                    {"id": "gt", "name": "GREATER THAN"},
                    {"id": "gte", "name": "GREATER THAN OR EQUAL"},
                    {"id": "lt", "name": "LESS THAN"},
                    {"id": "lte", "name": "LESS THAN OR EQUAL"}
                ]
            })
        }, {
            xtype: 'textfield',
            ieldLabel: '',
            name: 'field_value',
            itemId: 'field_value',
            emptyText: 'Value',
            flex: 5,
            margin: '0 5 0 0',
            allowBlank: false,
        }, {
            xtype: 'datefield',
            ieldLabel: '',
            name: 'field_value',
            itemId: 'field_value_date',
            emptyText: 'Value',
            flex: 5,
            margin: '0 5 0 0',
            allowBlank: false,
            hidden: true
        }, {
            xtype: 'combobox',
            fieldLabel: '',
            name: 'field_and_or',
            itemId: 'field_and_or',
            valueField: 'id',
            displayField: 'name',
            typeAhead: true,
            queryMode: 'local',
            emptyText: 'AND/OR',
            allowBlank: true,
            flex: 5,
            margin: '0 5 0 0',
            store: Ext.create('Ext.data.Store', {
                fields: ['id', 'name'],
                data : [
                    {"id": "and", "name": "AND"},
                    {"id": "or", "name": "OR"}
                ]
            })
        }, {
            xtype: 'button',
            flex: 1,
            glyph: 'xf056',
            tooltip: 'Remove',
            tooltipType: 'title',
            listeners: {
                click: {
                    fn: 'onRemoveAdvancedSearchField'
                }
            }
        }
    ]

});

Ext.define('EcoAlpsWater.view.main.Samples', {
    extend: 'Ext.grid.Panel',
    xtype: 'samples',

    requires: [],

    title: 'Samples',

    controller: 'samples',

    store: eawSamplesGridStore,

    dockedItems: [{
        xtype: 'toolbar',
        defaults: {
            xtype: 'button',
            scale: 'small'
        },
        overflowHandler: 'menu',
        dock: 'top',
        items: [{
            xtype: 'fieldset',
            title: 'Advanced search',
            defaultType: 'textfield',
            defaults: {
                anchor: '100%'
            },
            collapsible: true,
            collapsed: true,
            items: [{
                xtype: 'eaw_advanced_search_field',
            }, {
                xtype: 'panel',
                layout: 'hbox',
                itemId: 'buttons',
                bbar: ['->', {
                    xtype: 'button',
                    glyph: 'xf055',
                    text: 'Add search field',
                    listeners: {
                        click: {
                            fn: 'onAddAdvancedSearchField'
                        }
                    }
                }, {
                    xtype: 'button',
                    glyph: 'xf002',
                    text: 'Search',
                    listeners: {
                        click: {
                            fn: 'onAdvancedSearch'
                        }
                    }
                }]
            }],
            flex: 1,
            listeners: {
                beforecollapse : 'onAdvancedSearchCollapse',
                beforeexpand : 'onAdvancedSearchExpand'
            }
        }]
    },{
        xtype: 'toolbar',
        defaults: {
            xtype: 'button',
            scale: 'small'
        },
        overflowHandler: 'menu',
        dock: 'top',
        items: ['->',
            {
                xtype: 'eaw_livefilter',
                fieldLabel: 'Filter',
                name: 'filter'
        }]
    },{
        xtype: 'toolbar',
        defaults: {
            xtype: 'button',
            scale: 'small'
        },
        overflowHandler: 'menu',
        dock: 'bottom',
        items: ['->', {
            text: 'Add tracking comments',
            glyph: 'f08d',
            itemId: 'add_tracking_comment',
            name: 'add_tracking_comment',
            disabled: true,
            listeners: {
                click: {
                    fn: 'onAddTrackingComment'
                }
            }
        }, {
            text: 'View details',
            glyph: 'f06e',
            itemId: 'view_details',
            name: 'view_details',
            disabled: true,
            listeners: {
                click: {
                    fn: 'onViewSampleDetails'
                }
            }
        }, {
            text: 'Clone sample',
            itemId: 'clone_sample',
            name: 'clone_sample',
            glyph: 'xf24d',
            disabled: true,
            listeners: {
                click: {
                    fn: 'onCloneSample'
                }
            }
        }, {
            text: 'Upload sequences',
            itemId: 'upload_sequences',
            name: 'upload_sequences',
            glyph: 'f093',
            disabled: true,
            listeners: {
                click: {
                    fn: 'onUploadSequence'
                }
            }
        }, {
            text: 'Download',
            itemId: 'data_collection_menu_item',
            iconCls: null,
            glyph: 'xf019',
            menu: {
                xtype: 'menu',
                plain: true,
                items: [{
                    text: 'Barcode',
                    itemId: 'barcode',
                    disabled: true,
                    iconCls: null,
                    glyph: 'f02a',
                    listeners: {
                        click: {
                            fn: 'onDownloadBarcode'
                        }
                    }
                }, {
                    text: 'Environmental and meta-data',
                    itemId: 'env_meta_data',
                    iconCls: null,
                    glyph: 'f03e',
                    disabled: true,
                    listeners: {
                        click: {
                            fn: 'onDownloadEnvMetaData'
                        }
                    }
                }, {
                    text: 'Sequence file',
                    itemId: 'sequence_file',
                    iconCls: null,
                    disabled: true,
                    glyph: 'f15c',
                    listeners: {
                        click: {
                            fn: 'onDownloadSequence',
                        }
                    }
                }]
            }
        }]},{
            xtype: 'eaw_paging',
            store: eawSamplesGridStore,
            dock: 'bottom',
            displayInfo: true
        }],

    selModel: {
        selType: 'checkboxmodel',
        mode: 'MULTI',
        checkOnly: true,
        allowDeselect: false
    },

    columns: [{
        text: 'ID',
        name: 'id',
        itemId: 'id',
        dataIndex: 'id',
        flex: 1,
        hidden: true
    },{
        text: 'Sample ID',
        name: 'sample_id',
        itemId: 'sample_id',
        dataIndex: 'sample_id',
        flex: 2,
        hidden:true,
    }, {
        text: 'Sample code',
        name: 'sample_code',
        itemId: 'sample_code',
        dataIndex: 'sample_code',
        flex: 3
    }, {
        text: 'User',
        name: 'username',
        itemId: 'username',
        dataIndex: 'username',
        flex: 3
    }, {
        text: 'Water body',
        name: 'water_body',
        itemId: 'water_body',
        dataIndex: 'water_body',
        flex: 2
    }, {
        text: 'Water body name',
        name: 'water_body_name',
        itemId: 'water_body_name',
        dataIndex: 'water_body_name',
        flex: 2
    }, {
        text: 'Station name',
        name: 'station',
        itemId: 'station',
        dataIndex: 'station',
        flex: 2
    }, {
        text: 'Sampling date',
        name: 'sampling_date',
        itemId: 'sampling_date',
        dataIndex: 'sampling_date',
        flex: 2
    }, {
        text: 'Sampling depth',
        name: 'sampling_depth',
        itemId: 'sampling_depth',
        dataIndex: 'sampling_depth',
        flex: 2
    }, {
        text: 'Depth type',
        name: 'depth_type',
        itemId: 'depth_type',
        dataIndex: 'depth_type',
        flex: 2
    }
    ],

    plugins: [{
        ptype: 'rowwidget',
        headerWidth: 100,
        widget: {
            xtype: 'grid',
            selModel: 'rowmodel',
            autoLoad: false,
            bind: {
                store: {
                    data: '{record.tracking_comments}'
                },
                title: 'Tracking comments'
            },
            columns: {
                defaults: {
                    renderer: tooltipRenderer
                },
                items:[{
                    header: 'Commenter',
                    dataIndex: 'commenter',
                    flex: 1
                }, {
                    header: 'Date',
                    dataIndex: 'date',
                    flex: 1
                }, {
                    header: 'Comment',
                    dataIndex: 'comment',
                    flex: 5
                }]
            }
        }
    }],
    
    listeners: {
        afterrender: 'onSamplesGridAfterRender',
        select: 'onItemSelect',
        deselect: 'onItemDeselect'
    }
});