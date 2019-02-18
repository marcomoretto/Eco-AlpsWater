Ext.define('EcoAlpsWater.view.main.NewSampleController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.new_sample',

    getFieldDescriptions: function() {
        var me = this;
        Ext.Ajax.request({
            url: 'get_field_descriptions/',
            success: function (response) {
                var resData = Ext.decode(response.responseText);
                resData.descriptions.forEach(function (i) {
                    var target = me.getView().down('[itemId="' + i['item_id'] + '"]');
                    var tip = Ext.create('Ext.tip.ToolTip', {
                        target: target.getEl(),
                        html: i['description']
                    });
                });
            },
            failure: function (response) {
                console.log('Server error', reponse);
            }
        });
    }
});