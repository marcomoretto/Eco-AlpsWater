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
    },

    saveSample: function (me) {
        Ext.MessageBox.show({
            title: 'Save new sample',
            msg: "Once saved, you will not be able to further modify sample data. Do you want to continue and save the sample information into the database?",
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.INFO,
            fn: function () {
            }
        });
    }
});