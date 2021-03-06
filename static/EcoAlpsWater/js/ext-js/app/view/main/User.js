Ext.define('EcoAlpsWater.view.main.ChangePassword', {
    extend: 'Ext.window.Window',
    xtype: 'change_password',

    requires: [
        'Ext.window.Window',
        'Ext.form.Panel',
        'EcoAlpsWater.view.main.ChangePasswordController'
    ],

    controller: 'change_password',
    bodyPadding: 10,
    title: 'Change password',
    closable: true,
    autoShow: true,
    modal: true,

    items: {
        xtype: 'form',
        reference: 'form',
        items: [{
            xtype: 'textfield',
            name: 'old_password',
            itemId: 'old_password',
            inputType: 'password',
            fieldLabel: 'Old password',
            allowBlank: false
        }, {
            xtype: 'textfield',
            name: 'new_password',
            itemId: 'new_password',
            inputType: 'password',
            fieldLabel: 'New password',
            allowBlank: false
        }],
        buttons: [{
            text: 'Submit',
            formBind: true,
            listeners: {
                click: 'onSubmitChangePassword'
            }
        }]
    },

    initComponent: function() {

        this.callParent();
    }
});

Ext.define('EcoAlpsWater.view.main.User', {
    extend: 'Ext.panel.Panel',
    requires: [

    ],
    xtype: 'user',
    title: 'User',

    bodyPadding: 15,

    defaults: {
        anchor: '100%'
    },

    layout: 'anchor',
    controller: 'change_password',

    items: [{
        xtype: 'textfield',
        allowBlank: false,
        fieldLabel: 'User name',
        name: 'user_name',
        itemId: 'user_name',
        emptyText: 'Name',
        readOnly: true
    }, {
        xtype: 'textfield',
        allowBlank: false,
        fieldLabel: 'Institute',
        name: 'institute',
        itemId: 'institute',
        emptyText: 'Institute',
        readOnly: true
    }, {
        xtype: 'textfield',
        allowBlank: false,
        fieldLabel: 'E-mail',
        name: 'e_mail',
        itemId: 'e_mail',
        emptyText: 'E-mail',
        readOnly: true
    }],

    bbar: ['->', {
        xtype: 'button',
        text: 'Send verification e-mail',
        itemId: 'send_email',
        name: 'send_email',
        listeners: {
            click: 'onSendEmail'
        }
    }, {
        xtype: 'button',
        text: 'Change password',
        itemId: 'change_pwd',
        name: 'change_pwd',
        listeners: {
            click: 'onChangePassword'
        },
    }],

    listeners: {
        afterrender: 'onUserAfterRender'
    },

    initComponent: function () {
        this.callParent();
    }

});