Ext.define('EcoAlpsWater.view.main.SamplesController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.samples',

    onProfileTemplateChange: function(me) {
        var viewport = Ext.ComponentQuery.query('viewport')[0];
        viewport.down('new_sample').controller.onProfileTemplateChange(me);
    },

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
            url: '/get_env_metadata/',
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
            url: '/get_barcode/',
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

    onDownloadSequence: function(me) {
        var samples = {
            'samples': []
        };
        me.up('samples').getSelection().forEach(function(e) {
            samples['samples'].push(e.id);
        });
        samples['samples'] = JSON.stringify(samples.samples),
        Ext.Ajax.request({
            binary: true,
            url: '/get_sequence/',
            params: samples,
            success: function (response) {
                var resData = Ext.decode(response.responseText);
                EcoAlpsWater.current.showMessage('info', 'Sequence file ready', 'An e-mail with instructions has been sent to your e-mail account!');
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

    updateSample: function(me) {
        var win = me.up('window');
        var me = this.getView();
        var cardNum = me.items.items.length - 1;
        var values = {};
        for (i = 0; i <= cardNum; i++) {
            panel = me.down('new_sample_step_' + i.toString());
            form = panel.getForm();
            for (var attrname in form.getValues()) {
                values[attrname] = form.getValues()[attrname];
                values[attrname + '_comment'] = panel.down('#' + attrname)['comment'];
            }
        }
        values['id'] = me.sample_id;
        Ext.Ajax.request({
            url: '/update_sample/',
            params: values,
            success: function (response) {
                if (EcoAlpsWater.current.checkHttpResponse(response)) {
                    var resData = Ext.decode(response.responseText);
                    EcoAlpsWater.current.showMessage('info', 'Update sample', 'Sample successfully updated!');
                    win.close();
                }
            },
            failure: function (response) {
                console.log('Server error', reponse);
            }
        });
    },

    editMode: function(me) {
        var panel = me.up('panel');
        Ext.MessageBox.show({
            title: 'With great power comes great responsibility',
            msg: 'Are you sure you want to activate the Edit Mode? This will allow you to change some values of an already imported samples and might be potentially harmful. Do you want to continue?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function (a) {
                if (a == 'yes') {
                    panel.down('#card-update').setHidden(false);
                    panel.down('#laboratory_ph').setReadOnly(false);
                    panel.down('#laboratory_conductivity').setReadOnly(false);
                    panel.down('#total_alkalinity').setReadOnly(false);
                    panel.down('#bicarbonates').setReadOnly(false);
                    panel.down('#nitrate_nitrogen').setReadOnly(false);
                    panel.down('#sulphates').setReadOnly(false);
                    panel.down('#chloride').setReadOnly(false);
                    panel.down('#calcium').setReadOnly(false);
                    panel.down('#magnesium').setReadOnly(false);
                    panel.down('#sodium').setReadOnly(false);
                    panel.down('#potassium').setReadOnly(false);
                    panel.down('#ammonium').setReadOnly(false);
                    panel.down('#total_nitrogen').setReadOnly(false);
                    panel.down('#soluble_reactive_phosphorus').setReadOnly(false);
                    panel.down('#total_phosphorus').setReadOnly(false);
                    panel.down('#reactive_silica').setReadOnly(false);
                    panel.down('#dry_weight').setReadOnly(false);
                    panel.down('#chlorophyll_a').setReadOnly(false);
                    panel.down('#dna_extraction_kit').setReadOnly(false);
                    panel.down('#dna_extraction_date').setReadOnly(false);
                    panel.down('#dna_quantity').setReadOnly(false);
                    panel.down('#dna_quality_a260_280').setReadOnly(false);
                    panel.down('#dna_quality_a260_230').setReadOnly(false);
                    panel.down('#archives_fieldset').setHidden(false);
                }
            }
        });
    },

    getComboBoxValues: function() {
        var me = this;
        Ext.Ajax.request({
            url: '/get_combo_field_values/',
            success: function (response) {
                var resData = Ext.decode(response.responseText);
                for (var property in resData.values) {
                    if (resData.values.hasOwnProperty(property)) {
                        var view = me.getView().down('#' + property);
                        if (view && view.store) {
                            var store = view.getStore()
                            resData.values[property].forEach(function (i) {
                                store.insert(0, i);
                            });
                        }
                    }
                }
            },
            failure: function (response) {
                console.log('Server error', reponse);
            }
        });

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
        me.sample_id = grid.getSelection()[0].id;
        Ext.Ajax.request({
            url: '/get_samples_complete/',
            params: params,
            success: function (response) {
                var resData = Ext.decode(response.responseText);
                var obj = resData.rows[0];
                var fields = me.query('textfield');
                Ext.Array.each(fields, function(field) {
                    field.setEmptyText('');
                });
                me.down('#archives_fieldset').setHidden(true);
                for (var property in obj) {
                    if (obj.hasOwnProperty(property)) {
                        var field = me.down('#' + property);
                        if (field) {
                            field.setReadOnly(true);
                            field.allowBlank = true;
                            field.suspendEvents();
                            if (property == 'dna_extraction_kit') {
                                field.setValue(obj[property]);
                            } else {
                                field.setRawValue(obj[property]);
                            }
                            if (property == 'sampling_volume' && obj[property]) {
                                field.setDisabled(false);
                            }
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
        var station = main.down('#station');
        station.getStore().on('load', function() {
            Ext.Ajax.request({
                url: '/get_samples_complete/',
                params: params,
                success: function (response) {
                    var resData = Ext.decode(response.responseText);
                    main.down('#sampling_matrix').suspendEvents();
                    EcoAlpsWater.current.showPanel('new_sample');
                    var _old_function = c.updateIDs;
                    c.updateIDs = function() {  }
                    for (i = 0; i <= cardNum; i++) {
                        panel = main.down('new_sample_step_' + i.toString());
                        form = panel.getForm();
                        form.setValues(resData.rows[0]);
                    }
                    c.updateIDs = _old_function;
                    main.down('#sampling_matrix').resumeEvents();
                    var sampling_volume = main.down('#sampling_volume');
                    if (sampling_volume.getValue()) {
                        sampling_volume.setDisabled(false);
                    }
                    var newSamplePanel = viewport.down('new_sample').controller.__cloneSampleWarning();
                    main.down('#archives_fieldset').setDisabled(false);
                    station.getStore().clearListeners();
                },
                failure: function (response) {
                    console.log('Server error', reponse);
                }
            });
        });
        station.getStore().reload();
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