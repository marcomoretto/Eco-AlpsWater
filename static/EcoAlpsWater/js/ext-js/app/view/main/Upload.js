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
    height: 400,
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