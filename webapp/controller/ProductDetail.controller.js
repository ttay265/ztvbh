sap.ui.define([
    "ZTVBH/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "ZTVBH/model/formatter",
    "sap/m/GroupHeaderListItem",
    "sap/ui/model/Filter"
], function (BaseController, MessageToast, MessageBox, formatter, GroupHeaderListItem, Filter) {
    "use strict";

    return BaseController.extend("ZTVBH.controller.ProductDetail", {
        formatter: formatter,
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf ZTVBH.view.ProductDetail
         */
        onInit: function () {
            this._tblStock = this.byId("_tblStock");
            this.getRouter().getRoute("productDetail").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function (oEvent) {
            this.Matnr = oEvent.getParameter("arguments").Matnr;
            this.Pernr = this.getGlobalModel().getProperty("/user");
            if (!this.Pernr) {
                this.getRouter().navTo("login", true);
            } else {
                this.sPath = this.getModel().createKey("/ArticleSet", {
                    Matnr: this.Matnr
                });
                this.getView().bindElement({
                    path: this.sPath
                });
                this.bindingContext = this.getView().getBindingContext();
                //Filter Stocking by Assigned Site
                var site = this.getGlobalModel().getProperty("/AssignedSite");
                var filter = new Filter({
                    path: 'Site',
                    operator: 'EQ',
                    value1: site
                });
                var filters = [];
                filters.push(filter);
                this._tblStock.attachUpdateFinished(this.setDefaultBatch, this);
                this._tblStock.getBinding("items").filter(filters);
                this.byId("_selectStockSites").setSelectedKey(site);
            }
        },
        setDefaultBatch: function (oEvent) {
            var items = oEvent.getSource().getItems();
            if (items.length > 1) {
                this.SelectedBatch = {
                    Batch: items[1].getBindingContext().getProperty("Batch"),
                    Quantity: items[1].getBindingContext().getProperty("Quantity")
                };

            } else {
                this.SelectedBatch = {
                    Batch: "",
                    Quantity: 0
                };
            }
            this._tblStock.detachUpdateFinished(this.setDefaultBatch, this);


        },
        onNavBack: function () {
            this.getRouter().navTo("home", false);
        },
        onAddButtonPress: function (oEvent) {
            var selectedItem = this._tblStock.getSelectedItem();
            //Add to cart
            var ProductId = oEvent.getSource().getBindingContext().getProperty("Matnr");
            var ProductName = oEvent.getSource().getBindingContext().getProperty("Maktx");
            var UnitPrice = oEvent.getSource().getBindingContext().getProperty("Endpr");
            var batchItems = this._tblStock.getItems();
            var CurrencyCode = oEvent.getSource().getBindingContext().getProperty("Waers");
            var data = this.getCartModel().getProperty("/CartItems");
            // Do add line Item
            if (ProductId) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ProductId === ProductId) {
                        data[i].Quantity += 1;
                        this.postAddToCart();
                        return;
                    }
                }

                var newData = {
                    ProductId: ProductId,
                    ProductName: ProductName,
                    UnitPrice: UnitPrice,
                    Quantity: 1,
                    DeliverySite: this.getGlobalModel().getProperty("/AssignedSite"),
                    CurrencyCode: CurrencyCode,
                    ShippingMethod: ""
                };
                if (this.SelectedBatch) {
                    newData.SelectedBatch = this.SelectedBatch;
                }
                data.push(newData);
                this.postAddToCart();
            }
        },
        postAddToCart: function () {
            var totalQuantity = this.getCartModel().getProperty("/TotalQuantity");
            this.getCartModel().setProperty("/TotalQuantity", ++totalQuantity);
            MessageToast.show(this.getResourceBundle().getText("MSG_ADDED_TO_CART"));
            // this.back();
        },
        getGroup: function (oContext) {
            var sKey = oContext.getProperty("StoreLocation");
            var title = oContext.getProperty("SLocName");
            return {
                key: sKey,
                title: sKey + " - " + title
            };
        },
        getGroupHeader: function (oGroup) {
            return new GroupHeaderListItem({
                title: oGroup.title,
                upperCase: false
            });
        },
        onSiteChange: function (oEvent) {
            var selectedSite = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("Werks");
            if (selectedSite) {
                // Filter Stocking by Assigned Site
                var filter = new Filter({
                    path: 'Site',
                    operator: 'EQ',
                    value1: selectedSite
                });
                var filters = [];
                filters.push(filter);
                this._tblStock.getBinding("items").filter(filters);
            }
        },
        onProdShowPress: function (oEvent) {
            var Url = oEvent.getSource().getBindingContext().getProperty("Url");
            location.href = (Url);
        }
        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberOf ZTVBH.view.ProductDetail
         */
        // onBeforeRendering: function(oEvent) {

        // }

        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberOf ZTVBH.view.ProductDetail
         */
        //	onAfterRendering: function() {
        //
        //	},  NGÔ Văn Nghè

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf ZTVBH.view.ProductDetail
         */
        //	onExit: function() {
        //
        //	}

    });

});