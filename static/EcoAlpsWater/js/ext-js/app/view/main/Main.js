/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.setGlyphFontFamily('FontAwesome');
Ext.define('EcoAlpsWater.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'EcoAlpsWater.view.main.MainController',
        'EcoAlpsWater.view.main.NewSample',
        'EcoAlpsWater.view.main.Samples'
    ],

    controller: 'main',
    viewModel: 'main',
    itemId: 'main',

    ui: 'navigation',

    //tabBarHeaderPosition: 1,
    tabPosition: 'left',
    titleRotation: 0,
    tabRotation: 0,

    header: {
        layout: {
            align: 'stretchmax'
        },
        title: {
            bind: {
                text: 'Eco-AlpsWater'
            },
            flex: 0
        },
        iconCls: 'fa-flask'
    },

    tabBar: {
        flex: 1,
        layout: {
            align: 'stretch',
            overflowHandler: 'none'
        },
        items: [{
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            html: 'User manual',
            glyph: 'f02d',
            listeners: {
                click: 'onDocumentation'
            }
        }, {
            xtype: 'container',
            height: 20
        }, {
            xtype: 'button',
            html: 'Logout',
            glyph: 'xf08b',
            listeners: {
                click: 'onLogout'
            }
        }, {
            xtype: 'container',
            height: 10
        }]
    },

    defaults: {
        bodyPadding: 20,
        tabConfig: {
            plugins: 'responsive',
            responsiveConfig: {
                wide: {
                    iconAlign: 'left',
                    textAlign: 'left'
                },
                tall: {
                    iconAlign: 'top',
                    textAlign: 'center',
                    width: 120
                }
            }
        }
    },

    items: [{
        title: 'Add new sample',
        itemId: 'new_sample',
        glyph: 'xf0fe',
        layout: 'fit',
        items: [{
            xtype: 'new_sample'
        }],
        listeners: {
            beforeActivate: 'beforeActivate'
        }
    }, {
        title: 'Show all samples',
        glyph: 'f03a',
        layout: 'fit',
        itemId: 'samples',
        items: [{
            xtype: 'samples'
        }],
        listeners: {
            beforeActivate: 'beforeActivate'
        }
    }, {
        title: 'Stations',
        glyph: 'f041',
        layout: 'fit',
        itemId: 'stations',
        items: [{
            xtype: 'stations'
        }],
        listeners: {
            beforeActivate: 'beforeActivate'
        }
    }, {
        title: 'User informations',
        itemId: 'user',
        glyph: 'xf007',
        layout: 'fit',
        items: [{
            xtype: 'user'
        }],
        listeners: {
            beforeActivate: 'beforeActivate'
        }
    }]
});
