/**
 * This view is an example list of people.
 */
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

Ext.define('EcoAlpsWater.view.main.Samples', {
    extend: 'Ext.grid.Panel',
    xtype: 'samples',

    requires: [],

    title: 'Samples',

    controller: 'samples',

    selModel: {
        mode: 'MULTI'
    },

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
            items: [],
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
            glyph: 'f06e'
        }, {
           text: 'Clone sample',
            itemId: 'clone_sample',
            name: 'clone_sample',
            glyph: 'xf24d'
        }, {
            text: 'Download',
            itemId: 'data_collection_menu_item',
            iconCls: null,
            glyph: 'xf019',
            menu: {
                xtype: 'menu',
                plain: true,
                items: [{
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
            //store:
            dock: 'bottom',
            displayInfo: true
        }],

    columns: [{
        text: 'Sample ID',
        name: 'sample_id',
        itemId: 'sample_id',
        dataIndex: 'sample_id',
        flex: 1
    }, {
        text: 'Sample code',
        name: 'sample_code',
        itemId: 'sample_code',
        dataIndex: 'sample_code',
        flex: 1
    }, {
        text: 'Lake code',
        name: 'lake_code',
        itemId: 'lake_code',
        dataIndex: 'lake_code',
        flex: 1
    }, {
        text: 'Lake', 
        name: 'lake',
        itemId: 'lake',
        dataIndex: 'lake',
        flex: 1
    }, {
        text: 'Station name',
        name: 'station',
        itemId: 'station',
        dataIndex: 'sample_id',
        flex: 1
    }, {
        text: 'Sampling date',
        name: 'sampling_date',
        itemId: 'sampling_date',
        dataIndex: 'sampling_date',
        flex: 1
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
        flex: 1
    }, {
        text: 'eDNA marker',
        name: 'edna_marker',
        itemId: 'edna_marker',
        dataIndex: 'edna_marker',
        flex: 1
    }
    ],

});