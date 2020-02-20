Ext.define('EcoAlpsWater.view.main.UploadController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.upload',

    onUploadAfterRender: function() {
        var panel = this.getView();
        panel.setTitle('Upload sequences for sample ' + panel.sample.data.sample_code);
    },

    onBioElementFieldChange: function (me) {
        var edna = me.up('panel').down('#edna_marker');
        var r = me.getSelectedRecord().data.edna_marker;
        edna.setValue(r.id);
    },

    getComboBoxValues: function() {
        var me = this;
        Ext.Ajax.request({
            url: '/get_combo_field_values/',
            success: function (response) {
                var resData = Ext.decode(response.responseText);
                for (var property in resData.values) {
                    if (resData.values.hasOwnProperty(property)) {
                        var view = me.getView().down('#' + property);
                        if (view && view.store) {
                            var store = view.getStore()
                            resData.values[property].forEach(function (i) {
                                store.insert(0, i);
                            });
                        }
                    }
                }
            },
            failure: function (response) {
                console.log('Server error', reponse);
            }
        });

    },

    _pollUploadStatus: function(id, bar) {
        var me = this;
        var params= { 'X-Progress-ID': id};
        Ext.Ajax.request({
            url: '/progress?X-Progress-ID=' + id,
            success: function (response) {
                var resData = Ext.decode(response.responseText);
                console.log(resData);
                if (resData.state == 'done') {
                    me.stopPollingUploadStatus(me._pol);
                    bar.updateText('Done');
                }
                if (resData.state == 'uploading') {
                    bar.updateText('Uploading...');
                    var ratio = resData.received / resData.size;
                    bar.updateProgress(ratio);
                }
            },
            failure: function (response) {
                console.log('POLL FAILURE', response);
                //me.stopPollingUploadStatus(me._pol);
            }
        });
    },

    startPollingUploadStatus: function(f) {
        return window.setInterval(f, 2000);
    },

    stopPollingUploadStatus: function(f) {
        window.clearInterval(f)
    },

    onUploadSequenceFile: function(btn) {
        var me = this;
        var panel = this.getView();
        var sample_id = panel.sample.data.id;
        var uuid = "";
        for (i = 0; i < 32; i++) {
            uuid += Math.floor(Math.random() * 16).toString(16);
        }
        var form = btn.up('form').getForm();
        var params = form.getValues();
        params['sample_id'] = sample_id;
        if(form.isValid()) {
            form.submit({
                url: '/upload?X-Progress-ID=' + uuid,
                params: params,
                baseParams: params,
                success: function (fp, o) {
                    console.log('SUCCESS');
                    EcoAlpsWater.current.showMessage('info', 'Upload', 'Sequence file uploaded successfully!')
                },
                failure: function (fp, o) {
                    console.log('FAILURE');
                    console.log(fp, o);
                    EcoAlpsWater.current.showMessage('error', 'Upload', 'Error during sequence file upload!')
                    //EcoAlpsWater.current.checkHttpResponse(o.response);
                }
            });
        }
        var progressBar = btn.up('form').down('#upload_progress');
        progressBar.setHidden(false);
        progressBar.updateText('Initializing...');
        progressBar.updateProgress(0.0);
        this._pol = this.startPollingUploadStatus(function() { me._pollUploadStatus(uuid, progressBar) });
    }

});