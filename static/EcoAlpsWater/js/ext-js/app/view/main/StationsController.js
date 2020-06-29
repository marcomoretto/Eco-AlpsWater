Ext.define('EcoAlpsWater.view.main.StationsController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.stations',

    onLatLongChange: function(oldVal, newVal) {
        var me = this;
        var suggested_name_win = undefined;
        var check = me.getView().down('#suggested_names').getValue();
        var lat = me.getView().down('#latitude').getValue();
        var lon = me.getView().down('#longitude').getValue();
        if (check && lat && lon && lat.toString().length > 4 && lon.toString().length > 4) {
            Ext.Ajax.request({
                url: 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&zoom=18&addressdetails=1',
                method: 'GET',
                success: function (response) {
                    var resData = Ext.decode(response.responseText);
                    if (suggested_name_win) {
                        suggested_name_win.close();
                    }
                    suggested_name_win = Ext.create({
                        xtype: 'suggested_names_window',
                    });
                    var obj = resData.address;
                    var tot = 0;
                    Object.keys(obj).forEach(function(key,index) {
                        var f = Ext.create({
                            xtype: 'textfield',
                            fieldLabel: key,
                            name: 'field_value' + key,
                            itemId: 'field_value' + key,
                            value: obj[key],
                            anchor: '100%',
                            margin: '5 5 5 5',
                            editable: false,
                        });
                        tot += 1;
                        suggested_name_win.down('#fields').add(f);
                    });
                    suggested_name_win.setHeight(65 + (tot * 40));
                },
                failure: function (response) {
                    console.log('Server error', response);
                }
            });
        }
    },

    onStationLiveFilterChange: function(me, text, old, event) {
        if (text.length < 3) {
            me.up('stations').getStore().proxy.extraParams.filter = '';
            me.up('stations').getStore().reload();
        } else {
            me.up('stations').getStore().proxy.extraParams.filter = text;
            me.up('stations').getStore().reload();
        }
    },

    onStationsGridAfterRender: function(me) {
        me.getStore().reload({
            params: {
                data: 'ciao'
            }
        });
    },

    onItemSelect: function (me, selected, eOpts) {
        var grid = me.view.up('stations');
        var selection = grid.getSelection().length == 0;
        grid.down('#view_details').setDisabled(selection);
    },

    onItemDeselect: function (me, selected, eOpts) {
        var grid = me.view.up('stations');
        var selection = grid.getSelection().length == 0;
        grid.down('#view_details').setDisabled(selection);
    },

    onViewStationsDetails: function (me) {
        var grid = me.up('stations');
        var selection = grid.getSelection()[0];
        var win = Ext.create({
            xtype: 'new_station_window',
            listeners: {
                afterrender: function(me) {
                    var wb = me.down('#water_body');
                    var wbn = me.down('#water_body_name');
                    var st = me.down('#station');
                    var stty = me.down('#station_type');
                    var latitude = me.down('#latitude');
                    var longitude = me.down('#longitude');
                    var lats = selection.data.latitude.split(':');
                    var long = selection.data.longitude.split(':');
                    me.setTitle('View station ' + selection.data.name);
                    wb.setReadOnly(true);
                    wbn.setReadOnly(true);
                    st.setReadOnly(true);
                    stty.setReadOnly(true);
                    latitude.setReadOnly(true);
                    longitude.setReadOnly(true);
                    wb.setRawValue(selection.data.water_body);
                    wbn.setRawValue(selection.data.water_body_name);
                    st.setRawValue(selection.data.name);
                    stty.setRawValue(selection.data.station_type);
                    lats.forEach(function (e, i) {
                        if (i == 0) {
                            latitude.setRawValue(e);
                            longitude.setRawValue(long[i]);
                        } else {
                            var panel = me.down('#geo_points');
                            var point = Ext.create({xtype: "single_geo_point"});
                            panel.add(point);
                            point.down('#latitude').setReadOnly(true);
                            point.down('#longitude').setReadOnly(true);
                            point.down('#latitude').setRawValue(e);
                            point.down('#longitude').setRawValue(long[i]);
                        }
                    });
                    me.down('#save_station').setHidden(true);
                    me.down('#close_window').setHidden(false);
                }
            },
        });
    },

    onCloseWinStation: function(me) {
        var win = me.up('new_station_window');
        win.close();
    },

    onSaveStation: function(me) {
        var values = me.up('form').getForm().getValues();
        var win = me.up('new_station_window');
        var viewport = Ext.ComponentQuery.query('viewport')[0];
        var main = viewport.down('stations');
        Ext.MessageBox.show({
            title: 'Save new station',
            msg: "Once saved, you will not be able to further modify the station data. Do you want to continue and save the station information into the database?",
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.INFO,
            fn: function (b) {
                if (b == 'yes') {
                    Ext.Ajax.request({
                        url: '/save_station/',
                        params: {'values': JSON.stringify(values)},
                        success: function (response) {
                            if (EcoAlpsWater.current.checkHttpResponse(response)) {
                                var resData = Ext.decode(response.responseText);
                                main.getStore().reload();
                                win.close();
                            }
                        },
                        failure: function (response) {
                            console.log('Server error', response);
                        }
                    });
                }
            }
        });
    },

    onNewStation: function(me) {
        Ext.create({
            xtype: 'new_station_window'
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
                        console.log(property);
                        var view = me.getView().down('#' + property);
                        if (view) {
                            var store = view.getStore()
                            resData.values[property].forEach(function (i) {
                                store.insert(0, i);
                            });
                        }
                    }
                }
            },
            failure: function (response) {
                console.log('Server error', response);
            }
        });

    },

    onComboValueChange: function(me, id, c, d, e, f) {
        var other = d['extraArgs'][1];
        var this_panel = d['extraArgs'][0];
        var view = me.up('panel').down('#' + other);
        var store = view.store;
        if (store) {
            me.up('panel').down('#' + other).clearValue();
            store.removeAll();
            me.store.data.items.forEach(function (i) {
                if (i.id == id) {
                    i.data[other].forEach(function (i) {
                        store.insert(0, i);
                    });
                }
            });
        }
    },

    onAddGeographicPoint: function (me) {
        var panel = me.up('panel').down('#geo_points');
        var point = Ext.create({xtype: "single_geo_point"});
        panel.add(point);
        var button = point.down('#remove_button');
        button.setVisible(true);
        button.setDisabled(false);
    },

    onRemoveGeoPoint: function (me) {
        var panel = me.up('fieldset');
        if (panel.items.items.length > 1) {
            var field_id = me.up('container').id;
            panel.items.items.forEach(
                function (e, i) {
                    if (e.id == field_id) {
                        panel.remove(e);
                    }
                });
        }
    },

    onStationTypeValueChange: function (me, a, b, c) {
        var button = me.up('new_station_window').down('#add_geo_point');
        var panel = me.up('new_station_window').down('fieldset');
        if (a == 'multiple') {
            button.setVisible(true);
        } else {
            button.setVisible(false);
            var toRemove = [];
            panel.items.items.forEach(
                function (e, i) {
                    if (i > 0) {
                        toRemove.push(e);
                    }
                });
            toRemove.forEach(function (e) {
                panel.remove(e);
            });

        }
    }
});