/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/EnabledPropagator','sap/ui/core/IconPool','sap/ui/core/theming/Parameters'],function(q,l,C,E,I,P){"use strict";var S=C.extend("sap.m.Switch",{metadata:{library:"sap.m",properties:{state:{type:"boolean",group:"Misc",defaultValue:false},customTextOn:{type:"string",group:"Misc",defaultValue:""},customTextOff:{type:"string",group:"Misc",defaultValue:""},enabled:{type:"boolean",group:"Data",defaultValue:true},name:{type:"string",group:"Misc",defaultValue:""},type:{type:"sap.m.SwitchType",group:"Appearance",defaultValue:sap.m.SwitchType.Default}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{change:{parameters:{state:{type:"boolean"}}}}}});I.insertFontFaceStyle();E.apply(S.prototype,[true]);S.prototype._slide=function(p){if(p>S._OFFPOSITION){p=S._OFFPOSITION;}else if(p<S._ONPOSITION){p=S._ONPOSITION;}if(this._iCurrentPosition===p){return;}this._iCurrentPosition=p;this.getDomRef("inner").style[sap.ui.getCore().getConfiguration().getRTL()?"right":"left"]=p+"px";this._setTempState(Math.abs(p)<S._SWAPPOINT);};S.prototype._setTempState=function(b){if(this._bTempState===b){return;}this._bTempState=b;this.getDomRef("handle").setAttribute("data-sap-ui-swt",b?this._sOn:this._sOff);};S.prototype._setDomState=function(s){var a=this.getRenderer().CSS_CLASS,b=s?this._sOn:this._sOff,d=this.getDomRef();if(!d){return;}var $=this.$("switch"),o=this.getDomRef("inner"),h=this.getDomRef("handle"),c=null;if(this.getName()){c=this.getDomRef("input");c.setAttribute("checked",s);c.setAttribute("value",b);}h.setAttribute("data-sap-ui-swt",b);if(s){$.removeClass(a+"Off").addClass(a+"On");d.setAttribute("aria-checked","true");}else{$.removeClass(a+"On").addClass(a+"Off");d.setAttribute("aria-checked","false");}this._getInvisibleElement().text(this.getInvisibleElementText(s));if(sap.ui.getCore().getConfiguration().getAnimation()){$.addClass(a+"Trans");}o.style.cssText="";};S.prototype._getInvisibleElement=function(){return this.$("invisible");};S.prototype.getInvisibleElementId=function(){return this.getId()+"-invisible";};S.prototype.getInvisibleElementText=function(s){var b=sap.ui.getCore().getLibraryResourceBundle("sap.m");var t="";switch(this.getType()){case sap.m.SwitchType.Default:t=this.getCustomTextOn()||(s?b.getText("SWITCH_ON"):b.getText("SWITCH_OFF"));break;case sap.m.SwitchType.AcceptReject:t=b.getText("SWITCH_ARIA_ACCEPT");break;}return t;};S._TRANSITIONTIME=Number(P.get("_sap_m_Switch_TransitionTime"))||0;S._ONPOSITION=Number(P.get("_sap_m_Switch_OnPosition"));S._OFFPOSITION=Number(P.get("_sap_m_Switch_OffPosition"));S._SWAPPOINT=Math.abs((S._ONPOSITION-S._OFFPOSITION)/2);S.prototype.onBeforeRendering=function(){var r=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._sOn=this.getCustomTextOn()||r.getText("SWITCH_ON");this._sOff=this.getCustomTextOff()||r.getText("SWITCH_OFF");};S.prototype.ontouchstart=function(e){var t=e.targetTouches[0],a=this.getRenderer().CSS_CLASS,s=this.$("inner");e.setMarked();if(sap.m.touch.countContained(e.touches,this.getId())>1||!this.getEnabled()||e.button){return;}this._iActiveTouchId=t.identifier;this._bTempState=this.getState();this._iStartPressPosX=t.pageX;this._iPosition=s.position().left;this._bDragging=false;q.sap.delayedCall(0,this,"focus");this.$("switch").addClass(a+"Pressed").removeClass(a+"Trans");};S.prototype.ontouchmove=function(e){e.setMarked();e.preventDefault();var t,p,T=sap.m.touch;if(!this.getEnabled()||e.button){return;}t=T.find(e.changedTouches,this._iActiveTouchId);if(!t||t.pageX===this._iStartPressPosX){return;}this._bDragging=true;p=((this._iStartPressPosX-t.pageX)*-1)+this._iPosition;if(sap.ui.getCore().getConfiguration().getRTL()){p=-p;}this._slide(p);};S.prototype.ontouchend=function(e){e.setMarked();var t,T=sap.m.touch,a=q.sap.assert;if(!this.getEnabled()||e.button){return;}a(this._iActiveTouchId!==undefined,"expect to already be touching");t=T.find(e.changedTouches,this._iActiveTouchId);if(t){a(!T.find(e.touches,this._iActiveTouchId),"touchend still active");this.$("switch").removeClass(this.getRenderer().CSS_CLASS+"Pressed");this._setDomState(this._bDragging?this._bTempState:!this.getState());q.sap.delayedCall(S._TRANSITIONTIME,this,function(){var s=this.getState();this.setState(this._bDragging?this._bTempState:!s);if(s!==this.getState()){this.fireChange({state:this.getState()});}});}};S.prototype.ontouchcancel=S.prototype.ontouchend;S.prototype.onsapselect=function(e){var s;if(this.getEnabled()){e.setMarked();e.preventDefault();this.setState(!this.getState());s=this.getState();q.sap.delayedCall(S._TRANSITIONTIME,this,function(){this.fireChange({state:s});});}};S.prototype.setState=function(s){this.setProperty("state",s,true);this._setDomState(this.getState());return this;};S.prototype.getAccessibilityInfo=function(s){var b=sap.ui.getCore().getLibraryResourceBundle("sap.m");var d="";if(this.getState()){d=b.getText("ACC_CTR_STATE_CHECKED")+" "+this.getInvisibleElementText(s);}return{role:"checkbox",type:b.getText("ACC_CTR_TYPE_CHECKBOX"),description:d.trim(),focusable:this.getEnabled(),enabled:this.getEnabled()};};return S;},true);
