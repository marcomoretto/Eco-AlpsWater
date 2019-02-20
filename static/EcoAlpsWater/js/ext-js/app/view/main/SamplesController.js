Ext.define('EcoAlpsWater.view.main.SamplesController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.samples',

    onAdvancedSearchCollapse: function(me) {
        me.up('#samples').down('eaw_livefilter').setDisabled(false);
    },
    
    onAdvancedSearchExpand: function(me) {
        me.up('#samples').down('eaw_livefilter').setDisabled(true)
    }

});