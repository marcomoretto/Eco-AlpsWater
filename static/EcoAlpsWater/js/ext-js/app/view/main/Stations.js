Ext.define('EcoAlpsWater.view.main.SingleGeoPoint', {
    extend: 'Ext.container.Container',
    xtype: 'single_geo_point',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [{
        xtype: 'numberfield',
        name: 'latitude',
        labelWidth: 60,
        fieldLabel: 'Latitude',
        itemId: 'latitude',
        decimalPrecision: 6,
        allowBlank: false,
        margin: 10,
        flex: 10
    },{
        xtype: 'numberfield',
        name: 'longitude',
        fieldLabel: 'Longitude',
        labelWidth: 60,
        itemId: 'longitude',
        decimalPrecision: 6,
        allowBlank: false,
        margin: 10,
        flex: 10
    }, {
        xtype: 'button',
        itemId: 'remove_button',
        flex: 1,
        margin: 10,
        glyph: 'xf056',
        tooltip: 'Remove',
        tooltipType: 'title',
        disabled: true,
        hidden: true,
        listeners: {
            click: {
                fn: 'onRemoveGeoPoint'
            }
        }
    }],
});

Ext.define('EcoAlpsWater.view.main.NewStationWindow', {
    extend: 'Ext.window.Window',
    xtype: 'new_station_window',

    requires: [
        'Ext.window.Window',
        'Ext.form.Panel'
    ],

    controller: 'stations',
    bodyPadding: 10,
    title: 'New station',
    closable: true,
    autoShow: true,
    modal: true,
    width: 800,
    height: 800,
    layout: 'card',

    items: [
        {
            id: 'new_station',
            itemId: 'new_station',
            xtype: 'form',
            frame: false,
            bodyPadding: 0,
            scrollable:true,
            border: false,

            fieldDefaults: {
                labelAlign: 'right',
                labelWidth: 180,
                msgTarget: 'side'
            },

            items: [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    margin: '0 0 5 0',
                    items: [
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Water body',
                            name: 'water_body',
                            itemId: 'water_body',
                            valueField: 'id',
                            displayField: 'name',
                            editable: false,
                            queryMode: 'local',
                            emptyText: 'Select a water body type...',
                            allowBlank: false,
                            flex: 15,
                            margin: '0 5 0 0',
                            store: Ext.data.Store(),
                            listeners: {
                                change: {
                                    fn: 'onComboValueChange',
                                    extraArgs: ['water_body', 'water_body_name', true]
                                }
                            }
                        }
                    ]
                },{
                    xtype: 'container',
                    layout: 'hbox',
                    margin: '0 0 5 0',
                    items: [
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Water body name',
                            name: 'water_body_name',
                            itemId: 'water_body_name',
                            valueField: 'id',
                            displayField: 'name',
                            editable: false,
                            queryMode: 'local',
                            emptyText: 'Select a name...',
                            allowBlank: false,
                            flex: 15,
                            margin: '0 5 0 0',
                            store: Ext.data.Store(),
                            listeners: {
                                change: {
                                    fn: 'onComboValueChange',
                                    extraArgs: ['water_body_name', 'station', true]
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    margin: '0 0 5 0',
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Station name',
                            name: 'station',
                            itemId: 'station',
                            allowBlank: false,
                            flex: 15,
                            margin: '0 5 0 0'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    margin: '0 0 5 0',
                    items: [
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Station type',
                            name: 'station_type',
                            itemId: 'station_type',
                            valueField: 'id',
                            displayField: 'name',
                            editable: false,
                            queryMode: 'local',
                            emptyText: 'Select a station type...',
                            allowBlank: false,
                            flex: 15,
                            margin: '0 5 0 0',
                            store: {
                                autoLoad: true,
                                fields: ['id', 'name'],
                                data: [{
                                    'id': 'discrete',
                                    'name': 'Discrete geographic point'
                                }, {
                                    'id': 'multiple',
                                    'name': 'Multiple geographic points'
                                }]
                            },
                            listeners: {
                                change: {
                                    fn: 'onStationTypeValueChange',
                                }
                            }
                        }
                    ]
                }, {
                    xtype: 'fieldset',
                    itemId: 'geo_points',
                    title: 'Geographic points',
                    defaultType: 'textfield',
                    defaults: {
                        anchor: '100%'
                    },

                    items: [
                        {
                            xtype: 'single_geo_point',
                        }
                    ]
            }
            ],
            bbar: [{
                xtype: 'button',
                itemId: 'add_geo_point',
                glyph: 'f041',
                text: 'Add geographic point',
                hidden: true,
                listeners: {
                    click: {
                        fn: 'onAddGeographicPoint'
                    }
                }
            }, '->', {
                xtype: 'button',
                glyph: 'f0c7',
                itemId: 'save_station',
                text: 'Save station',
                formBind: true,
                listeners: {
                    click: {
                        fn: 'onSaveStation'
                    }
                }
            }, {
                xtype: 'button',
                glyph: 'f057',
                itemId: 'close_window',
                text: 'Close',
                formBind: false,
                hidden: true,
                listeners: {
                    click: {
                        fn: 'onCloseWinStation'
                    }
                }
            }
            ],
        }
    ],

    listeners: {
        //afterrender: 'onSampleDetailWindowAfterRender'
    },

    initComponent: function() {
        this.callParent();
        this.controller.getComboBoxValues()
        console.log(this.id);
        var stationType = this.down('#station_type');
        stationType.setValue(stationType.store.data.items[0])
    }
});

var eawStationsGridStore = new Ext.data.JsonStore({
    autoLoad: false,
    pageSize: 2,
    remoteSort: true,
    proxy: {
        type: 'ajax',
        timeout: 120000,
        url: '/get_stations/',
        reader: {
            type: 'json',
            rootProperty: 'rows',
            totalProperty: 'total'
        },
        actionMethods: {
            read: 'POST'
        }
    },
    fields: ['id', 'name']
});

Ext.define('EcoAlpsWater.LiveFilter', {
    extend: 'Ext.form.field.Text',
    xtype: 'eaw_livefilter',
    requires: [
        'Ext.form.field.Text'
    ],
    
    controller: 'stations',

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

Ext.define('EcoAlpsWater.view.main.Stations', {
    extend: 'Ext.grid.Panel',
    xtype: 'stations',

    requires: [],

    title: 'Stations',

    controller: 'stations',

    store: eawStationsGridStore,

    dockedItems: [{
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
            disabled: true,
            listeners: {
                click: {
                    fn: 'onViewStationsDetails'
                }
            }
        }, {
            text: 'New station',
            itemId: 'new_station',
            name: 'new_station',
            glyph: 'f0fe',
            listeners: {
                click: {
                    fn: 'onNewStation'
                }
            }
        }]},{
            xtype: 'eaw_paging',
            store: eawStationsGridStore,
            dock: 'bottom',
            displayInfo: true
        }],

    selModel: {
        checkOnly: true,
        allowDeselect: true
    },

    columns: [{
        text: 'Station ID',
        name: 'id',
        itemId: 'id',
        dataIndex: 'id',
        flex: 1,
        hidden:false,
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
        text: 'Station type',
        name: 'station_type',
        itemId: 'station_type',
        dataIndex: 'station_type',
        flex: 2
    }, {
        text: 'Station name',
        name: 'name',
        itemId: 'name',
        dataIndex: 'name',
        flex: 2
    }, {
        text: 'Latitude',
        name: 'latitude',
        itemId: 'latitude',
        dataIndex: 'latitude',
        flex: 2
    }, {
        text: 'Longitude',
        name: 'Longitude',
        itemId: 'longitude',
        dataIndex: 'longitude',
        flex: 2
    }
    ],
    
    listeners: {
        afterrender: 'onStationsGridAfterRender',
        select: 'onItemSelect',
        deselect: 'onItemDeselect'
    }
});