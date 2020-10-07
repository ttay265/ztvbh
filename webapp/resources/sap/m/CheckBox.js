/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Label','./library','sap/ui/Device','sap/ui/core/Control',"sap/ui/core/IconPool",'sap/ui/core/EnabledPropagator'],function(q,L,l,D,C,I,E){"use strict";var a=C.extend("sap.m.CheckBox",{metadata:{interfaces:["sap.ui.core.IFormContent"],library:"sap.m",properties:{selected:{type:"boolean",group:"Data",defaultValue:false},enabled:{type:"boolean",group:"Behavior",defaultValue:true},name:{type:"string",group:"Misc",defaultValue:null},text:{type:"string",group:"Appearance",defaultValue:null},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:sap.ui.core.TextDirection.Inherit},textAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:sap.ui.core.TextAlign.Begin},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:''},activeHandling:{type:"boolean",group:"Misc",defaultValue:true},editable:{type:"boolean",group:"Behavior",defaultValue:true},valueState:{type:"sap.ui.core.ValueState",group:"Data",defaultValue:sap.ui.core.ValueState.None}},aggregations:{_label:{type:"sap.m.Label",group:"Behavior",multiple:false,visibility:"hidden"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{select:{parameters:{selected:{type:"boolean"}}}},designTime:true}});E.call(a.prototype);a.prototype.init=function(){this.addActiveState(this);I.insertFontFaceStyle();};a.prototype.exit=function(){this._oLabel=null;delete this._iTabIndex;};a.prototype.setSelected=function(s){s=!!s;if(s==this.getSelected()){return this;}this.$("CbBg").toggleClass("sapMCbMarkChecked",s);this.$().attr("aria-checked",s);var c=this.getDomRef("CB");if(c){s?c.setAttribute('checked','checked'):c.removeAttribute('checked');}this.setProperty("selected",s,true);return this;};a.prototype.setText=function(t){var o=this._getLabel(),h=!!t;this.setProperty("text",t,true);o.setText(t);this.$().toggleClass("sapMCbHasLabel",h);return this;};a.prototype.setWidth=function(w){var o=this._getLabel();this.setProperty("width",w,true);o.setWidth(w);return this;};a.prototype.setTextDirection=function(d){var o=this._getLabel();this.setProperty("textDirection",d,true);o.setTextDirection(d);return this;};a.prototype.setTextAlign=function(A){var o=this._getLabel();this.setProperty("textAlign",A,true);o.setTextAlign(A);return this;};a.prototype.addActiveState=function(c){if(D.os.blackberry){c.addDelegate({ontouchstart:function(e){q(c.getDomRef()).addClass("sapMActive");},ontouchend:function(e){q(c.getDomRef()).removeClass("sapMActive");}});}};a.prototype.ontouchstart=function(e){e.originalEvent._sapui_handledByControl=true;};a.prototype.ontap=function(e){if(this.getEnabled()&&this.getEditable()){this.$().focus();var s=!this.getSelected();this.setSelected(s);this.fireSelect({selected:s});e&&e.setMarked();}};a.prototype.onsapspace=function(e){this.ontap(e);if(e){e.preventDefault();e.stopPropagation();}};a.prototype.onsapenter=function(e){this.ontap(e);};a.prototype.setTabIndex=function(t){this._iTabIndex=t;this.$("CbBg").attr("tabindex",t);return this;};a.prototype.getTabIndex=function(){if(this.hasOwnProperty("_iTabIndex")){return this._iTabIndex;}return this.getEnabled()?0:-1;};a.prototype._getLabel=function(){if(!this._oLabel){this._oLabel=new L(this.getId()+"-label",{labelFor:this.getId()}).addStyleClass("sapMCbLabel");this.setAggregation("_label",this._oLabel,true);}return this.getAggregation("_label");};a.prototype.getAccessibilityInfo=function(){var b=sap.ui.getCore().getLibraryResourceBundle("sap.m");return{role:"checkbox",type:b.getText("ACC_CTR_TYPE_CHECKBOX"),description:(this.getText()||"")+(this.getSelected()?(" "+b.getText("ACC_CTR_STATE_CHECKED")):""),focusable:this.getEnabled(),enabled:this.getEnabled(),editable:this.getEditable()};};a.prototype.getFormDoNotAdjustWidth=function(){return this.getText()?false:true;};return a;},true);