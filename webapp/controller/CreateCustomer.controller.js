sap.ui.define([
    "ZTVBH/controller/BaseController",
    "ZTVBH/model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/m/MessageToast"
], function (BaseController, formatter, JSONModel, Filter, MessageToast) {
    "use strict";

    return BaseController.extend("ZTVBH.controller.CreateCustomer", {
        formatter: formatter,
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf ZTVBH.view.CreateCustomer
         */
        onInit: function () {
            this.Device = this.getDevice();
            // Change password dialog initialization
            if (!this.AddressDialog) {
                this.AddressDialog = new sap.ui.xmlfragment(this.getView().getId(), "ZTVBH.fragment.Address", this);
                this.getView().addDependent(this.AddressDialog);
                this._selectCity = this.byId("_selectCity");
                this._selectDistrict = this.byId("_selectDistrict");
                this._selectWard = this.byId("_selectWard");
                this._inpStreet = this.byId("_inpStreet");
                this.fullAddress = "";
                this.addressModel = new JSONModel();
                this.setModel(this.addressModel, "address");
                this.addressContext = "";
                //Message
                this.msg_taxcodeInvalid = this.getResourceBundle().getText("InvalidTaxCode");
                this.msg_firstnameInValid = this.getResourceBundle().getText("InvalidFirstName");
                this.msg_emailInvalid = this.getResourceBundle().getText("InvalidEmail");
            }
            //Customer initialization
            this.inpLastName = this.byId("inpLastName");
            this.inpMiddleName = this.byId("inpMiddleName");
            this.inpFirstName = this.byId("inpFirstName");
            this.inpPhone = this.byId("inpPhone");
            this.inpLoyaltyPG = this.byId("inpLoyaltyPG");
            this.ckbActive = this.byId("ckbActive");
            this.ckbLoyaltyMem = this.byId("ckbLoyaltyMem");
            this.inpAddress = this.byId("inpAddress");
            this.inpShippingAddress = this.byId("inpShippingAddress");
            this.inpBillingAddress = this.byId("inpBillingAddress");
            this.CompanyName = this.byId("inpCompanyName");
            this.Email = this.byId("inpEmail");
            this.TaxNumber = this.byId("inpTaxCode");
            this.BirthDate = this.byId("dpkBirthday");
            this.btnOK  = this.byId("btnOk");
            //Attachment matched
            this.getView().setBusy(false);
            //initialization data
            this.customerModel = new JSONModel({
                isCreating: true,
                Id: 0,
                FirstName: "",
                MiddleName: "",
                LastName: "",
                MobilePhone: '',
                IsActive: true,
                Address: {
                    address1: "",
                    address2: "",
                    address3: "",
                    stateId: ""
                },
                ShippingAddresses: [],
                BillingAddresses: [],
                CustType: "",
                CustGroup: "",
                LoyaltyPg: "TH.KHTT",
                LoyaltyMem: true,
                AssignedSite: this.getGlobalModel().getProperty("/AssignedSite"),
                CompanyName: "",
                Email: "",
                TaxNumber: "",
                BirthDate: ""
            });
            this.getView().setModel(this.customerModel, "customerModel");
            this.getRouter().getRoute("createCustomer").attachPatternMatched(this._onCreateObjectMatched, this);
            this.getRouter().getRoute("updateCustomer").attachPatternMatched(this._onUpdateObjectMatched, this);
        },

        onFistnameChange: function () {
            if (!this.inpFirstName.getValue()){
                this.inpFirstName.setValueState(sap.ui.core.ValueState.Error);
                this.inpFirstName.setValueStateText(this.msg_firstnameInValid);
                return;
            }else {
                this.inpFirstName.setValueState(null);
            }
        },

        onChangeTaxCode:  function () {
            if (this.TaxNumber.getValue().length > 13){
                this.TaxNumber.setValueState(sap.ui.core.ValueState.Error);
                this.TaxNumber.setValueStateText(this.msg_taxcodeInvalid);
                return;
            }else {
                this.TaxNumber.setValueState(null);
            }
        },

        onChangeEmail: function () {
            if (this.Email.getValue() !== "") {
                var mailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                if (!mailregex.test(this.Email.getValue())) {
                    this.Email.setValueState(sap.ui.core.ValueState.Error);
                    this.Email.setValueStateText(this.msg_emailInvalid);
                    return this;
                }else {
                    this.Email.setValueState(null);
                }
            }else{
                this.Email.setValueState(null);
            }

        },
        _onCreateObjectMatched: function () {
            this.Pernr = this.getGlobalModel().getProperty("/user");
            if (!this.Pernr) {
                this.getRouter().navTo("login", true);
            }
            this.customerModel.setData({
                isCreating: true,
                Id: 0,
                FirstName: "",
                MiddleName: "",
                LastName: "",
                MobilePhone: '',
                IsActive: true,
                Address: null,
                ShippingAddresses: [],
                BillingAddresses: [],
                CustType: "",
                CustGroup: "",
                Cslab: "",
                LoyaltyPg: "TH.KHTT",
                LoyaltyMem: true,
                AssignedSite: this.getGlobalModel().getProperty("/AssignedSite"),
                CompanyName: "",
                Email: "",
                TaxNumber: "",
                BirthDate: ""
            });
        },
        onRefreshCustomerModelData: function () {
            this.customerModel.setData({
                Address: null,
                ShippingAddresses: [],
                BillingAddresses: []
            });
        },
        _onUpdateObjectMatched: function (oEvent) {
            //clear value state
            this.inpPhone.setValueState(null);
            this.inpFirstName.setValueState(null);
            this.Email.setValueState(null);
            this.TaxNumber.setValueState(null);
            this.onRefreshCustomerModelData();
            //Progress place
            var that = this;
            this.Kunnr = oEvent.getParameter("arguments").CustomerId;
            var Pernr = this.getGlobalModel().getProperty("/user");
            var AssignedSite = this.getGlobalModel().getProperty("/AssignedSite");
            if (!Pernr) {
                this.getRouter().navTo("login", true);
            } else {
                if (this.Kunnr) {
                    var sPath = this.getModel().createKey("/CustomerSet", {
                        Id: this.Kunnr, //CustomerID
                        AssignedSite: AssignedSite //Employee site
                    });
                    var fnSuccess = function (oData, oResponse) {
                        that.onUpdateCustomerModel(oData);
                    };
                    var fnError = function (oError) {
                        event.preventDefault();
                    };
                    this.getModel().read(
                        sPath, {
                            success: fnSuccess,
                            error: fnError
                        });
                }
            }
        },
        onUpdateCustomerModel: function (oData) {
            var that = this;
            if (oData.BirthDate) {
                // that.customerModel.setProperty("/BirthDate", oData.BirthDate);
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "dd/MM/yyyy"});
                var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
                var dateStr = dateFormat.format(new Date(oData.BirthDate.getTime() + TZOffsetMs)); //05-12-2012
                that.customerModel.setProperty("/BirthDate", dateStr);
            }
            that.customerModel.setProperty("/isCreating", false);
            that.customerModel.setProperty("/Id", oData.Id);
            that.customerModel.setProperty("/MobilePhone", oData.MobilePhone);
            that.customerModel.setProperty("/LastName", oData.LastName);
            that.customerModel.setProperty("/MiddleName", oData.MiddleName);
            that.customerModel.setProperty("/FirstName", oData.FirstName);
            that.customerModel.setProperty("/Email", oData.Email);
            that.customerModel.setProperty("/TaxNumber", oData.TaxNumber);
            that.customerModel.setProperty("/CompanyName", oData.CompanyName);

            // Taivt5 added 13.08.2018
            that.customerModel.setProperty("/Cslab", oData.Cslab);
            //Address parsing
            var address;
            if (oData.Address) {
                address = JSON.parse(oData.Address);
                that.customerModel.setProperty("/Address", address);
            }
            //Billing address parsing
            var shippingAddresses = [];
            if (oData.ShippingAddresses) {
                //Shipping address parsing
                shippingAddresses = JSON.parse(oData.ShippingAddresses);
            }
            that.customerModel.setProperty("/ShippingAddresses", shippingAddresses);
            var billingAddresses = [];
            if (oData.BillingAddresses) {
                billingAddresses = JSON.parse(oData.BillingAddresses);
            }
            that.customerModel.setProperty("/BillingAddresses", billingAddresses);
        },
        onAfterRendering: function () {

        },
        onAddressSelected: function (oEvent) {
            this.addressContext = oEvent.getSource().getBindingContext("customerModel");
            var address = this.addressContext.getProperty("address");
            this.setAddressModel(address);
            this._openAddressDialog();
        },
        setAddressModel: function (address) {
            if (address) {
                this.addressModel.setProperty("/", JSON.parse(JSON.stringify(address)));
                this.customerModel.updateBindings();
                this.onCityChange();
                this.onDistrictChange();
                this.onWardChange(address.stateId, address.address3);
            }else{
                this._selectWard.setSelectedKey();
                this._selectDistrict.setSelectedKey();
                this._inpStreet.setValue();
            }
        },
        //Open dialog to update Address
        _onBtnUpdateAddressPressed: function (oEvent) {
            this.addressContext = oEvent.getSource().getIdForLabel();
            var address = this.customerModel.getProperty("/Address");
            this.setAddressModel(address);
            this._openAddressDialog();
        },
        //Open dialog add customer address
        _openAddressDialog: function () {
            this.AddressDialog.open();
        },
        __addAddrCancel: function () {
            this.AddressDialog.close();
        },
        onCityChange: function () {
            var that = this;
            var source = this._selectCity;
            var selectedItem = source.getSelectedItem();
            if (selectedItem) {
                var selCityKey = selectedItem.getBindingContext().getProperty("Ztinh");
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
        onDistrictChange: function () {
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
        onWardChange: function (cityID, districtID) {
            var filters = [];
            if(cityID && districtID)
            {
                var cityFilter = new Filter({
                    path: 'Ztinh',
                    operator: 'EQ',
                    value1: cityID
                });
                filters.push(cityFilter);

                var districtFilter = new Filter({
                    path: 'Zquan',
                    operator: 'EQ',
                    value1: districtID
                });
                filters.push(districtFilter);
                this._selectWard.getBinding("items").filter(filters);
            }
        },
        _doConcatenateAddress: function (oEvent) {
            var streetName = this._inpStreet.getValue();
            var fullAddress = streetName + ', ' + this._selectWard.getValue() + ', ' + this._selectDistrict.getValue() + ', ' + this._selectCity.getValue();
            var address = JSON.parse(JSON.stringify(this.addressModel.getData()));
            address.fullAdd = fullAddress;
            switch (this.addressContext) {
                case this.getSId("btn_address"): {
                    this.customerModel.setProperty("/Address", address);
                    this.customerModel.updateBindings();
                    break;
                }
                case this.getSId("btn_shippingAddress"): {
                    var ShipAddresses = this.customerModel.getProperty("/ShippingAddresses");
                    var ShipAddress = {
                        key: 0,
                        address: address
                    };
                    ShipAddresses.push(ShipAddress);
                    this.customerModel.updateBindings();
                    this.customerModel.refresh(true);
                    break;
                }
                case this.getSId("btn_billingAddress"): {
                    var BillingAddresses = this.customerModel.getProperty("/BillingAddresses");
                    var BillingAddress = {
                        key: 0,
                        address: address
                    };
                    BillingAddresses.push(BillingAddress);
                    this.customerModel.updateBindings();
                    this.customerModel.refresh(true);
                    break;
                }
                default:
                    this.customerModel.setProperty("address", address, this.addressContext);
                    break;
            }

            this.AddressDialog.close();
        },
        onAddressDelete: function (oEvent) {
            var item = oEvent.getParameter("listItem");
            var context = item.getBindingContext("customerModel");
            var path = context.getPath();
            var index = path.substr(-1, 1);
            var property = path.substr(0, path.lastIndexOf("/"));
            var items = this.customerModel.getProperty(property);
            items.splice(parseInt(index, 10), 1);
            this.customerModel.updateBindings();
            this.customerModel.refresh(true);
        },
        onPhoneLiveChanged: function (oEvent) {
            var value = oEvent.getParameter("value");
            var regex = /([0-9])/;
            if (value !== "" && !regex.test(value)) {
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },
        btnOKValida: function () {
            this.btnOK.setEnabled(false);
            this.validatingConfirm();
        },
        validatingConfirm: function () {
            //Get parameters values
            this.customerModel.setProperty("/Validate", true);
            var LastName = this.inpLastName.getValue();
            var MiddleName = this.inpMiddleName.getValue();
            var FirstName = this.inpFirstName.getValue();
            var Phone = this.inpPhone.getValue().replace(/ /g, "");

            // Taivt5 add 13.08.2018
            var LoyaltyPG = this.customerModel.getProperty("/Cslab", null, false);
            // Taivt5 remove 13.08.2018
            //var LoyaltyPG = this.inpLoyaltyPG.getValue();

            var IsActive = this.ckbActive.getSelected();
            var LoyaltyMem = this.ckbLoyaltyMem.getSelected();
            var CompanyName = this.CompanyName.getValue();
            var Email = this.Email.getValue();
            var TaxNumber = this.TaxNumber.getValue();
            var BirthDate = this.BirthDate.getDateValue();
            var checkValid = this.inpLastName.getValue() !== "";

            //On lastname last valid
            if (!FirstName){
                this.inpFirstName.setValueState(sap.ui.core.ValueState.Error);
                MessageToast.show(this.msg_firstnameInValid);
                return;
            }else {
                this.inpFirstName.setValueState(null);
            }

            //On email last valid
            if (Email!== "") {
                var mailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                if (!mailregex.test(Email)) {
                    this.Email.setValueState(sap.ui.core.ValueState.Error);
                    MessageToast.show(this.msg_emailInvalid);
                    return;
                }else {
                    this.Email.setValueState(null);
                }
            }else {
                this.Email.setValueState(null);
            }
            //On Tax code last valid
            if (TaxNumber.length > 13){
                this.TaxNumber.setValueState(sap.ui.core.ValueState.Error);
                MessageToast.show(this.msg_taxcodeInvalid);
                return;
            }else {
                this.TaxNumber.setValueState(null);
            }
            // parse address to JSON
            var AddressProperty = this.customerModel.getProperty("/Address");
            var addressJSONString = this.condenseAddress(AddressProperty);
            var Address = JSON.stringify(addressJSONString);
            var ShippingAddresses = this.customerModel.getProperty("/ShippingAddresses");
            var ShippingAddress, BillingAddress;
            var i = 0;
            for (i = 0; i < ShippingAddresses.length; i++) {
                ShippingAddresses[i].address = this.condenseAddress(ShippingAddresses[i].address);
            }
            ShippingAddress = JSON.stringify(ShippingAddresses);
            var BillingAddresses = this.customerModel.getProperty("/BillingAddresses");
            for (i = 0; i < BillingAddresses.length; i++) {
                BillingAddresses[i].address = this.condenseAddress(BillingAddresses[i].address);
            }
            BillingAddress = JSON.stringify(BillingAddresses);
            //
            if (LastName, MiddleName, FirstName, Phone, LoyaltyPG, IsActive, LoyaltyMem, Address, ShippingAddress, BillingAddress) {
                var oData = {
                    FirstName: FirstName,
                    MiddleName: MiddleName,
                    LastName: LastName,
                    MobilePhone: Phone,
                    IsActive: IsActive,
                    Address: Address,
                    ShippingAddresses: ShippingAddress,
                    BillingAddresses: BillingAddress,
                    CustGroup: "Z001",
                    LoyaltyPg: LoyaltyPG,
                    LoyaltyMem: LoyaltyMem,
                    AssignedSite: this.getGlobalModel().getProperty("/AssignedSite"),
                    CompanyName: CompanyName,
                    Email: Email,
                    TaxNumber: TaxNumber,
                    ACTMODE: ""
                };
                if (BirthDate) {
                    BirthDate.setHours(7);
                    oData.BirthDate = BirthDate;
                }
                this.getView().setBusy(true);
                if (this.customerModel.getProperty("/isCreating")) {
                    oData.ACTMODE = "create";
                    this.doCreateCustomer(oData, "create");
                } else {
                    oData.Id = this.Kunnr;
                    oData.ACTMODE = "update";
                    this.doCreateCustomer(oData, "update");
                }
            } else {
                var msg = this.getResourceBundle().getText("MSG_FILL_INFOR");
                MessageToast.show(msg);
            }
        },
        condenseAddress: function (AddressProperty) {
            return {
                address1: AddressProperty.address1,
                address2: AddressProperty.address2,
                address3: AddressProperty.address3,
                stateId: AddressProperty.stateId
            };
        },
        doUpdateCustomer: function (oData) {
            var that = this;
            var onSuccess = function (oData) {
                var onReadSuccess = function (oData, response) {
                    MessageToast.show(that.getResourceBundle().getText("MSG_UPDATE_CUSTOMER_SUCCESS"));
                    that.getView().setBusy(false);
                };
                that.getModel().read(sPath, {
                    success: onReadSuccess
                });
            }, onFail = function () {
            };
            //Assign data to model
            var sPath = this.getModel().createKey("/CustomerSet", {
                Id: this.customerModel.getProperty("/Id"),
                AssignedSite: this.getGlobalModel().getProperty("/AssignedSite")
            });
            this.getModel().update(sPath, oData, {success: onSuccess, fail: onFail});
            this.getModel().refresh(true);
        },
        doCreateCustomer: function (oData, act) {
            var that = this;
            //Set data
            var onSuccess = function (oData) {
                switch (oData.Return) {
                    case "Success": //success case
                        if(act === "create"){
                            MessageToast.show(that.getResourceBundle().getText("MSG_CREATE_CUSTOMER_SUCCESSFULLY"));
                            that.setCustomerToCart(oData.Id);
                        }else{
                            MessageToast.show(that.getResourceBundle().getText("MSG_UPDATE_CUSTOMER_SUCCESS"));
                            that.setCustomerToCart(oData.Id);
                        }
                        that.getView().setBusy(false);
                        break;

                    case "MOBILE_PHONE_EXISTED": // Exception: Mobile phone existed
                        that.getView().setBusy(false);
                        MessageToast.show(that.getResourceBundle().getText("MSG_MOBILE_EXISTED"));
                        break;
                    default:    // Server return error: message
                        that.getView().setBusy(false);
                        MessageToast.show(oData.Return);
                        break;

                }
            }, onFail = function () {
                MessageToast.show(that.getResourceBundle().getText("MSG_MOBILE_EXISTED"));
                that.getView().setBusy(false);
                return;
            };
            //Assign data to model
            this.getModel().create("/CustomerSet", oData, {success: onSuccess, fail: onFail});
            this.getModel().refresh(true);
        },
        btnCancel: function () {
            //Do st
        },
        onFormClear: function () {
            this._onCreateObjectMatched();
        },
        setCustomerToCart: function (Kunnr) {
            var that = this;
            var customerPath = this.getModel().createKey("/CustomerSet", {
                Id: Kunnr,
                AssignedSite: this.getGlobalModel().getProperty("/AssignedSite")
            });

            function requestCustomer() {
                var fnSuccess = function (oData, oResponse) {
                    if (requesting) {
                        clearInterval(requesting);
                    }
                    that.getCartModel().setProperty("/CustomerId", oData.Id);
                    var fullName = oData.LastName + ' ' + oData.MiddleName + ' ' + oData.FirstName;
                    that.getCartModel().setProperty("/CustomerName", fullName);
                    that.getCartModel().setProperty("/Mobile", oData.MobilePhone);
                    that.getCartModel().setProperty("/Cslab", oData.Cslab);
                    var address = JSON.parse(oData.Address);
                    that.getCartModel().setProperty("/Address", address);
                    var shippingAddresses = JSON.parse(oData.ShippingAddresses);
                    that.getCartModel().setProperty("/ShippingAddresses", shippingAddresses);
                    that.back();
                    that.getView().setBusy(false);
                };
                var fnError = function (oError) {
                    event.preventDefault();
                };
                that.getModel().read(
                    customerPath, {
                        success: fnSuccess,
                        error: fnError
                    });
            }
            var requesting = setInterval(requestCustomer, 2000);
        }

    });

});