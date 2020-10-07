sap.ui.define([
    "ZTVBH/controller/BaseController",
    "sap/m/MessageToast"
], function (BaseController, MessageToast) {
    "use strict";
    return BaseController.extend("ZTVBH.controller.LoginView", {

        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf ZTVBH.view.LoginView
         */
        onInit: function () {
            this.mng_version = this.getResourceBundle().getText("mng_version");
            var text = this.getResourceBundle().getText("txtLoginWaitingText");
            var title = this.getResourceBundle().getText("txtLoginWaitingTitle");
            this.busyDialog = new sap.m.BusyDialog({
                text: text,
                title: title
            });
            this.getRouter().getRoute("login").attachPatternMatched(this.onAfterRendering, this);
            this.txtUsername = this.getView().byId("_txtUsername");
            this.txtPassword = this.getView().byId("_txtPassword");
            // this.getRememberedLogonInfo();
        },
        getRememberedLogonInfo: function () {
            jQuery.sap.require("jquery.sap.storage");
            this.localStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
            var data = this.localStorage.get("loginInfo");
            if (data) {
                this.login(data.user, data.token);
            }
        },

        verifyUser: function () {
            if (this.validateUsername() && this.validatePassword()) {
                var pernr = this.txtUsername.getValue();
                var password = this.txtPassword.getValue();
                this.login(pernr, password);
            } else {
                if (this.txtUsername.getValueState() === "Error") {
                    MessageToast.show(this.txtUsername.getValueStateText());
                    return;
                }
                if (this.txtPassword.getValueState() === "Error") {
                    MessageToast.show(this.txtPassword.getValueStateText());
                    return;
                }
            }
        },
        login: function (pernr, password) {
            var that = this;
            var Pernr = pernr;
            this.busyDialog.open();
            var onSucccess = function (odata) {
                    setTimeout(that.processLoginResult(odata, password), 6000);
                },
                onError = function (error) {
                    that.busyDialog.close();
                    var msg = that.getResourceBundle().getText("LOGIN_ERROR");
                    MessageToast.show(msg);
                };
            var parameters = {
                Pernr: pernr,
                Passcode: password,
                AppVersion: this.mng_version
            };
            // this.getModel().callFunction("/Login", {
            //     method: "POST",
            //     urlParameters: parameters,
            //     success: onSucccess,
            //     error: onError
            // });
            var odata = {
                ReturnValue: 'X',
                Pernr: 10001,
                Ename: 'Nguyễn Văn A',
                AssignedSite: '1001',
                SiteDesc: 'Cửa hàng Quận 1',
                Status: 'Online',
                token: 'm12983m1hvr96724g3r9t23hr9723uer209e23rh2485h3mv0378th345876t'
            };
            setTimeout(that.processLoginResult(odata, password), 6000);
        },
        processLoginResult: function (odata, password) {
            var msg = "";
            switch (odata.ReturnValue) {
                //Sai password
                case "O": {
                    this.busyDialog.close();
                    msg = this.getResourceBundle().getText("msgWrongPass");
                    this.txtPassword.setValueState("Error");
                    this.txtPassword.setValueStateText(msg);
                    break;
                }
                //User chưa assign site
                case "-": {
                    this.busyDialog.close();

                    this.txtUsername.setValueState("Error");
                    if (odata.Pernr && odata.Status === "A") {
                        msg = this.getResourceBundle().getText("msgNoAssignedSite");
                    } else {
                        msg = this.getResourceBundle().getText("msgNoUser");
                    }
                    MessageToast.show(msg);
                    break;
                }
                //Chưa câp nhật phiên bản
                case "V": {
                    this.busyDialog.close();
                    if (odata.AppVersion === "locked") {
                        msg = this.getResourceBundle().getText("version") + " " + this.getResourceBundle().getText("msgVersionLocked");
                        setTimeout(MessageToast.show(msg), 600000);
                    } else {
                        this.getGlobalModel().setProperty("/user", odata.Pernr, null, true);
                        this.getGlobalModel().setProperty("/name", odata.Ename, null, true);
                        this.getGlobalModel().setProperty("/AssignedSite", odata.AssignedSite, null, true);
                        this.getGlobalModel().setProperty("/SiteDesc", odata.SiteDesc, null, true);
                        this.getGlobalModel().setProperty("/status", odata.Status, null, true);
                        this.getGlobalModel().setProperty("/token", password, null, true);
                        this.getRouter().navTo("home", true);
                        if (this.localStorage.isSupported()) {
                            var loginInfo = {
                                "user": odata.Pernr.toString(),
                                "token": password,
                                "AppVersion": this.mng_version
                            };
                            this.localStorage.put("loginInfo", loginInfo);
                        }
                        msg = this.getResourceBundle().getText("mng_old_version") + " " + this.getResourceBundle().getText("msgVersionUpdate");
                        setTimeout(MessageToast.show(msg), 60000);
                    }
                    break;
                }
                //Đăng nhập thành công
                case "X": {
                    this.busyDialog.close();
                    this.getGlobalModel().setProperty("/user", odata.Pernr, null, true);
                    this.getGlobalModel().setProperty("/name", odata.Ename, null, true);
                    this.getGlobalModel().setProperty("/AssignedSite", odata.AssignedSite, null, true);
                    this.getGlobalModel().setProperty("/SiteDesc", odata.SiteDesc, null, true);
                    this.getGlobalModel().setProperty("/status", odata.Status, null, true);
                    this.getGlobalModel().setProperty("/token", password, null, true);
                    this.getRouter().navTo("home", true);
                    if (this.localStorage.isSupported()) {
                        var loginInfo = {
                            "user": odata.Pernr.toString(),
                            "token": password,
                            "AppVersion": this.mng_version
                        };
                        this.localStorage.put("loginInfo", loginInfo);
                    }
                    msg = this.getResourceBundle().getText("msgLoginSuccessfully");
                    break;
                }
                default:
                    return;
            }
        },

        validateUsername: function (oEvent) {
            var source = oEvent ? oEvent.getSource() : this.txtUsername;
            var value = source.getValue();
            var regex = /d+/;
            if (value && value !== "" && !regex.test(value)) {
                source.setValueState("None");
                return true;
            } else {
                source.setValueState("Error");
                var msg = this.getResourceBundle().getText("msgNoUser");
                source.setValueStateText(msg);
                return false;
            }
        },
        validatePassword: function (oEvent) {
            var source = oEvent ? oEvent.getSource() : this.txtPassword;
            var value = source.getValue();
            if (value && value !== "") {
                source.setValueState("None");
                return true;
            } else {
                source.setValueState("Error");
                var msg = this.getResourceBundle().getText("msgWrongPass");
                source.setValueStateText(msg);
                return false;
            }
        },
        onBeforeRendering: function () {
            this.getView().setBusy(true);

        },

        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberOf ZTVBH.view.LoginView
         */
        onAfterRendering: function () {
            this.logon = this.checkLogin();
            if (this.logon) {
                this.getRouter().navTo("home", true);
            } else {
                this.getView().setBusy(false);
                this.txtPassword.setValue("");
            }
        },

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf ZTVBH.view.LoginView
         */
        onExit: function () {}

    });

});