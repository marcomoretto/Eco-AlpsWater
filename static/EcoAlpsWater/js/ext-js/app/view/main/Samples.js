/**
 * This view is an example list of people.
 */
var eawSamplesGridStore = new Ext.data.JsonStore({
    autoLoad: false,
    pageSize: 10,
    remoteSort: true,
    proxy: {
        type: 'ajax',
        timeout: 120000,
        url: 'get_samples/',
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

    labelWidth:'auto',

    listeners: {
        change: function (me, newValue, oldValue, eOpts) {

        }
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
            typeAhead: true,
            queryMode: 'local',
            emptyText: 'Field name',
            allowBlank: false,
            flex: 5,
            margin: '0 5 0 0'
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
                    {"id": "doesnt_contain", "name": "DOESN'T CONTAIN"}
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
                    text: 'Search'
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
            text: 'View details',
            glyph: 'f06e',
            itemId: 'view_details',
            name: 'view_details',
            disabled: true
        }, {
            text: 'Clone sample',
            itemId: 'clone_sample',
            name: 'clone_sample',
            glyph: 'xf24d',
            disabled: true
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
                    iconCls: null,
                    glyph: 'f02a',
                    listeners: {
                        click: {
                            //fn: 'onAction'
                        }
                    }
                }, {
                    text: 'Environmental and meta-data',
                    itemId: 'env_meta_data',
                    iconCls: null,
                    glyph: 'f03e',
                    listeners: {
                        click: {
                            //fn: 'onAction'
                        }
                    }
                }, {
                    text: 'Sequence file',
                    itemId: 'sequence_file',
                    iconCls: null,
                    glyph: 'f15c',
                    listeners: {
                        click: {
                            //fn: 'onAction',
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
        flex: 1
    },{
        text: 'Sample ID',
        name: 'sample_id',
        itemId: 'sample_id',
        dataIndex: 'sample_id',
        flex: 2
    }, {
        text: 'Sample code',
        name: 'sample_code',
        itemId: 'sample_code',
        dataIndex: 'sample_code',
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
        flex: 1
    }, {
        text: 'Depth type',
        name: 'depth_type',
        itemId: 'depth_type',
        dataIndex: 'depth_type',
        flex: 2
    }, {
        text: 'eDNA marker',
        name: 'edna_marker',
        itemId: 'edna_marker',
        dataIndex: 'edna_marker',
        flex: 1
    }
    ],
    
    listeners: {
        afterrender: 'onSamplesGridAfterRender'
    }
});