sap.ui.define([
    "ZTVBH/controller/BaseController",
    "sap/m/MessageToast",
    "ZTVBH/model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/core/Item"
], function (BaseController, MessageToast, formatter, JSONModel, Filter, Item) {
    "use strict";

    return BaseController.extend("ZTVBH.controller.Transaction", {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf ZTVBH.www.view.SaleIncomeItem
         */
        formatter: formatter,
        onInit: function () {
            //Declare Variables
            this.getView().setBusyIndicatorDelay(0);
            this._txtCustomerSearch = this.byId("_txtCustomerSearch");
            this._tblCartItems = this.byId("_tblCartItems");
            this._cbDeliveryAddress = this.byId("_cbDeliveryAddress");
            this._selectShipMethod = this.byId("_selectShipMethod");
            this._txtDeliveryNotes = this.byId("_txtDeliveryNotes");
            this._dpDeliveryDateTime = this.byId("_dpDeliveryDateTime");
            //Deny input date time from user
            this._dpDeliveryDateTime.addEventDelegate({
                onAfterRendering: function () {
                    var oDateInner = this.$().find('.sapMInputBaseInner');
                    var oID = oDateInner[0].id;
                    $('#' + oID).attr("disabled", "disabled");
                }
            }, this._dpDeliveryDateTime);


            this.getRouter().getRoute("cart").attachPatternMatched(this._onObjectMatched, this);
            //Initialize fragments
            var that = this;
            if (!this.CartItemDialog) {
                this.CartItemDialog = sap.ui.xmlfragment(this.getView().getId(), "ZTVBH.fragment.CartItemDialog", this);
                this.getView().addDependent(this.CartItemDialog);
                this.CartItemDialog.attachAfterClose(function () {
                    that.CartItemDialog.unbindElement("CartProperties");
                });
                this._selectStock = this.byId("_selectStock");
                this._dpLineDeliveryDateTime = this.byId("_dpLineDeliveryDateTime");
                this._cbLineDeliveryAddress = this.byId("_cbLineDeliveryAddress");
                this._selectLineShipMethod = this.byId("_selectLineShipMethod");
                this._selectLineDeliverySLoc = this.byId("_selectLineDeliverySLoc");
                this._selectLineDeliverySite = this.byId("_selectLineDeliverySite");
                this._txtLineDeliveryNotes = this.byId("_txtLineDeliveryNotes");
                this.lbl_sloc_cartitem = this.byId("lbl_sloc_cartitem");
                this.cartItemModel = new JSONModel();
                this.CartItemDialog.setModel(this.cartItemModel, "CartItem");

                //Deny input date time from user
                this._dpLineDeliveryDateTime.addEventDelegate({
                    onAfterRendering: function () {
                        var oDateInner = this.$().find('.sapMInputBaseInner');
                        var oID = oDateInner[0].id;
                        $('#' + oID).attr("disabled", "disabled");
                    }
                }, this._dpLineDeliveryDateTime);

            }
            if (!this.AddressDialog) {
                this.AddressDialog = sap.ui.xmlfragment(this.getView().getId(), "ZTVBH.fragment.Address", this);
                this.getView().addDependent(this.AddressDialog);
                this._selectCity = this.byId("_selectCity");
                this._selectDistrict = this.byId("_selectDistrict");
                this._selectWard = this.byId("_selectWard");
                this._inpStreet = this.byId("_inpStreet");
                this.fullAddress = "";
                this.addressModel = new JSONModel();
                this.setModel(this.addressModel, "address");
                this.btnAddressClick = "";
            }
            if (!this.CustomerSearchDialog) {
                this.CustomerSearchDialog = sap.ui.xmlfragment(this.getView().getId(), "ZTVBH.fragment.CustomerSearchDialog", this);
                this.getView().addDependent(this.CustomerSearchDialog);
                this._tblCustomerSet = this.byId("_tblCustomerSet");
                this._tblCustomerSet.setBusyIndicatorDelay(0);
                this._tblCustomerSet.setModel(new JSONModel(), "CustomerSet");
                this.CustomerSearchDialog.attachAfterClose(function () {
                    that.CartItemDialog.unbindElement("CustomerSet");
                });
            }
        },
        _onObjectMatched: function () {
            // Taivt5 return
            var site = this.getGlobalModel().getProperty("/AssignedSite");
            var filters = [];
            var SiteFilter = new Filter({
                path: 'Site',
                operator: 'EQ',
                value1: site
            });
            filters.push(SiteFilter);
            this._selectLineDeliverySLoc.getBinding("items").filter(filters);
            this.getView().setBusy(false);
        },
        onAfterRendering: function (oEvent) {

        },
        onNavBack: function () {
        },

        /*
         Customer Search Dialog functions
         */
        onCreateCustomerPress: function () {
            this.onCustomerSearchDialogClose();
            this.getRouter().navTo("createCustomer", false);
        },

        onCustomerSuggest: function (oEvent) {
            var that = this;
            //Send suggest request
            var suggestValue = oEvent.getParameter("query");
            if (suggestValue) {
                this._tblCustomerSet.setBusy(true);
                var urlParameters = {
                    "search": suggestValue,
                    "$top": "10"
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
                    that._tblCustomerSet.setBusy(false);
                    that.closeBusyDialog();

                };
                this.getModel().read("/CustomerSet", {
                        urlParameters: urlParameters,
                        filters: filters,
                        success: onSuccess,
                        fail: onFail
                    }
                );
            } else {
                this._tblCustomerSet.getModel("CustomerSet").setData(null);
            }
        },
        onCustomerSelect: function (oEvent) {
            var context = oEvent.getSource().getBindingContext("CustomerSet");
            var fullName = context.getProperty("LastName") + " " + context.getProperty("MiddleName") + " " +
                context.getProperty("FirstName");
            this.getCartModel().setProperty("/CustomerId", context.getProperty("Id"));
            this.getCartModel().setProperty("/CustomerName", fullName);
            this.getCartModel().setProperty("/Mobile", context.getProperty("MobilePhone"));
            this.getCartModel().setProperty("/Cslab", context.getProperty("Cslab"));
            var addressProperty = context.getProperty("Address");
            var address;
            if (addressProperty) {
                address = JSON.parse(addressProperty);
            }
            this.getCartModel().setProperty("/Address", address);
            var shippingAddressesProperty = context.getProperty("ShippingAddresses");
            var shippingAddresses;
            if (shippingAddressesProperty) {
                shippingAddresses = JSON.parse(shippingAddressesProperty);
            }
            this.getCartModel().setProperty("/ShippingAddresses", shippingAddresses);
            this.onCustomerSearchDialogClose();
        },

        onCustomerSearchDialogClose: function () {
            this.CustomerSearchDialog.close();
        },

        onAddProductPressed: function () {
            this.getRouter().navTo("home", false);
        },

        onDelete: function (oEvent) {
            var item = oEvent.getParameter("listItem");
            var context = item.getBindingContext("CartProperties");
            var ProductId = context.getProperty("ProductId");
            var items = this.getCartModel().getProperty("/CartItems");
            for (var i = 0; i < items.length; i++) {
                if (items[i].ProductId === ProductId) {
                    items.splice(i, 1);
                }
            }
            this.getCartModel().refresh(true);
            this.onQuantityChange();
        },
        validateCartItem: function () {
            var items = this._tblCartItems.getItems();
            var msg = "";
            var quantity, maxQuantity;
            for (var i = 0; i < items.length; i++) {
                var errorMessages = items[i].getCells()[4].getItems();
                for (var ii = 0; ii < errorMessages.length; ii++) {
                    if (errorMessages[ii].getVisible()) {
                        return {
                            item: items[i].getCells()[0].getTitle(),
                            message: errorMessages[ii].getText()
                        };
                    }
                }
                if (this.getCartModel().getProperty("/TransactionType") === "SALE") {
                    quantity = items[i].getCells()[2].getValue();
                    var selectedBatch = items[i].getCells()[2].getBindingContext("CartProperties").getProperty("SelectedBatch");
                    if (selectedBatch) {
                        maxQuantity = selectedBatch.Quantity;
                        if (quantity > maxQuantity) {
                            msg = this.getResourceBundle().getText("MSG_ERROR_INSUFFICIENT_QUANTITY");
                            return {
                                item: items[i].getCells()[0].getTitle(),
                                message: msg
                            };
                        }
                    } else {
                        msg = this.getResourceBundle().getText("MSG_BATCH_INVALID");
                        return {
                            item: items[i].getCells()[0].getTitle(),
                            message: msg
                        };
                    }
                }
            }

        },
        validateshipment: function (param) {
                var msg = "";
                var shipmentDateTime = this._dpDeliveryDateTime.getDateValue();
                var shipmentDateTimeLine = this._dpLineDeliveryDateTime.getDateValue();
                var today = new Date();
            //     var dd = today.getDate();
            //     var mm = today.getMonth() + 1; //January is 0!
            //     var yyyy = today.getFullYear();
            //     if (dd < 10) {
            //         dd = '0' + dd
            //     }
            // if (mm < 10) {
            //     mm = '0' + mm
            // }
            // today = dd + '/' + mm + '/' + yyyy;
            switch (param) {
                case "H": {
                    if (shipmentDateTime && shipmentDateTime < today) {
                        msg = this.getResourceBundle().getText("MSG_SHIPMENT_DATE_INVALID");
                    }
                    break;
                }
                case "I": {
                    if (shipmentDateTimeLine && shipmentDateTimeLine < today) {
                        msg = this.getResourceBundle().getText("MSG_SHIPMENT_DATE_ITEM_INVALID");
                    }
                    break;
                }
            }
            return {
                message: msg
            };
        },
        onCheckOutPressed: function (oEvent) {
            var that = this;
            // Fetch Cart Items Data
            var timeFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "PTkk'H'mm'M'ss'S'"
            });
            var items = [];
            var data = this.getCartModel().getProperty("/CartItems");
            // Fetch Transaction Type-dependent Data
            var transactionType = that.getCartModel().getProperty("/TransactionType");
            var shippingMethod = that.getCartModel().getProperty("/ShippingMethod");
            var lineShipDate = "", lineShipTimeValue = "";
            var shipmentDateTimeMessage = this.validateshipment('H');
            if (shipmentDateTimeMessage.message) {
                MessageToast.show(shipmentDateTimeMessage.message);
                return;
            }
            var invalidMessage = this.validateCartItem();
            var errorNameLabel = this.getResourceBundle().getText("LBL_ERROR_NAME");
            var errorProductLabel = this.getResourceBundle().getText("LBL_ERROR_PRODUCT");
            if (invalidMessage) {
                MessageToast.show(errorProductLabel + " " + invalidMessage.item + "\n" + errorNameLabel + " " + invalidMessage.message);
                return;
            }
            for (var i = 0; i < data.length; i++) {
                var item = {};
                item.Matnr = data[i].ProductId;
                item.Kwmeng = data[i].Quantity.toString();
                if (transactionType === "SALE") {
                    if (data[i].SelectedBatch !== null) {
                        item.Batch = data[i].SelectedBatch.Batch;
                        item.Sloc = data[i].Sloc;
                    }
                }
                item.Price = data[i].UnitPrice;
                item.ShipDateTime = data[i].ShipDateTime;
                if (data[i].ShipAddress) {
                    item.ShipAddress = data[i].ShipAddress;
                }
                if (data[i].ShipAddressKey) {
                    item.ShipAddressKey = data[i].ShipAddressKey;
                }
                if (data[i].ShippingMethod) {
                    item.ShipMethod = data[i].ShippingMethod;
                }
                if (data[i].DeliverySite) {
                    item.DeliverySite = data[i].DeliverySite;
                }
                if (data[i].DeliveryNotes) {
                    item.DeliveryNotes = data[i].DeliveryNotes;
                }
                items.push(item);
            }

            //Fetch Cart Header Data
            var shipDateTimeValue = this._dpDeliveryDateTime.getValue();

            var shipAddress = "", shipAddressKey = "";

            var shippingContext = this.byId("_cbDeliveryAddress").getSelectedItem();
            var shippingContext1 = this._cbLineDeliveryAddress.getSelectedItem();

            if (shippingContext) {
                shipAddress = shippingContext.getText();
                shipAddressKey = shippingContext.getKey();
            }
            else {
                if (shippingContext1) {
                    shipAddress = shippingContext1.getText();
                    shipAddressKey = shippingContext1.getKey();
                }
            }
            var transaction = {
                Kunnr: that.getCartModel().getProperty("/CustomerId"),
                Saleperson: that.getGlobalModel().getProperty("/user"),
                Site: that.getGlobalModel().getProperty("/AssignedSite"),
                Items: items,
                ShipDateTime: shipDateTimeValue,
                ShipAddress: shipAddress,
                ShipAddressKey: shipAddressKey,
                ShipMethod: that._selectShipMethod.getSelectedKey(),
                DeliveryNotes: that._txtDeliveryNotes.getValue(),
                TransactionType: that.getCartModel().getProperty("/TransactionType")
            };
            //Send data
            var fnCallback = function (oData) {
                that.getView().setBusy(false);
                if (oData.Return !== "") {
                    MessageToast.show(oData.Return);
                    return;
                }
                MessageToast.show(that.getResourceBundle().getText("MSG_POST_TRANSACTION_SUCCESSFULLY"));
                that.getRouter().navTo("home", true);
                that.resetModelData();
            }, onError = function (error) {
                that.getView().setBusy(false);
            };
            this.getView().setBusy(true);
            this.getModel().create("/SaleTransactionSet", transaction, {success: fnCallback, error: onError});
        },

        onQuantityChange: function () {
            var items = this._tblCartItems.getItems();
            var sum = 0;
            for (var i = 0; i < items.length; i++) {
                sum += items[i].getCells()[2].getValue();
            }
            this.getCartModel().setProperty("/TotalQuantity", sum);
        },

        onSelectSiteChanged: function (oEvent) {
            var matnr = this.CartItemContext.getProperty("ProductId");
            var sloc = "";
            var site = oEvent.getParameter("selectedItem").getKey();
            this.batchListBySite(site);
            var batch = "";
            batch = this._selectStock.getSelectedKey();
            if (batch) {
                batch = batch.toString();
                sloc = batch.slice(10);
                this.slocList(site, sloc);
            }
        },

        onBatchChange: function () {
            var sloc = "";
            var source = this._selectStock;
            var Quantity = parseFloat(source.getSelectedItem().getBindingContext().getProperty("Quantity"))
            if (Quantity < 0) {
                this._selectStock.setValueState("Error");
                this._selectStock.setValueStateText(this.getResourceBundle().getText("LOI_TON_KHO"));
            }
            //StorageLocation by batch
            var site = this._selectLineDeliverySite.getSelectedKey();
            var batch = source.getSelectedKey();
            //Convert to string to slice POS_SLOC
            if (batch.length > 4) {
                batch = batch.toString();
            } else {
                batch = "NO_BATCH_S" + batch;
            }
            sloc = batch.slice(10);
            this.slocList(site, sloc);
        },

        bindingData: function (site) { //Default binding & Filters
            var filters = [];

            var SiteFilter = new Filter({
                path: 'Site',
                operator: 'EQ',
                value1: site
            });
            filters.push(SiteFilter);
            this._selectLineDeliverySLoc.getBinding("items").filter(filters);
        },
        cartItemPress: function (oEvent) {
            var transactionType = this.getCartModel().getProperty("/TransactionType");
            this.CartItemContext = oEvent.getSource().getBindingContext("CartProperties");
            var data = JSON.parse(JSON.stringify(this.CartItemContext.getProperty("")));
            this.cartItemModel.setData(data, true);
            var matnr = this.CartItemContext.getProperty("ProductId");
            // Filter Batches
            var ProductPath = this.getModel().createKey("/ArticleSet", {
                Matnr: matnr
            });
            this._selectStock.bindElement(ProductPath);
            //Re binding sloc by site
            var dlvSite = this.getCartModel().getProperty(this.CartItemContext.getPath());
            var sloc = dlvSite.Sloc;
            var site = dlvSite.DeliverySite;
            // this.bindingData(site, onSelSloc);
            this.batchListBySite(site);
            //Update
            if (transactionType === 'SALE') {
                var batch = dlvSite.SelectedBatch.Batch;
                var quantity = dlvSite.SelectedBatch.Quantity;
                if (!batch) {
                    batch = this._selectStock.getSelectedKey();
                }
                batch = batch.toString();
                if (!sloc) {
                    sloc = batch.slice(10, 4);
                }
                if (batch.length > 4) {
                    this._selectStock.setSelectedKey(batch + sloc);
                } else {
                    this._selectStock.setSelectedKey(sloc);
                }

            }
            this.slocList(site, sloc);
            this.CartItemDialog.open();
        },

        slocList: function (site, slocMap) {
            var storageLocationFilters = [];
            //Site
            var SiteFilter = new Filter({
                path: 'Site',
                operator: 'EQ',
                value1: site
            });
            storageLocationFilters.push(SiteFilter);
            //Lgort
            var slocFilter = new Filter({
                path: 'PosSloc',
                operator: 'EQ',
                value1: slocMap
            });
            storageLocationFilters.push(slocFilter);
            this._selectLineDeliverySLoc.getBinding("items").filter(storageLocationFilters);
        },

        batchListBySite: function (site) {
            var batchFilters = [];
            var SiteFilter = new Filter({
                path: 'Site',
                operator: 'EQ',
                value1: site
            });
            batchFilters.push(SiteFilter);
            this._selectStock.getBinding("items").filter(batchFilters);
        },

        _cartItemDialogClose: function () {
            this.cartItemModel.setData(null);
            this.CartItemDialog.close();
        },

        _cartItemDialogValidate: function () {
            if (this.getCartModel().getProperty("/TransactionType") === "SALE") {
                //Validate Batch
                var selectedBatchObject = this._selectStock.getSelectedItem();
                if (selectedBatchObject) {
                    var selectedBatch = selectedBatchObject.getBindingContext().getProperty("");
                    if (selectedBatchObject) {
                        if (!selectedBatch.Batch) {                                                         //Case: Batch's invalid
                            if (!selectedBatch.StoreLocation) {
                                return "MSG_BATCH_INVALID";
                            }
                        }
                        if (parseFloat(selectedBatch.Quantity) <= 0) {                                      //Case: Quantity's insufficient
                            return "MSG_QUANTITY_NO_STOCK";
                        }
                    } else {                                                                                //Case: Batch's invalid
                        return "MSG_BATCH_INVALID";
                    }
                }
            }
        },

        _cartItemDialogSubmit: function () {
            var msgShipAddr = this.getResourceBundle().getText('msgShippingAddressTooLong');
            var msgSloc     = this.getResourceBundle().getText('MSG_CHOOSE_SLOC');
            var sloc = "";
            var invalidShipmentDatettime = this.validateshipment('I');
            if (invalidShipmentDatettime.message) {
                MessageToast.show(invalidShipmentDatettime.message);
                return;
            }
            var invalidMsg = this._cartItemDialogValidate();
            if (invalidMsg) {
                var msg = this.getResourceBundle().getText(invalidMsg);
                MessageToast.show(msg);
                return;
            }
            this.getCartModel().setProperty("ShipDateTime", this._dpLineDeliveryDateTime.getValue(), this.CartItemContext);  //ShipDateTime
            var shipAddressValue = this._cbLineDeliveryAddress.getSelectedItem();                           //ShipAddress + Ship Address Key
            var shipAddress, shipAddressKey;
            if (shipAddressValue) {
                shipAddress = shipAddressValue.getText();
                shipAddressKey = shipAddressValue.getKey();
                //iVend Shipping address length just 100 char [06.06.2018]
                if(shipAddress.length > 100){
                    MessageToast.show(msgShipAddr);
                    return;
                }else{
                    this.getCartModel().setProperty("ShipAddress", shipAddress, this.CartItemContext);
                    this.getCartModel().setProperty("ShipAddressKey", shipAddressKey, this.CartItemContext);
                }
            }

            var shipMethod = this._selectLineShipMethod.getSelectedKey();                                 //Shipping Method
            this.getCartModel().setProperty("ShippingMethod", shipMethod, this.CartItemContext);
            var deliveryNotes = this._txtLineDeliveryNotes.getValue();                                    //Delivery Notes
            this.getCartModel().setProperty("DeliveryNotes", deliveryNotes, this.CartItemContext);
            var deliverySite = this._selectLineDeliverySite.getSelectedKey();
            this.getCartModel().setProperty("DeliverySite", deliverySite, this.CartItemContext);
            if (this.getCartModel().getProperty("/TransactionType") === "SALE") {
                if (this._selectStock.getSelectedItem()) {
                    var selectedBatchObject = this._selectStock.getSelectedItem().getBindingContext().getProperty("");
                    var selectedBatch = {
                        Batch: selectedBatchObject.Batch,
                        Quantity: selectedBatchObject.Quantity
                    }
                    this.getCartModel().setProperty("SelectedBatch", selectedBatch, this.CartItemContext);
                    if (selectedBatch.Batch === "" && selectedBatch.Quantity > 0) {

                        if (selectedBatchObject.PosSloc) {
                            sloc = selectedBatchObject.PosSloc;
                        }
                        this.getCartModel().setProperty("Sloc", sloc, this.CartItemContext);
                    }
                    if (this._selectLineDeliverySLoc.getVisible()) {
                        var sLoc = this._selectLineDeliverySLoc.getSelectedKey();
                        if (sLoc) {
                            this.getCartModel().setProperty("Sloc", sLoc, this.CartItemContext);
                        }
                    } else {
                        this.getCartModel().setProperty("Sloc", null, this.CartItemContext);
                    }
                } else {
                    MessageToast.show(msgSloc);
                    return;
                }

            } else {
                this.getCartModel().setProperty("SelectedBatch", null, this.CartItemContext);

            }
            this._cartItemDialogClose();
            this.CartItemContext = null;
        },

        onAddCustomerPress: function () {
            this.CustomerSearchDialog.open();
        },

        //Open dialog add customer address
        _openAddressDialog: function (oEvent) {
            this.AddressDialog.open();
            var SlocDialog = this.byId("_selectLineDeliverySLoc").getSelectedKey();
            var BatchDialog = this.byId("_selectStock").getSelectedKey();
        },

        __addAddrCancel: function () {

            this.AddressDialog.close();
        },


        _doConcatenateAddress: function () {
            var streetName = this._inpStreet.getValue();
            var fullAddress = streetName + ', ' + this.WardName + ', ' + this.DistrictName + ', ' + this.CityName;
            var address = this.addressModel.getData();
            var ShippingAddressProperty = this.getCartModel().getProperty("/ShippingAddresses");
            var ShippingAddress = {
                key: 0,
                address: address
            };
            var ShippingAddresses = [];
            //Get current cart
            var CartModel = this.getCartModel().getData();
            ShippingAddresses.push(ShippingAddress);
            CartModel.ShippingAddress = JSON.stringify(ShippingAddresses);
            CartModel.AssignedSite = this.getGlobalModel().getProperty("/AssignedSite");
            if (CartModel.CustomerId && CartModel.AssignedSite) {
                this._doUpdateShippingAddress(CartModel);
                this.AddressDialog.close();
            }
        },

        condenseAddress: function (AddressProperty) {
            return {
                Address1: AddressProperty.Address1,
                Address2: AddressProperty.Address2,
                Address3: AddressProperty.Address3,
                State_Id: AddressProperty.State_Id
            };
        },

        onCityChange: function (oEvent) {
            var that = this;
            var source = this._selectCity;
            var selectedItem = source.getSelectedItem();
            if (selectedItem) {
                var selCityKey = selectedItem.getBindingContext().getProperty("Ztinh");
                //Set global
                this.CityName = selectedItem.getBindingContext().getProperty("Zdesc");
                if (selCityKey) {
                    var filters = [];
                    var cityFilter = new Filter({
                        path: 'Ztinh',
                        operator: 'EQ',
                        value1: selCityKey
                    });
                    filters.push(cityFilter);
                    this._selectDistrict.getBinding("items").filter(filters);
                }
            }
        },
        //
        _selectTypeShippingMethod: function () {
            if (this.getCartModel().getProperty("/TransactionType") === "SALE" && this._selectLineShipMethod.getSelectedKey() === "In-Store") {
                this.lbl_batch_cartitem = this.byId("lbl_batch_cartitem");
                this.lbl_sloc_cartitem = this.byId("lbl_sloc_cartitem");
                this._selectStock.setVisible(true);
                this._selectLineDeliverySLoc.setVisible(true);
                this.lbl_batch_cartitem.setVisible(true);
                this.lbl_sloc_cartitem.setVisible(true);
            } else {
                this.lbl_batch_cartitem = this.byId("lbl_batch_cartitem");
                this.lbl_sloc_cartitem = this.byId("lbl_sloc_cartitem");
                this._selectStock.setVisible(false);
                this._selectLineDeliverySLoc.setVisible(false);
                this.lbl_batch_cartitem.setVisible(false);
                this.lbl_sloc_cartitem.setVisible(false);
            }
        },

        onDistrictChange: function (oEvent) {
            var source = this._selectDistrict;
            var selectedItem = source.getSelectedItem();
            if (selectedItem) {
                var selCityKey = selectedItem.getBindingContext().getProperty("Ztinh");
                var selDistrictKey = selectedItem.getBindingContext().getProperty("Zquan");
                //Set to global
                this.DistrictName = selectedItem.getBindingContext().getProperty("Zdesc");
                if (selDistrictKey && selCityKey) {
                    var filters = [];
                    var cityFilter = new Filter({
                        path: 'Ztinh',
                        operator: 'EQ',
                        value1: selCityKey
                    });
                    filters.push(cityFilter);
                    var districtFilter = new Filter({
                        path: 'Zquan',
                        operator: 'EQ',
                        value1: selDistrictKey
                    });
                    filters.push(districtFilter);
                    this._selectWard.getBinding("items").filter(filters);
                }
            }
        },

        onWardChange: function (oEvent) {
            var selectedItem = oEvent.getSource().getSelectedItem();
            if (selectedItem) {
                var WardName = selectedItem.getBindingContext().getProperty("Zdesc");
            }
        },

        _doUpdateShippingAddress: function (CartModel) {
            var that = this;
            that.getView().setBusy(true);
            var sPath = this.getModel().createKey('/CustomerSet', {
                Id: CartModel.CustomerId,
                AssignedSite: CartModel.AssignedSite
            });
            var oData = {
                Id: CartModel.CustomerId,
                MobilePhone: CartModel.MobilePhone,
                ShippingAddresses: CartModel.ShippingAddress,
                AssignedSite: this.getGlobalModel().getProperty("/AssignedSite")
            };
            var onSuccess = function (oData, response) {
                var oldList = that._cbDeliveryAddress.getSelectableItems(),
                    i = 0, y = 0;
                var onReadSuccess = function (oData, response) {
                    var shippingAddresses;
                    if (oData.ShippingAddresses) {
                        shippingAddresses = JSON.parse(oData.ShippingAddresses);
                    } else {
                        MessageToast.show('Thêm địa chỉ giao hàng thất bại! Khách hàng' + ' ' + CartModel.CustomerId + ' ' + 'thiếu thông tin, hãy cập nhật trước.');
                    }
                    that.getCartModel().setProperty("/ShippingAddresses", shippingAddresses);
                    // for (i = 0; i < shippingAddresses.length; i++) {
                    //     if (oldList.length > 0) {
                    //         for (y = 0; y < oldList.length; y++) {
                    //             if (oldList[y].getKey() === shippingAddresses[i].key) {
                    //                 break;
                    //             } else {
                    //                 that._cbDeliveryAddress.setSelectedKey(shippingAddresses[i].key);
                    //                 break;
                    //             }
                    //         }
                    //     }
                    //     else {
                    //         that._cbDeliveryAddress.setSelectedKey(shippingAddresses[i].key);
                    //     }
                    // }
                    that.getCartModel().refresh(true);
                    that.getView().setBusy(false);
                };
                that.getModel().read(sPath, {
                    success: onReadSuccess
                });
            }, onFail = function (oData) {
                //Thêm shipping address thất bại "Khong phan hoi khi gọi update oData"
            };
            //Assign data to model
            this.getModel().update(sPath, oData, {success: onSuccess, fail: onFail});
        }
    });
})
;