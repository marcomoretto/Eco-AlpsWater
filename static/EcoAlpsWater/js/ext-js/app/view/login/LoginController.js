Ext.define('EcoAlpsWater.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    submitOnEnter(field, event) {
        if (event.getKey() == event.ENTER) {
            var view = this.getView();
            var form = view.down('form').getForm()
            if (form.isValid()) {
                view.getController().onLoginClick();
            }
        }
    },

    onLoginClick: function() {
        var view = this.getView();
        var login_params = view.down('[xtype="form"]').getValues();

        Ext.Ajax.request({
            url: '/check_login/',
            params: login_params,
            success: function (response) {
                var resData = Ext.decode(response.responseText);
                if (resData.login) {
                    window.location.reload();
                } else {
                    Ext.Msg.alert('Login', 'Incorrect login');
                }
            },
            failure: function (response) {
                Ext.Msg.alert('Server problem', 'Server Problem');
            }
        });
    }
});
