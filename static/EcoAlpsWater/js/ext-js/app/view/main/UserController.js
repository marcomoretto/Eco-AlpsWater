Ext.define('EcoAlpsWater.view.main.ChangePasswordController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.change_password',

    onChangePassword: function() {
        Ext.create({
            xtype: 'change_password'
        });
    },

    onSubmitChangePassword: function() {
        console.log('change pwd!');
    }
});