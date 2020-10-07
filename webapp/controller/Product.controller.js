sap.ui.define([
    "ZTVBH/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    "ZTVBH/model/formatter"
], function (BaseController, MessageToast, Filter, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("ZTVBH.controller.Product", {
        formatter: formatter,
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf ZTVBH.view.Product
         */
        onInit: function () {
            this.inpSearch = this.byId("_txtSearch");
            this.filters = [];
            this.Device = this.getDevice();
            this._tblProduct = this.byId("_tblProduct");
            this._tblProduct.setBusyIndicatorDelay(0);
            this.setModel(new JSONModel(), "productFilter");
            this._tblProduct.setModel(new JSONModel(), "productResult");
            this.getRouter().getRoute("proList").attachPatternMatched(this._onObjectMatched, this);
            this.getRouter().getRoute("home").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            this.Pernr = this.getGlobalModel().getProperty("/user");
            if (!this.Pernr || this.Pernr === "") {
                this.getRouter().navTo("login", true);
            }
            //Get product by Article type
            else {
                this.onProductSearch();
            }

        },
        _onModelBindCompleted: function () {
            this.bindingContext = this.productList.getBindingContext();
        },
        _navToProdDetail: function (oEvent) {
            var Matnr = oEvent.getSource().getBindingContext("productResult").getProperty("Matnr");
            this.getRouter().navTo("productDetail", {"Matnr": Matnr}, false);
        },
        inpSuggest: function () {
            this.inpSearch.suggest();
        },
        onProductSearch: function (oEvent) {
            var that = this;
            var filterModel = this.getModel("productFilter");
            //Get URL (Search) Parameters
            var searchValue = filterModel.getProperty("/Search");

            //callback Fn
            var onSuccess = function (oData) {
                that._tblProduct.setBusy(false);
                that._tblProduct.setModel(new JSONModel(oData), "productResult");
            }
            var onFail = function (oData) {
                that.getView().setBusy(false);
            }
            if (searchValue) {
                // this.openBusyDialog({
                //     title: this.getResourceBundle().getText("MSG_SEARCH_PRODUCT"),
                //     showCancelButton: true
                // });
                that._tblProduct.setBusy(true);
                var urlParameters = {
                    search: searchValue
                };
                //Get Filter Parameters
                var filters = [];
                for (var i = 0; i < this.filters.length; i++) {
                    filters.push(this.filters[i]);
                }
                var mtartFilterValue = filterModel.getProperty("/Mtart");
                if (mtartFilterValue) {
                    var mtartFilter = new Filter({
                        path: "Mtart",
                        operator: "EQ",
                        value1: mtartFilterValue
                    });
                    filters.push(mtartFilter);
                }
                //Article type filter
                var assignedSite = this.getGlobalModel().getProperty("/AssignedSite");
                var siteFilter = new Filter({
                    path: "Site",
                    operator: 'EQ',
                    value1: assignedSite
                });
                filters.push(siteFilter);
                this.getModel().read("/ArticleSet", {
                    urlParameters: urlParameters,
                    filters: filters,
                    success: onSuccess,
                    error: onFail
                });
            } else {
                this._tblProduct.getModel("productResult").setData(null);
            }

        }
        // onProductGroupChange: function (oEvent) {
        //     oEvent.getSource().getSelectedKey();
        //     var productGroupFilter = new Filter({
        //         path: "Mtart"
        //     });
        // }

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
        //	onAfterRendering: function() {
        //
        //	},

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf ZTVBH.view.Product
         */
        //	onExit: function() {
        //
        //	}

    });

});