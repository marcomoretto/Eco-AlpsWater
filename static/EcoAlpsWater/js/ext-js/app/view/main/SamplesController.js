Ext.define('EcoAlpsWater.view.main.SamplesController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.samples',

    onSamplesGridAfterRender: function(me) {
        me.getStore().reload();
    },

    onAdvancedSearchCollapse: function(me) {
        me.up('#samples').down('eaw_livefilter').setDisabled(false);
    },
    
    onAdvancedSearchExpand: function(me) {
        me.up('#samples').down('eaw_livefilter').setDisabled(true)
    },

    onAddAdvancedSearchField: function (me) {
        var panel = me.up('fieldset');
        var index = panel.items.items.length - 1;
        panel.insert(index, {
            xtype: 'eaw_advanced_search_field'
        });
    },

    onRemoveAdvancedSearchField: function (me) {
        var panel = me.up('fieldset');
        if (panel.items.items.length > 2) {
            var field_id = me.up('container').id;
            panel.items.items.forEach(
                function (e, i) {
                    if (e.id == field_id) {
                        panel.remove(e);
                    }
                });
        }
    },

    onChangeSearchField: function(me, newValue, oldValue, eOpts) {
        var eaw = me.up('eaw_advanced_search_field');
        var text_field = eaw.down('[xtype="textfield"]');
        var date_field = eaw.down('[xtype="datefield"]');
        if (newValue.endsWith('_date')) {
            text_field.setVisible(false);
            date_field.setVisible(true);
            date_field.itemId = 'field_value';
            text_field.itemId = 'field_value_date';
        } else {
            text_field.setVisible(true);
            date_field.setVisible(false);
            date_field.itemId = 'field_value_date';
            text_field.itemId = 'field_value';
        }
    },

    onLiveFilterChange: function(me, text, old, event) {
        if (text.length < 3) {
            me.up('samples').getStore().proxy.extraParams.filter = '';
            me.up('samples').getStore().reload();
        } else {
            me.up('samples').getStore().proxy.extraParams.filter = text;
            me.up('samples').getStore().reload();
        }
    },

    onDownloadEnvMetaData: function(me) {
        var samples = {
            'samples': []
        };
        me.up('samples').getSelection().forEach(function(e) {
            samples['samples'].push(e.id);
        });
        samples['samples'] = JSON.stringify(samples.samples),
        Ext.Ajax.request({
            binary: true,
            url: 'get_env_metadata/',
            params: samples,
            success: function (response) {
                var blob = new Blob([response.responseBytes], {type: 'base64'}),
                url = window.URL.createObjectURL(blob),
                zip = document.createElement('a');
                zip.href = url;
                zip.download = 'environment_metadata.zip';
                document.body.appendChild(zip);
                zip.click();
                document.body.removeChild(zip);
            },
            failure: function (response) {
                console.log('Server error', reponse);
            }
        });
    },

    onDownloadBarcode: function(me) {
        var samples = {
            'samples': []
        };
        me.up('samples').getSelection().forEach(function(e) {
            samples['samples'].push(e.id);
        });
        samples['samples'] = JSON.stringify(samples.samples),
        Ext.Ajax.request({
            binary: true,
            url: 'get_barcode/',
            params: samples,
            success: function (response) {
                var blob = new Blob([response.responseBytes], {type: 'base64'}),
                url = window.URL.createObjectURL(blob),
                zip = document.createElement('a');
                zip.href = url;
                zip.download = 'barcode.zip';
                document.body.appendChild(zip);
                zip.click();
                document.body.removeChild(zip);
            },
            failure: function (response) {
                console.log('Server error', reponse);
            }
        });
    },

    onViewSampleDetails: function(me) {
        Ext.create({
            xtype: 'view_sample_details'
        });
    },

    onFieldChange: function(me) {

    },

    onAdvancedSearch: function(me) {
        var filters = {
            'advanced': []
        }
        var searchFields = me.up('samples').query('eaw_advanced_search_field');
        Ext.Array.each(searchFields, function(field) {
            var filter = {
                'field_name': field.down('#field_name').getValue(),
                'field_contains': field.down('#field_contains').getValue(),
                'field_value': field.down('#field_value').getValue(),
                'field_and_or': field.down('#field_and_or').getValue()
            };
            filters['advanced'].push(filter);
        });
        console.log(filters);
        me.up('samples').getStore().proxy.extraParams.filter = JSON.stringify(filters);
        me.up('samples').getStore().reload();
    },

    onSampleDetailWindowAfterRender: function(me) {
        var buttons = me.query('button');
        Ext.Array.each(buttons, function(button) {
            if (!(button.itemId && button.itemId.startsWith('card-'))) {
                button.setVisible(false);
            }
        });
        var viewport = Ext.ComponentQuery.query('viewport')[0];
        var main = viewport.down('#main');
        var grid = main.down('samples');
        var cardNum = me.items.items.length - 1;
        var params = {'id': grid.getSelection()[0].id, 'description': true};
        Ext.Ajax.request({
            url: 'get_samples_complete/',
            params: params,
            success: function (response) {
                var resData = Ext.decode(response.responseText);
                var obj = resData.rows[0];
                var fields = me.query('textfield');
                Ext.Array.each(fields, function(field) {
                    field.setEmptyText('');
                });
                for (var property in obj) {
                    if (obj.hasOwnProperty(property)) {
                        var field = me.down('#' + property);
                        if (field) {
                            field.setReadOnly(true);
                            field.allowBlank = true;
                            field.setRawValue(obj[property]);
                        }
                    }
                }
            },
            failure: function (response) {
                console.log('Server error', reponse);
            }
        });
    },

    onCloneSample: function(me) {
        var viewport = Ext.ComponentQuery.query('viewport')[0];
        var main = viewport.down('#main');
        var cardNum = main.down('new_sample').items.items.length - 1;
        var c = main.down('new_sample').controller;
        var grid = me.up('samples');
        var params = {'id': grid.getSelection()[0].id};
        Ext.Ajax.request({
            url: 'get_samples_complete/',
            params: params,
            success: function (response) {
                var resData = Ext.decode(response.responseText);
                EcoAlpsWater.current.showPanel('new_sample');
                var _old_function = c.updateIDs;
                c.updateIDs = function() {  }
                for (i = 0; i <= cardNum; i++) {
                    panel = main.down('new_sample_step_' + i.toString());
                    form = panel.getForm();
                    form.setValues(resData.rows[0]);
                }
                c.updateIDs = _old_function;
            },
            failure: function (response) {
                console.log('Server error', reponse);
            }
        });
    },

    onItemSelect: function (me, selected, eOpts) {
        var grid = me.view.up('samples');
        var selection = grid.getSelection().length == 0;
        var selection2 = grid.getSelection().length != 1;
        grid.down('#barcode').setDisabled(selection);
        grid.down('#env_meta_data').setDisabled(selection);
        grid.down('#sequence_file').setDisabled(selection);
        grid.down('#clone_sample').setDisabled(selection2);
        grid.down('#view_details').setDisabled(selection2);
    },

    onItemDeselect: function (me, selected, eOpts) {
        var grid = me.view.up('samples');
        var selection = grid.getSelection().length == 0;
        var selection2 = grid.getSelection().length != 1;
        grid.down('#barcode').setDisabled(selection);
        grid.down('#env_meta_data').setDisabled(selection);
        grid.down('#sequence_file').setDisabled(selection);
        grid.down('#clone_sample').setDisabled(selection2);
        grid.down('#view_details').setDisabled(selection2);
    },

    showNext: function () {
        this.doCardNavigation(1);
    },

    showPrevious: function (btn) {
        this.doCardNavigation(-1);
    },

    doCardNavigation: function (incr) {
        var me = this.getView();

        var l = me.getLayout();
        var i = l.activeItem.id.split('detail-card-')[1];
        var next = parseInt(i, 10) + incr;
        l.setActiveItem(next);
        this.updateNavigationButtons(next);
    },

    updateNavigationButtons: function(index) {
        var me = this.getView();

        var cardNum = me.items.items.length - 1;

        var end = index >= cardNum;
        me.down('#card-prev').setDisabled(index <= 0);
        me.down('#card-next').setDisabled(end);
    },

});