/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('EcoAlpsWater.Application', {
    extend: 'Ext.app.Application',

    name: 'EcoAlpsWater',

    autoCreateViewport : false,

    defaultToken : 'view/new_sample/0',

    routes : {
        'view/:panel/:params': {
            before : 'checkLogin',
            action : 'showPanel'
        }
    },

    requires: [
        'Ext.Viewport',
        'EcoAlpsWater.view.login.Login'
    ],

    stores: [
        // TODO: add global / shared stores here
    ],

    appProperty: 'current',

    checkLogin: function(pn, ac, ar) {
        var action = ar;
        if (ar == undefined) {
            action = ac
        }
        if (ac == undefined) {
            action = pn
        }
        Ext.Ajax.request({
            url: '/check_login/',
            success: function (response) {
                var resData = Ext.decode(response.responseText);
                if (resData.login) {
                    var viewport = Ext.ComponentQuery.query('viewport')[0];
                    var main = viewport.down('#main');
                    if (main == undefined) {
                        main = Ext.create('EcoAlpsWater.view.main.Main');
                        viewport.add(main);
                    }
                    action.resume();
                } else {
                    Ext.create({
                        xtype: 'login'
                    });
                }
            },
            failure: function (response) {
                Ext.Msg.alert('Server problem', 'Server Problem');
            }
        });
    },

    showPanel: function(panel_id, param) {
        var viewport = Ext.ComponentQuery.query('viewport')[0];
        var main = viewport.down('#main');
        var panel = main.down(panel_id);
        if (panel_id == 'new_sample') {
            panel.useHash = true;
            panel.controller.activateCard(parseInt(param));
        }
        main.items.items.forEach(function(e, i) {
            if (panel_id == e.itemId) {
                main.setActiveItem(i);
            }
        });
    },

    showMessage: function(type, title, message) {
        switch (type) {
            case 'error':
                Ext.MessageBox.show({
                    title: title,
                    msg: message,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR,
                    fn: function () {
                    }
                });
                break;
            case 'info':
                Ext.MessageBox.show({
                    title: title,
                    msg: message,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO,
                    fn: function () {
                    }
                });
                break;
        }
    },

    checkHttpResponse: function (message) {
        var response = JSON.parse(message.responseText);
        if (!response.success) {
            this.showMessage(response.type, response.title, response.message);
            return false;
        }
        return true;
    },

    launch: function () {
        var viewPort = Ext.widget('viewport', {
            layout: 'fit'
        });
    }
});

