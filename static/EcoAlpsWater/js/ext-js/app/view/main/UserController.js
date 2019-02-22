Ext.define('EcoAlpsWater.view.main.ChangePasswordController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.change_password',

    onChangePassword: function() {
        Ext.create({
            xtype: 'change_password'
        });
    },

    onSubmitChangePassword: function() {
        var view = this.getView();
        var params = view.down('[xtype="form"]').getValues();
        Ext.Ajax.request({
            url: 'change_password/',
            params: params,
            success: function (response) {
                if (EcoAlpsWater.current.checkHttpResponse(response)) {
                    var resData = Ext.decode(response.responseText);
                    EcoAlpsWater.current.showMessage('info', 'Password changed', 'Password changed successfully!')
                    view.close();
                }
            },
            failure: function (response) {
                Ext.Msg.alert('Server problem', 'Server Problem');
            }
        });
    },

    onUserAfterRender: function(me) {
        var username = me.down('#user_name');
        var institute = me.down('#institute');
        var e_mail = me.down('#e_mail');
        Ext.Ajax.request({
            url: 'get_user_info/',
            success: function (response) {
                var resData = Ext.decode(response.responseText);
                username.setValue(resData.user_info.user_name);
                institute.setValue(resData.user_info.institute);
                e_mail.setValue(resData.user_info.e_mail);
            },
            failure: function (response) {
                Ext.Msg.alert('Server problem', 'Server Problem');
            }
        });
    }
});