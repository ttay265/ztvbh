sap.ui.define([
    "ZTVBH/controller/BaseController",
    "ZTVBH/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel"
], function (BaseController, formatter, Filter, JSONModel) {
    "use strict";

    return BaseController.extend("ZTVBH.controller.Customer", {

        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf ZTVBH.view.Product
         */
        formatter: formatter,
        onInit: function () {
            this.myData = [];
            this.inpSearch = this.byId("inpSearch");
            this._tblCustomerSet = this.byId("_tblCustomerSet");
            this._tblCustomerSet.setBusyIndicatorDelay(0);
            this._tblCustomerSet.setModel(new JSONModel(), "CustomerSet");
            this.getRouter().getRoute("cusList").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function () {
            this.Pernr = this.getGlobalModel().getProperty("/user");
            if (!this.Pernr) {
                this.getRouter().navTo("login", true);
            }
            this.onCustomerSuggest();
        },
        onAfterRendering: function () {
        },
        onAddCustomerPress: function () {
            this.getRouter().navTo("createCustomer", false);
        },
        onTblCustomerGrowStarted: function (oEvent) {
            // console.log(oEvent.getParameters());
        },
        onCustomerSuggest: function () {
            var that = this;
            //Send suggest request
            // var suggestValue = oEvent.getParameter("query");
            var suggestValue = this.inpSearch.getValue();
            var msgSearchCustomer = this.getResourceBundle().getText("MSG_SEARCH_CUSTOMER");

            if (suggestValue) {
                // this.openBusyDialog({
                //     text: msgSearchCustomer
                // });
                this._tblCustomerSet.setBusy(true);
                var urlParameters = {
                    "search": suggestValue,
                    "$top": "30"
                };
                var filters = [];
                var SiteFilter = new Filter({
                    path: "AssignedSite",
                    operator: "EQ",
                    value1: this.getGlobalModel().getProperty("/AssignedSite")
                });
                filters.push(SiteFilter);

                var onSuccess = function (oData) {
                    that._tblCustomerSet.getModel("CustomerSet").setData(oData);
                    that._tblCustomerSet.setBusy(false);
                    that.closeBusyDialog();
                }, onFail = function (error) {
                    that._tblCustomerSet.setBusy(true);
                };
                this.getModel().read("/CustomerSet", {
                        urlParameters: urlParameters,
                        filters: filters,
                        success: onSuccess,
                        fail: onFail
                    }
                );
            } else {
                // this._tblCustomerSet.getModel("CustomerSet").setData(null);
                this._tblCustomerSet.getModel("CustomerSet").setData(null);
            }
        },
        //Update customer info
        onRowSelected: function (oEvent) {
            var CustomerId = oEvent.getSource().getBindingContext("CustomerSet").getProperty("Id");
            if (CustomerId) {
                this.getRouter().navTo(
                    "updateCustomer",
                    {
                        "CustomerId": CustomerId
                    },
                    false);
            }
        }
        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberOf ZTVBH.view.Product
         */
        //	onBeforeRendering: function() {
        //
        //	},

        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberOf ZTVBH.view.Product
         */
        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf ZTVBH.view.Product
         */
        //	onExit: function() {
        //
        //	}

    });

});