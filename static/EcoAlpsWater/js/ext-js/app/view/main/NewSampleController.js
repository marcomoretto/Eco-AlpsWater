Ext.define('EcoAlpsWater.view.main.NewSampleController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.new_sample',

    onFieldChange: function() {
        this.updateIDs();
    },

    updateIDs: function() {
        var me = this.getView();
        var cardNum = me.items.items.length - 1;
        var values = {};
        for (i = 0; i <= cardNum; i++) {
            form = me.down('new_sample_step_' + i.toString()).getForm();
            for (var attrname in form.getValues()) {
                values[attrname] = form.getValues()[attrname];
            }
        }
        var sample_id = me.down('#sample_id');
        var sample_code = me.down('#sample_code');
        var water_body_code = me.down('#water_body_code');
        var cap_code = me.down('#cap_code');
        Ext.Ajax.request({
            url: 'update_ids/',
            params: values,
            success: function (response) {
                var resData = Ext.decode(response.responseText);
                sample_id.setValue(resData['ids']['sample_id']);
                sample_code.setValue(resData['ids']['sample_code']);
                water_body_code.setValue(resData['ids']['water_body_code']);
                cap_code.setValue(resData['ids']['cap_code']);
            },
            failure: function (response) {
                console.log('Server error', reponse);
            }
        });

    },

    onSaveSample: function() {
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
        console.log(values);
        Ext.Ajax.request({
            url: 'save_sample/',
            params: values,
            success: function (response) {
                if (EcoAlpsWater.current.checkHttpResponse(response)) {
                    var resData = Ext.decode(response.responseText);
                    EcoAlpsWater.current.showMessage('info', 'Save new sample', 'Sample successfully saved!');
                }
            },
            failure: function (response) {
                console.log('Server error', reponse);
            }
        });
    },

    onComboValueChange: function(me, id, c, d, e, f) {
        var other = d['extraArgs'][1];
        var this_panel = d['extraArgs'][0];
        var store = me.up('panel').down('#' + other).getStore();
        me.up('panel').down('#' + other).clearValue();
        store.removeAll();
        me.store.data.items.forEach(function(i) {
            if (i.id == id) {
                i.data[other].forEach(function(i) {
                    store.insert(0, i);
                });
            }
        });
        if (d['extraArgs'][2]) {
            this.updateIDs();
        }
    },

    getComboBoxValues: function() {
        var me = this;
        Ext.Ajax.request({
            url: 'get_combo_field_values/',
            success: function (response) {
                var resData = Ext.decode(response.responseText);
                for (var property in resData.values) {
                    if (resData.values.hasOwnProperty(property)) {
                        var store = me.getView().down('#' + property).getStore()
                        resData.values[property].forEach(function(i) {
                            store.insert(0, i);
                        });
                    }
                }
            },
            failure: function (response) {
                console.log('Server error', reponse);
            }
        });

    },

    getFieldDescriptions: function() {
        var me = this;
        Ext.Ajax.request({
            url: 'get_field_descriptions/',
            success: function (response) {
                var resData = Ext.decode(response.responseText);
                resData.descriptions.forEach(function (i) {
                    var target = me.getView().down('[itemId="' + i['field_name'] + '"]');
                    if (target) {
                        var tip = Ext.create('Ext.tip.ToolTip', {
                            target: target.getEl(),
                            html: i['description']
                        });
                    }
                });
            },
            failure: function (response) {
                console.log('Server error', reponse);
            }
        });
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
        var i = l.activeItem.id.split('card-')[1];
        var next = parseInt(i, 10) + incr;
        l.setActiveItem(next);
        this.updateNavigationButtons(next);
        window.location.hash = '#view/new_sample/' + next.toString();
    },

    activateCard: function (index) {
        var me = this.getView();

        var l = me.getLayout();
        l.setActiveItem(index);
        this.updateNavigationButtons(index);
    },

    updateNavigationButtons: function(index) {
        var me = this.getView();

        var cardNum = me.items.items.length - 1;

        var end = index >= cardNum;
        me.down('#card-prev').setDisabled(index <= 0);
        me.down('#card-next').setDisabled(end);
        me.down('#card-next').setHidden(end);
        me.down('#save_sample').setDisabled(!end);
        me.down('#save_sample').setHidden(!end);

        if (end) {
            var valid = true;
            for (i = 0; i <= cardNum; i++) {
                form = me.down('new_sample_step_' + i.toString()).getForm();
                valid = valid & form.isValid();
            }
            me.down('#save_sample').setDisabled(!valid);
        }
    },

    saveSample: function (me) {
        Ext.MessageBox.show({
            title: 'Save new sample',
            msg: "Once saved, you will not be able to further modify sample data. Do you want to continue and save the sample information into the database?",
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.INFO,
            fn: function (b) {
                if (b == 'yes') {
                    me.up('new_sample').controller.onSaveSample();
                }
            }
        });
    },

    onCloneFromAnotherSample: function(me) {
        Ext.create({
            xtype: 'clone_sample'
        });
    },

    onCloneSample: function(me) {
        var win = me.up('window');
        var combo = win.down('combobox');
        var record = combo.getSelectedRecord().data;
        console.log(record);
        var viewport = Ext.ComponentQuery.query('viewport')[0];
        var main = viewport.down('#main');
        var cardNum = main.down('new_sample').items.items.length - 1;
        var c = main.down('new_sample').controller;
        var _old_function = c.updateIDs;
        c.updateIDs = function() {  }
        for (i = 0; i <= cardNum; i++) {
            panel = main.down('new_sample_step_' + i.toString());
            console.log(panel.id);
            form = panel.getForm();
            form.setValues(record);
        }
        c.updateIDs = _old_function;
        win.close();
    },

    onAddComment: function(me) {
        var field = me.up('container').down('field');
        var fieldLabel = field.fieldLabel;
        Ext.MessageBox.show({
            title: 'Comment',
            msg: 'Add a comment for the field ' + fieldLabel,
            width:300,
            buttons: Ext.MessageBox.OKCANCEL,
            multiline: true,
            fn: function (value, text) {
                field.comment = text;
            }
        });
    }
});