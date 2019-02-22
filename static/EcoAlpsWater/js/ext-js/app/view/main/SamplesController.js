Ext.define('EcoAlpsWater.view.main.SamplesController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.samples',

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
    }

});