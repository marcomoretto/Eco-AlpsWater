var eawSequenceFileUploadGridStore = new Ext.data.JsonStore({
    autoLoad: false,
    pageSize: 5,
    remoteSort: true,
    proxy: {
        type: 'ajax',
        timeout: 120000,
        url: '/get_sample_sequence_file/',
        reader: {
            type: 'json',
            rootProperty: 'rows',
            totalProperty: 'total'
        },
        actionMethods: {
            read: 'POST'
        }
    },
    fields: ['id', 'original_filename', 'upload_date']
});

Ext.define('EcoAlpsWater.view.main.SequenceFile', {
    extend: 'Ext.grid.Panel',
    xtype: 'sequence_files',

    requires: [],

    title: false,

    controller: 'upload',

    store: eawSequenceFileUploadGridStore,

    dockedItems: [{
            xtype: 'eaw_station_paging',
            store: eawSequenceFileUploadGridStore,
            dock: 'bottom',
            displayInfo: true
        }],

    columns: [{
        text: 'ID',
        name: 'id',
        itemId: 'id',
        dataIndex: 'id',
        flex: 1,
        hidden:true,
    }, {
        text: 'Uploaded file name',
        name: 'original_filename',
        itemId: 'original_filename',
        dataIndex: 'original_filename',
        align:'center',
        flex: 5
    }, {
        text: 'Upload date',
        name: 'upload_date',
        itemId: 'upload_date',
        dataIndex: 'upload_date',
        flex: 2
    }],

    listeners: {
        afterrender: 'onSequenceFileUploadAfterRender',
    }
});

Ext.define('EcoAlpsWater.view.main.Upload', {
    extend: 'Ext.window.Window',
    requires: [
        'Ext.window.Window',
        'Ext.form.Panel'
    ],
    xtype: 'upload',
    title: 'Upload sequences',

    closable: true,
    autoShow: true,
    modal: true,
    width: 600,
    height: 600,
    layout: 'fit',
    controller: 'upload',

    bodyPadding: 10,

    items: [{
        xtype: 'form',
        flex: 15,
        margin: '0 5 0 0',
        bodyStyle: {
            "background-color": "transparent"
        },
        items: [{
            xtype: 'combobox',
            fieldLabel: 'Biological element',
            name: 'biological_element',
            itemId: 'biological_element',
            valueField: 'id',
            displayField: 'name',
            anchor: '100%',
            labelWidth: 180,
            editable: false,
            queryMode: 'local',
            emptyText: 'Select a biological element...',
            allowBlank: false,
            store: Ext.data.Store(),
            listeners: {
                change: {
                    fn: 'onBioElementFieldChange'
                }
            }
        }, {
            xtype: 'combobox',
            fieldLabel: 'eDNA marker',
            name: 'edna_marker',
            itemId: 'edna_marker',
            valueField: 'id',
            displayField: 'name',
            anchor: '100%',
            labelWidth: 180,
            editable: false,
            readOnly: true,
            queryMode: 'local',
            emptyText: 'eDNA marker depends on Biological element field',
            allowBlank: true,
            store: Ext.data.Store()
        },{
            xtype: 'filefield',
            fieldLabel: 'MD5 checksum file',
            labelWidth: 180,
            name: 'md5_checksum_file',
            itemId: 'md5_checksum_file',
            buttonText: 'Browse',
            anchor: '100%',
            allowBlank: false,
            clearOnSubmit: false,
            reference: 'md5_checksum_file',
            listeners: {
                //change: 'onProfileTemplateChange'
            }
        }, {
            xtype: 'filefield',
            fieldLabel: 'FASTQ Sequence file',
            labelWidth: 180,
            name: 'sequence_file',
            itemId: 'sequence_file',
            buttonText: 'Browse',
            anchor: '100%',
            allowBlank: false,
            clearOnSubmit: false,
            reference: 'sequence_file',
            listeners: {
                //change: 'onProfileTemplateChange'
            }
        }, {
            xtype: 'progressbar',
            text:'Initializing...',
            name: 'upload_progress',
            itemId: 'upload_progress',
            hidden: true
        }, {
            xtype: 'container',
            height: 50,
        },{
            xtype: 'sequence_files'
        }],
        buttons: [{
            text: 'Upload',
            formBind: true,
            handler: 'onUploadSequenceFile'
        }]
    }],

    listeners: {
        afterrender: 'onUploadAfterRender'
    },

    initComponent: function () {
        this.callParent();
        this.controller.getComboBoxValues();
    }

});