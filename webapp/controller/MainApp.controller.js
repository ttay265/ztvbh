sap.ui.define([
    "ZTVBH/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "ZTVBH/model/formatter",
    "sap/m/BusyDialog",
    "sap/m/Dialog",
    "sap/m/MessageBox"
], function (BaseController, MessageToast, JSONModel, Filter, formatter, BusyDialog, Dialog, MessageBox) {
    "use strict";

    return BaseController.extend("ZTVBH.controller.MainApp", {
        formatter: formatter,
        onInit: function () {
            var that = this;
            this.busyDialog = new BusyDialog();
            this.submitAddress = [];
            this.City = "";
            this.District = "";
            this.Ward = "";
            this.inpSearch = this.byId("inpSearch");
            this.sideNavigation = this.byId("sideNavigation");
            this.page = this.byId("_pageCustomer");
            this.headerTitle = this.byId("_titleMain");
            this.headerIcon = this.byId("_iconMain");
            this.logon = this.checkLogin();
            var text = "";
            var title = "";
            var cancel = "";
            //Change password dialog initialization
            if (!this.changePassDialog) {
                this.changePassDialog = sap.ui.xmlfragment(this.getView().getId(), "ZTVBH.fragment.ChangePassDialog", this);
                this.getView().addDependent(this.changePassDialog);
                this.txtOldPass = this.byId("_txtOldPass");
                this.txtNewPass = this.byId("_txtNewPass");
                this.txtConfirmNewPass = this.byId("_txtConfirmNewPass");
            }
            // Change address dialog initialization
            if (!this.AboutDialog) {
                var lblDialogTitle = this.getResourceBundle().getText("TT_ABOUT_APP");
                var lblDialogText = this.getResourceBundle().getText("version");
                this.AboutDialog = new Dialog({
                    title: lblDialogTitle,
                    state: "None",
                    type: sap.m.DialogType.Message,
                    content: [
                        new sap.m.Text({
                            text: lblDialogText
                        })
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: "Ok",
                            press: function() {
                                that.AboutDialog.close();
                            }
                        })
                    ]
                });
                this._selectCity = this.byId("_selectCity");
                this._selectDistrict = this.byId("_selectDistrict");
                this._selectWard = this.byId("_selectWard");
            }
            //Attachment matched
            this.getRouter().getRoute("home").attachPatternMatched(this._onObjectMatched, this);
        },


        // onDialogClosed: function (oEvent) {
        //     var busy
        //     // jQuery.sap.clearDelayedCall(_timeout);
        //
        //     // if (oEvent.getParameter("cancelPressed")) {
        //     //     MessageToast.show("The operation has been cancelled");
        //     // } else {
        //     //     MessageToast.show("The operation has been completed");
        //     // }
        // },
        _onObjectMatched: function () {
            if (!this.checkLogin()) {
                this.getRouter().navTo("login", true);
            } else {
                this.Pernr = this.getGlobalModel().getProperty("/user");
                var status = this.getGlobalModel().getProperty("/status");
                if (status === "N") {
                    this.forceChangePass();
                }
            }
        },
        forceChangePass: function () {
            this.changePasswordPress();
        },
        changePasswordPress: function () {
            this.changePassDialog.open();
        },
        onAfterRendering: function () {
            if (!this.changePassDialog) {
                this.changePassDialog = sap.ui.xmlfragment(this.getView().getId(), "ZTVBH.fragment.ChangePassDialog", this);
                this.getView().addDependent(this.changePassDialog);
                this.txtOldPass = this.byId("_txtOldPass");
                this.txtNewPass = this.byId("_txtNewPass");
                this.txtConfirmNewPass = this.byId("_txtConfirmNewPass");
            }
            //dialog initialization
            // if (!this.AddressDialog) {
            //     this.AddressDialog = sap.ui.xmlfragment(this.getView().getId(), "ZTVBH.fragment.Address", this);
            //     this.getView().addDependent(this.AddressDialog);
            // }
        },
        doNav: function (view, source) {
            this.getRouter().navTo(view, true);
            this.page.setSideExpanded(false);
            var icon = source.getIcon();

            var text = source.getText();
            this.getGlobalModel().setProperty("/appTitle", text);
            this.getGlobalModel().setProperty("/appTitleIcon", icon);
            this.headerTitle.getText(text);
        },
        navToHome: function (oEvent) {
            var source = oEvent.getSource();
            this.doNav("home", source);
        },
        onUpdateAppPressed: function () {
            var fileTransfer;
            var titleUpdateApp = this.getResourceBundle().getText("LBL_UPDATE_APP");
            var msgDownloading = this.getResourceBundle().getText("MSG_DOWNLOAD_APP");
            var cancel = true;
            this.openBusyDialog({
                title: titleUpdateApp,
                text: msgDownloading,
                showCancelButton: cancel
            });
            function onDeviceReady() {
                fileTransfer = new FileTransfer();
            }

            var that = this;
            document.addEventListener("deviceready", onDeviceReady, false);
            fileTransfer.download(encodeURI("http://appmobile.dienmaythienhoa.vn:1090/ContentServer/ContentServer.dll?get&pVersion=0046&contRep=W1&docId=123123&compId=android-debug.apk"),
                "cdvfile://localhost/temporary/th-salesman.apk",
                function (entry) {
                    window.plugins.webintent.startActivity({
                            action: window.plugins.webintent.ACTION_VIEW,
                            url: entry.toNativeURL(),
                            type: 'application/vnd.android.package-archive'
                        },
                        function () {
                            that.closeBusyDialog();
                        },
                        function () {
                            alert('Failed to open URL via Android Intent.');
                            console.log("Failed to open URL via Android Intent. URL: " + entry.fullPath);
                        });
                }, function (error) {
                    console.log("download error source " + error.source);
                    console.log("download error target " + error.target);
                    console.log("upload error code" + error.code);
                }, true);
        },
        navCustomer: function (oEvent) {
            var source = oEvent.getSource();
            this.doNav("cusList", source);
        },
        navSaleIncomeMaster: function (oEvent) {
            var source = oEvent.getSource();
            this.doNav("saleIncomeMaster", source);
        },
        navSaleOrder: function (oEvent) {
            var source = oEvent.getSource();
            this.doNav("OrderList", source);
        },
        navToCreateCustomer: function (oEvent) {
            var source = oEvent.getSource();
            this.doNav("createCustomer", source);
        },
        __cancel: function () {
            var status = this.getGlobalModel().getProperty("/status");
            if (status === "N") {
                this.logout();
            }
            this.changePassDialog.close();
        },
        navToArtTypeItems: function (oEvent) {
            var articleType = oEvent.getSource().getBindingContext().getProperty("Mtart");
            this.page.setSideExpanded(false);
            this.getRouter().navTo("proList", {Mtart: articleType}, false);
        },
        __submitChangePassword: function () {
            var msg = "";
            // validate oldPas
            var oldPass = this.txtOldPass.getValue();
            var logonPass = this.getGlobalModel().getProperty("/token");
            if (oldPass !== logonPass) {
                msg = this.getResourceBundle().getText("msgOldPassValidateFailed");
                MessageToast.show(msg);
            } else {
                if (this.txtNewPass.getValue() !== this.txtConfirmNewPass.getValue() ||
                    this.txtNewPass.getValue() === "" ||
                    this.txtConfirmNewPass.getValue() === "") {
                    msg = this.getResourceBundle().getText("msgNewPassValidateFailed");
                    MessageToast.show(msg);
                } else {
                    this.doChangePass();
                }
            }
        },
        onAboutPressed: function () {
            this.AboutDialog.open();
        },

        doChangePass: function () {
            var that = this;
            var onSuccess = function (data) {
                    if (data.returnValue === "X") {
                        var msg = that.getResourceBundle().getText("msgChangePassSuccess");
                        that.getGlobalModel().setProperty("/status", 'A', null, true);
                        MessageToast.show(msg);
                        that.changePassDialog.close();
                    } else {
                        var msg = that.getResourceBundle().getText("msgChangePassFailed");
                        MessageToast.show(msg);
                    }
                },
                onError = function (error) {
                    var msg = that.getResourceBundle().getText("msgChangePassFailed");
                    MessageToast.show(msg);
                };
            var parameters = {
                Pernr: this.Pernr,
                oldPassword: this.txtOldPass.getValue(),
                newPassword: this.txtNewPass.getValue()
            };
            this.getModel().callFunction("/ChangePassword", {
                method: "POST",
                urlParameters: parameters,
                success: onSuccess,
                error: onError
            });
        },

        showMenu: function () {
            var expanded = this.page.getSideExpanded();
            this.page.setSideExpanded(!expanded);
        },
        doLogout: function () {
            this.getGlobalModel().setProperty("/user", "", null, true);
            this.getGlobalModel().setProperty("/name", "", null, true);
            this.getGlobalModel().setProperty("/token", "none", null, true);
            this.getGlobalModel().setProperty("/status", "", null, true);
            this.resetModelData();
            this.getRouter().navTo("login", true);
            this.page.setSideExpanded(false);
            var localStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
            localStorage.remove("loginInfo");
            var msg = this.getResourceBundle().getText("msgLogout");
            MessageToast.show(msg);
        },
        __toViewCart: function () {
            this.getRouter().navTo("cart", false);
        },
        //On selected value from suggested list
        onSearch: function (oEvent) {
            var item = oEvent.getParameter("suggestionItem");
            if (item) {
                var Matnr = oEvent.getParameter("suggestionItem").getKey();
                if (Matnr) {
                    this.getRouter().navTo("productDetail", {"Matnr": Matnr}, false);
                }
            }
            // this.openBusyDialog({
            //     title: "Loading...",
            //     showCancelButton: true
            // });
        },
        onSuggest: function (oEvent) {
            var value = oEvent.getParameter("suggestValue");
            var filters = [];
            var maktgFilter = new Filter({
                path: "Maktg",
                operator: sap.ui.model.FilterOperator.StartsWith,
                value1: value
            });
            filters.push(maktgFilter);
            this.inpSearch.getBinding("suggestionItems").attachDataReceived(this.inpSearch.suggest(), this);
            this.inpSearch.getBinding("suggestionItems").filter(filters);
        },
        /**
         *@memberOf ZTVBH.controller.Menu
         */
        logout: function (oEvent) {
            var that = this;
            var title = this.getResourceBundle().getText("MsgConfirmTitle");
            var msg = this.getResourceBundle().getText("msgConfirmLogout");
            var doIt = function (mAction) {
                if (mAction === MessageBox.Action.OK) {
                    that.doLogout();
                } else {
                    return;
                }
            };
            MessageBox.confirm(msg, {
                icon: sap.m.MessageBox.Icon.INFORMATION,
                title: title,
                onClose: doIt
            });
        }
    });
});