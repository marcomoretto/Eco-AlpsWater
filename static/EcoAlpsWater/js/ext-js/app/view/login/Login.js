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
    height: 550,
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
        buttons: ['->', {
            text: 'Login',
            itemId: 'login',
            formBind: true,
            listeners: {
                click: 'onLoginClick'
            }
        }]
    }, {
        xtype: 'panel',
        border: false,
        height: 100,
        margin: '10 10 10 10',
        layout: 'hbox',
        align: 'top',
        items: [{
            xtype: 'image',
            src: '/static/EcoAlpsWater/images/logo-small-2.jpg',
            autoEl: {
                tag: 'a',
                href: 'https://www.alpine-space.eu/projects/eco-alpswater/'
            },
            margin: '10 10 10 10',
        }, {
            xtype: 'image',
            src: '/static/EcoAlpsWater/images/fb.jpg',
            autoEl: {
                tag: 'a',
                href: 'https://www.facebook.com/ecoalpswater/'
            },
            margin: '10 10 10 10',
        }, {
            xtype: 'image',
            src: '/static/EcoAlpsWater/images/tw.jpg',
            autoEl: {
                tag: 'a',
                href: 'https://twitter.com/EcoAlpsWater'
            },
            margin: '10 10 10 10',
        }, /*{
            xtype: 'image',
            src: '/static/EcoAlpsWater/images/in.jpg',
            autoEl: {
                tag: 'a',
                href: 'https://www.alpine-space.eu/projects/eco-alpswater/'
            }
        }, {
            xtype: 'image',
            cursor: 'pointer',
            src: '/static/EcoAlpsWater/images/yt.jpg',
            autoEl: {
                tag: 'a',
                href: 'https://www.alpine-space.eu/projects/eco-alpswater/'
            }
        }*/]
    }],

    initComponent: function() {

        this.callParent();
    }
});