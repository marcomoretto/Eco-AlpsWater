/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('EcoAlpsWater.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    onDocumentation: function(me) {
        window.open('https://docs.google.com/document/d/1Qk-eReszlOpV-fSZDHhr8lwdoazp1CLSDtWM7WEbjjU')
    },

    onLogout: function(me) {
        Ext.Ajax.request({
            url: '/logout/',
            success: function (response) {
                window.location.reload();
            },
            failure: function (response) {
                console.log('Server error', response);
            }
        });
    },

    beforeActivate: function(me) {
        var panel = me.down('[xtype="' + me.itemId + '"]');
        if (panel.xtype == 'samples') {
            var grid = panel.getStore().reload();
        }
        if (!panel.useHash) {
            window.location.hash = '#view/' + panel.xtype + '/0';
        }
        panel.useHash = false;
    }
});
