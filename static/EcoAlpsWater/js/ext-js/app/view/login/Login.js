Ext.define('EcoAlpsWater.view.login.Login', {
    extend: 'Ext.window.Window',
    xtype: 'login',

    requires: [
        'Ext.window.Window',
        'EcoAlpsWater.view.login.LoginController',
        'Ext.form.Panel'
    ],

    controller: 'login',
    title: 'Eco-AlpsWater - Login',
    closable: false,
    autoShow: true,
    modal: true,
    height: 500,
    width: 600,

    items: [{
        xtype: 'panel',
        border: false,
        height: 290,
        margin: '0 0 10 0',
        bodyStyle:{
            "background":"url('/static/EcoAlpsWater/images/logo-simple.jpg') no-repeat",
            "background-size":"contain",
            "opacity": "0.8"
        }
    },{
        xtype: 'form',
        reference: 'form',
        buttonAlign:'left',
        margin: '0 10 10 10',
        items: [{
            xtype: 'textfield',
            name: 'username',
            fieldLabel: 'Username',
            anchor: '100%',
            allowBlank: false,
            listeners: {
                specialkey: 'submitOnEnter'
            }
        }, {
            xtype: 'textfield',
            name: 'password',
            inputType: 'password',
            fieldLabel: 'Password',
            anchor: '100%',
            allowBlank: false,
            listeners: {
                specialkey: 'submitOnEnter'
            }
        }],
        buttons: [{
            text: 'Visit EAW project page',
            itemId: 'eaw_project_page',
            formBind: false,
            listeners: {
                click: 'onEAWPageClick'
            }
        }, '->', {
            text: 'Login',
            itemId: 'login',
            formBind: true,
            listeners: {
                click: 'onLoginClick'
            }
        }]
    }],

    initComponent: function() {

        this.callParent();
    }
});