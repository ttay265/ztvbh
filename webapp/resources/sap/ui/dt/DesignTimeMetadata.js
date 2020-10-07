/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/ManagedObject','sap/ui/dt/ElementUtil','sap/ui/dt/DOMUtil'],function(q,M,E,D){"use strict";var a=M.extend("sap.ui.dt.DesignTimeMetadata",{metadata:{library:"sap.ui.dt",properties:{data:{type:"any"},libraryName:"string"}}});a.prototype.setData=function(d){var m=q.extend(true,this.getDefaultData(),d||{});this.setProperty("data",m);return this;};a.prototype.getData=function(){var d=this.getProperty("data");if(!d){this.setData({});d=this.getProperty("data");}return d;};a.prototype.getDefaultData=function(){return{ignore:false,domRef:undefined,cloneDomRef:false};};a.prototype.isIgnored=function(e){var i=this.getData().ignore;if(!i||(i&&typeof i==="function"&&!i(e))){return false;}else{return true;}};a.prototype.getCloneDomRef=function(){return this.getData().cloneDomRef;};a.prototype.getDomRef=function(){return this.getData().domRef;};a.prototype.getAssociatedDomRef=function(e,d,A){var o=E.getDomRef(e);var b=[];b.push(e);if(A){b.push(A);}if(typeof(d)==="function"){var r=d.apply(null,b);return r?q(r):r;}else if(o&&typeof(d)==="string"){return D.getDomRefForCSSSelector(o,d);}};a.prototype.getAction=function(A,e){var d=this.getData();if(d.actions&&d.actions[A]){var v=d.actions[A];if(typeof(v)==="function"){v=v.call(null,e);}if(typeof(v)==="string"){return{changeType:v};}else{return v;}}};a.prototype.getLibraryText=function(k,A){var l=sap.ui.getCore().getLibraryResourceBundle(this.getLibraryName());return l.getText(k,A);};a.prototype.getTriggers=function(){var d=this.getData();var t=[];if(d&&Array.isArray(d.triggers)){t=d.triggers;}return t;};return a;},true);
