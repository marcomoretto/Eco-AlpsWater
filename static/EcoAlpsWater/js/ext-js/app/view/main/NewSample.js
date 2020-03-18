Ext.setGlyphFontFamily('FontAwesome');

Ext.define('EcoAlpsWater.view.main.CloneSampleWindow', {
    extend: 'Ext.window.Window',
    xtype: 'clone_sample',

    requires: [
        'Ext.window.Window',
        'Ext.form.Panel'
    ],

    controller: 'new_sample',
    bodyPadding: 10,
    title: 'Clone sample',
    closable: true,
    autoShow: true,
    modal: true,
    width: 500,
    layout: 'fit',

    items: {
        xtype: 'form',
        layout: 'fit',
        bodyPadding: 10,
        reference: 'form',
        items: [{
            xtype: 'combobox',
            name: 'samples',
            itemId: 'samples',
            fieldLabel: 'Sample',
            allowBlank: false,
            queryMode: 'local',
            valueField: 'id',
            displayField: 'sample_code',
            store: {
                autoLoad: true,
                fields: ['id', 'sample_code'],
                proxy: {
                    type: 'ajax',
                    url: '/get_samples_complete/',
                    reader: {
                        type: 'json',
                        rootProperty: 'rows'
                    }
                }
            }
        }],
        buttons: [{
            text: 'Clone',
            formBind: true,
            listeners: {
                click: 'onCloneSample'
            }
        }]
    },

    initComponent: function() {

        this.callParent();
    }
});

Ext.define('EcoAlpsWater.view.main.NewSampleStep0', {
    extend: 'Ext.form.Panel',
    xtype: 'new_sample_step_0',

    frame: false,
    bodyPadding: 0,
    scrollable:true,
    border: false,

    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 180,
        msgTarget: 'side'
    },

    items: [{
        xtype: 'fieldset',
        title: 'General data',
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },

        items: [
            { allowBlank:true, fieldLabel: 'Sample ID', name: 'sample_id', itemId: 'sample_id', emptyText: 'Automatically generated', readOnly: true},
            { allowBlank:true, fieldLabel: 'Sample code', name: 'sample_code', itemId: 'sample_code', emptyText: 'Automatically generated', readOnly: true },
            //{ allowBlank:true, fieldLabel: 'Water body code', name: 'water_body_code', itemId: 'water_body_code', emptyText: 'Automatically generated', readOnly: true },
            //{ allowBlank:true, fieldLabel: 'Security cap code', name: 'cap_code', itemId: 'cap_code', emptyText: 'Automatically generated', readOnly: true },
            {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                hidden: true,
                items: [
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Biological element',
                        name: 'biological_element',
                        itemId: 'biological_element',
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        queryMode: 'local',
                        emptyText: 'Select a biological element...',
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0',
                        store: Ext.data.Store(),
                        listeners: {
                            change: {
                                fn: 'onBioElementFieldChange'
                            }
                        }
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Sampling matrix',
                        name: 'sampling_matrix',
                        itemId: 'sampling_matrix',
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        queryMode: 'local',
                        emptyText: 'Select a sampling matrix...',
                        allowBlank: false,
                        flex: 15,
                        margin: '0 5 0 0',
                        store: Ext.data.Store(),
                        listeners: {
                            change: {
                                fn: 'onSamplingMatrixFieldChange'
                            }
                        }
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Sampling strategy',
                        name: 'sampling_strategy',
                        itemId: 'sampling_strategy',
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        queryMode: 'local',
                        emptyText: 'Select a sampling strategy...',
                        allowBlank: false,
                        flex: 15,
                        margin: '0 5 0 0',
                        store: Ext.data.Store(),
                        listeners: {
                            change: {
                                fn: 'onFieldChange',
                            }
                        }
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Station name',
                        name: 'station',
                        itemId: 'station',
                        valueField: 'id',
                        displayField: 'full_name',
                        editable: false,
                        queryMode: 'local',
                        emptyText: 'Select a station...',
                        allowBlank: false,
                        flex: 15,
                        margin: '0 5 0 0',
                        listeners: {
                            focus: {
                                fn: 'onComboStationFocus',
                            },
                            change: {
                                fn: 'onFieldChange',
                            }
                        },
                        store: {
                            autoLoad: false,
                            fields: ['id', 'full_name'],
                            proxy: {
                                type: 'ajax',
                                url: '/get_stations/',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'rows'
                                }
                            }
                            }
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
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
                        xtype: 'numberfield',
                        fieldLabel: 'Sampling depth range (min)',
                        minValue: 0,
                        name: 'sampling_depth_min',
                        itemId: 'sampling_depth_min',
                        decimalPrecision: 5,
                        allowBlank: false,
                        flex: 8,
                        margin: '0 5 0 0',
                        listeners: {
                            change: {
                                fn: 'onFieldChange',
                                }
                            }
                        }, {
                        xtype: 'numberfield',
                        fieldLabel: '(max)',
                        labelWidth: 80,
                        minValue: 0,
                        name: 'sampling_depth_max',
                        itemId: 'sampling_depth_max',
                        decimalPrecision: 5,
                        allowBlank: false,
                        flex: 7,
                        margin: '0 5 0 0',
                        listeners: {
                            change: {
                                fn: 'onFieldChange',
                            }
                        }
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Sampling volume',
                        name: 'sampling_volume',
                        itemId: 'sampling_volume',
                        minValue: 0,
                        disabled: true,
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0',
                        listeners: {
                            change: {
                                fn: 'onFieldChange',
                            }
                        }
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
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
                        xtype: 'combobox',
                        fieldLabel: 'Depth type',
                        name: 'depth_type',
                        itemId: 'depth_type',
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        queryMode: 'local',
                        emptyText: 'Select a depth type...',
                        allowBlank: false,
                        flex: 15,
                        margin: '0 5 0 0',
                        store: Ext.data.Store(),
                        listeners: {
                            change: {
                                fn: 'onFieldChange',
                            }
                        }
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                hidden: true,
                items: [
                    {
                        xtype: 'combobox',
                        fieldLabel: 'eDNA marker',
                        name: 'edna_marker',
                        itemId: 'edna_marker',
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        readOnly: true,
                        queryMode: 'local',
                        emptyText: 'eDNA marker depends on Biological element field',
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0',
                        store: Ext.data.Store()
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
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
                        xtype: 'datefield',
                        fieldLabel: 'Sampling date',
                        name: 'sampling_date',
                        itemId: 'sampling_date',
                        editable: false,
                        allowBlank: false,
                        flex: 15,
                        margin: '0 5 0 0',
                        listeners: {
                            change: {
                                fn: 'onFieldChange',
                            }
                        }
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Mean river outflow discharge',
                        name: 'mean_river_outflow',
                        itemId: 'mean_river_outflow',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
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
                        xtype: 'combobox',
                        fieldLabel: 'Mixing type',
                        name: 'mixing_type',
                        itemId: 'mixing_type',
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        queryMode: 'local',
                        emptyText: 'Select a mixing type...',
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0',
                        store: Ext.data.Store()
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
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
                        xtype: 'numberfield',
                        fieldLabel: 'Catchment area',
                        name: 'catchment_area',
                        itemId: 'catchment_area',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }
        ]
    }]
});

Ext.define('EcoAlpsWater.view.main.NewSampleStep1', {
    extend: 'Ext.form.Panel',
    xtype: 'new_sample_step_1',

    frame: false,
    bodyPadding: 0,
    scrollable:true,
    border: false,

    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 180,
        msgTarget: 'side'
    },

    items: [{
        xtype: 'fieldset',
        title: 'Field data',
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },

        items: [
            {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Temperature',
                        name: 'temperature',
                        itemId: 'temperature',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Field pH',
                        name: 'field_ph',
                        itemId: 'field_ph',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
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
                        xtype: 'numberfield',
                        fieldLabel: 'Field conductivity',
                        name: 'field_conductivity',
                        itemId: 'field_conductivity',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Light attenuation coefficient',
                        name: 'light_attenuation_coefficient',
                        itemId: 'light_attenuation_coefficient',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Secchi disk depth',
                        name: 'secchi_disk_depth',
                        itemId: 'secchi_disk_depth',
                        decimalPrecision: 5,
                        allowBlank: true,
                        minValue: 0,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
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
                        xtype: 'numberfield',
                        fieldLabel: 'Euphotic layer',
                        name: 'euphotic_layer',
                        itemId: 'euphotic_layer',
                        decimalPrecision: 5,
                        allowBlank: true,
                        minValue: 0,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Oxygen concentration',
                        name: 'oxygen_concentration',
                        itemId: 'oxygen_concentration',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Oxygen percentage',
                        name: 'oxygen_percentage',
                        itemId: 'oxygen_percentage',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }
        ]
    }],
    initComponent: function() {
        this.callParent();
    },
});

Ext.define('EcoAlpsWater.view.main.NewSampleStep2', {
    extend: 'Ext.form.Panel',
    xtype: 'new_sample_step_2',

    frame: false,
    bodyPadding: 0,
    scrollable:true,
    border: false,

    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 180,
        msgTarget: 'side'
    },

    items: [{
        xtype: 'fieldset',
        title: 'Laboratory data',
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },

        items: [
            {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Laboratory pH',
                        name: 'laboratory_ph',
                        itemId: 'laboratory_ph',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Laboratory conductivity',
                        name: 'laboratory_conductivity',
                        itemId: 'laboratory_conductivity',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Total alkalinity',
                        name: 'total_alkalinity',
                        itemId: 'total_alkalinity',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Bicarbonates',
                        name: 'bicarbonates',
                        itemId: 'bicarbonates',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Nitrate nitrogen (NO3-N)',
                        name: 'nitrate_nitrogen',
                        itemId: 'nitrate_nitrogen',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
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
                        xtype: 'numberfield',
                        fieldLabel: 'Sulphates',
                        name: 'sulphates',
                        itemId: 'sulphates',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Chloride',
                        name: 'chloride',
                        itemId: 'chloride',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Calcium',
                        name: 'calcium',
                        itemId: 'calcium',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Magnesium',
                        name: 'magnesium',
                        itemId: 'magnesium',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Sodium',
                        name: 'sodium',
                        itemId: 'sodium',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Potassium',
                        name: 'potassium',
                        itemId: 'potassium',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Ammonium nitrogen (NH4-N)',
                        name: 'ammonium',
                        itemId: 'ammonium',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Total nitrogen',
                        name: 'total_nitrogen',
                        itemId: 'total_nitrogen',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Soluble reactive Phosphorus',
                        name: 'soluble_reactive_phosphorus',
                        itemId: 'soluble_reactive_phosphorus',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Total phosphorus',
                        name: 'total_phosphorus',
                        itemId: 'total_phosphorus',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }
            ]
    }],
    initComponent: function() {
        this.callParent();
    },
});

Ext.define('EcoAlpsWater.view.main.NewSampleStep3', {
    extend: 'Ext.form.Panel',
    xtype: 'new_sample_step_3',

    frame: false,
    bodyPadding: 0,
    scrollable:true,
    border: false,

    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 180,
        msgTarget: 'side'
    },

    items: [{
        xtype: 'fieldset',
        title: 'Laboratory data',
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },

        items: [
            /*{
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Total phosphorus',
                        name: 'total_phosphorus',
                        itemId: 'total_phosphorus',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            },*/ {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Reactive silica',
                        name: 'reactive_silica',
                        itemId: 'reactive_silica',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Dry weight at 105°C',
                        name: 'dry_weight',
                        itemId: 'dry_weight',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Chlorophyll-a',
                        name: 'chlorophyll_a',
                        itemId: 'chlorophyll_a',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'combobox',
                        fieldLabel: 'DNA extraction kit',
                        name: 'dna_extraction_kit',
                        itemId: 'dna_extraction_kit',
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        queryMode: 'local',
                        emptyText: 'Select a DNA extraction kit...',
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0',
                        store: Ext.data.Store()
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        fieldLabel: 'DNA extraction date',
                        xtype: 'datefield',
                        name: 'dna_extraction_date',
                        itemId: 'dna_extraction_date',
                        allowBlank: true,
                        editable: false,
                        flex: 15,
                        margin: '0 5 0 0',
                        listeners: {
                            change: {
                                //fn: 'onFieldChange',
                            }
                        }
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'DNA quantity',
                        name: 'dna_quantity',
                        itemId: 'dna_quantity',
                        decimalPrecision: 5,
                        allowBlank: true,
                        minValue: 0,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'combobox',
                        fieldLabel: 'DNA quantification method',
                        name: 'dna_quantification_method',
                        itemId: 'dna_quantification_method',
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        queryMode: 'local',
                        emptyText: 'Select a dna quantification method...',
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0',
                        store: Ext.data.Store(),
                        listeners: {
                            /*change: {
                                fn: 'onBioElementFieldChange'
                            }*/
                        }
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'DNA quality (A260/280)',
                        name: 'dna_quality_a260_280',
                        itemId: 'dna_quality_a260_280',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'DNA quality (A260/230)',
                        name: 'dna_quality_a260_230',
                        itemId: 'dna_quality_a260_230',
                        decimalPrecision: 5,
                        allowBlank: true,
                        flex: 15,
                        margin: '0 5 0 0'
                        },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            },]
    }, {
        xtype: 'fieldset',
        title: 'Linked to archives',
        defaultType: 'textfield',
        itemId: 'archives_fieldset',
        defaults: {
            anchor: '100%'
        },

        items: [
            {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'form',
                        flex: 15,
                        margin: '0 5 0 0',
                        bodyStyle: {
                            "background-color": "transparent"
                        },
                        items: [{
                            xtype: 'filefield',
                            fieldLabel: 'Vertical temperature profiles',
                            name: 'vertical_temperature_profiles',
                            itemId: 'vertical_temperature_profiles',
                            buttonText: 'Upload',
                            anchor: '100%',
                            allowBlank: true,
                            clearOnSubmit: false,
                            reference: 'vertical_temperature_profiles',
                            listeners: {
                                change: 'onProfileTemplateChange'
                            }
                        }]
                    },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'f019',
                        tooltip: 'Download template',
                        margin: '0 5 0 0',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onDownloadTemplate',
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'form',
                        flex: 15,
                        margin: '0 5 0 0',
                        bodyStyle: {
                            "background-color": "transparent"
                        },
                        items: [{
                            xtype: 'filefield',
                            fieldLabel: 'Phytoplankton countings',
                            name: 'phytoplankton_countings',
                            itemId: 'phytoplankton_countings',
                            buttonText: 'Upload',
                            anchor: '100%',
                            allowBlank: true,
                            clearOnSubmit: false,
                            reference: 'phytoplankton_countings',
                            listeners: {
                                change: 'onProfileTemplateChange'
                            }
                        }]
                    },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'f019',
                        tooltip: 'Download template',
                        margin: '0 5 0 0',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onDownloadTemplate',
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                items: [
                    {
                        xtype: 'form',
                        flex: 15,
                        margin: '0 5 0 0',
                        bodyStyle: {
                            "background-color": "transparent"
                        },
                        items: [{
                            xtype: 'filefield',
                            fieldLabel: 'Cyanotoxin samples',
                            name: 'cyanotoxin_samples',
                            itemId: 'cyanotoxin_samples',
                            buttonText: 'Upload',
                            anchor: '100%',
                            allowBlank: true,
                            clearOnSubmit: false,
                            reference: 'cyanotoxin_samples',
                            listeners: {
                                change: 'onProfileTemplateChange'
                            }
                        }]
                    },
                    {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'f019',
                        tooltip: 'Download template',
                        margin: '0 5 0 0',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onDownloadTemplate',
                            }
                        }
                    }, {
                        xtype: 'button',
                        flex: 1,
                        glyph: 'xf27a',
                        tooltip: 'Add comment',
                        tooltipType: 'title',
                        listeners: {
                            click: {
                                fn: 'onAddComment',
                            }
                        }
                    }
                ]
            }]
    }],

    initComponent: function() {
        this.callParent();
    },
});

Ext.define('EcoAlpsWater.view.main.NewSample', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.layout.container.Card',
        'EcoAlpsWater.view.main.NewSampleController'
    ],
    xtype: 'new_sample',
    layout: 'card',
    title: 'New sample',

    controller: 'new_sample',
    
    bodyPadding: 10,
    
    bbar: [
        {
            text: 'Import sample',
            itemId: 'import_sample_menu_item',
            iconCls: null,
            glyph: 'xf103',
            menu: {
                xtype: 'menu',
                plain: true,
                items: [{
                    itemId: 'import_from_file',
                    text: 'From file',
                    glyph: 'xf15b',
                    disabled: true,
                    iconCls: null,
                    listeners: {
                        click: {
                            //fn: 'onAction'
                        }
                    }
                }, {
                    itemId: 'clone_from_another_sample',
                    text: 'Clone from another sample',
                    glyph: 'xf24d',
                    iconCls: null,
                    listeners: {
                        click: {
                            fn: 'onCloneFromAnotherSample',
                        }
                    }
                }]
            }
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
        },
        {
            itemId: 'save_sample',
            text: 'Save sample',
            handler: 'saveSample',
            disabled: true,
            hidden: true
        }
    ],

    items: [
        {
            id: 'card-0',
            xtype: 'new_sample_step_0'
        },
        {
            id: 'card-1',
            xtype: 'new_sample_step_1'
        },
        {
            id: 'card-2',
            xtype: 'new_sample_step_2'
        },
        {
            id: 'card-3',
            xtype: 'new_sample_step_3'
        }
    ],

    showNext: function () {
        this.doCardNavigation(1);
    },

    showPrevious: function (btn) {
        this.doCardNavigation(-1);
    },

    doCardNavigation: function (incr) {
        var me = this;
        var l = me.getLayout();
        var i = l.activeItem.id.split('card-')[1];
        var next = parseInt(i, 10) + incr;
        l.setActiveItem(next);
        this.updateNavigationButtons(next);
        window.location.hash = '#view/new_sample/' + next.toString();
    },

    activateCard: function (index) {
        var me = this;
        var l = me.getLayout();
        l.setActiveItem(index);
        this.updateNavigationButtons(index);
    },

    updateNavigationButtons: function(index) {
        var me = this;

        var cardNum = this.items.items.length - 1;

        me.down('#card-prev').setDisabled(index <= 0);
        me.down('#card-next').setDisabled(index >= cardNum);
    },

    initComponent: function () {
        this.callParent();
        this.controller.getFieldDescriptions();
        this.controller.getComboBoxValues();
    }

});