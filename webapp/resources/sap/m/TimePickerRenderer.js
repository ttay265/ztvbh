/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer','./InputBaseRenderer','sap/ui/core/ValueStateSupport','sap/ui/core/LabelEnablement'],function(q,R,I,V,L){"use strict";var T=R.extend(I);T.CSS_CLASS="sapMTimePicker";var a="sapMInputVH",b="sapMInputValHelpInner",c="sapMInputValHelp";T.addOuterClasses=function(r,C){r.addClass(T.CSS_CLASS);if(C.getEnabled()&&C.getEditable()){r.addClass(a);}};T.writeDecorations=function(r,C){var d,A,o=C._oResourceBundle,t=o.getText("TIMEPICKER_SCREENREADER_TAG");if(C.getEnabled()&&C.getEditable()){d=[b];A={};A.id=C.getId()+"-icon";A.tabindex="-1";A.title=null;r.write('<div class="'+c+'">');r.writeIcon("sap-icon://time-entry-request",d,A);r.write("</div>");}r.write('<span id="'+C.getId()+'-descr" style="visibility: hidden; display: none;">');r.writeEscaped(t);r.write('</span>');};T.writeInnerValue=function(r,C){r.writeAttributeEscaped("value",C._formatValue(C.getDateValue()));};T.writeInnerId=function(r,C){r.writeAttribute("id",C.getId()+"-"+this.getInnerSuffix());};T.getInnerSuffix=function(){return"inner";};T.getAriaRole=function(){return"combobox";};T.getAccessibilityState=function(C){var A=this.getAriaLabelledBy(C),s=this.getAriaDescribedBy(C),m=C.getAccessibilityInfo();if(C.getValueState()===sap.ui.core.ValueState.Error){m.invalid=true;}if(A){m.labelledby={value:A.trim(),append:true};}if(s){m.describedby={value:s.trim(),append:true};}return m;};T.getAriaDescribedBy=function(C){var o=C.getId()+"-descr ";if(this.getDescribedByAnnouncement(C)){o+=C.getId()+"-describedby";}return o;};return T;},true);
