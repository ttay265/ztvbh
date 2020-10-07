/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/library','sap/ui/core/Locale','sap/ui/core/LocaleData','sap/ui/core/date/UniversalDate','jquery.sap.strings'],function(q,l,L,a,U){"use strict";var C=l.CalendarType;var D=function(){throw new Error();};var c={};D.oDateInfo={oDefaultFormatOptions:{style:"medium",relativeScale:"day",relativeStyle:"wide"},aFallbackFormatOptions:[{style:"short"},{style:"medium"},{pattern:"yyyy-MM-dd"},{pattern:"yyyyMMdd",strictParsing:true}],bShortFallbackFormatOptions:true,bPatternFallbackWithoutDelimiter:true,getPattern:function(o,s,b){return o.getDatePattern(s,b);},oRequiredParts:{"text":true,"year":true,"weekYear":true,"month":true,"day":true},aRelativeScales:["year","month","week","day"],aRelativeParseScales:["year","quarter","month","week","day","hour","minute","second"],aIntervalCompareFields:["FullYear","Month","Date"]};D.oDateTimeInfo={oDefaultFormatOptions:{style:"medium",relativeScale:"auto",relativeStyle:"wide"},aFallbackFormatOptions:[{style:"short"},{style:"medium"},{pattern:"yyyy-MM-dd'T'HH:mm:ss"},{pattern:"yyyyMMdd HHmmss"}],getPattern:function(o,s,b){var S=s.indexOf("/");if(S>0){return o.getCombinedDateTimePattern(s.substr(0,S),s.substr(S+1),b);}else{return o.getCombinedDateTimePattern(s,s,b);}},oRequiredParts:{"text":true,"year":true,"weekYear":true,"month":true,"day":true,"hour0_23":true,"hour1_24":true,"hour0_11":true,"hour1_12":true},aRelativeScales:["year","month","week","day","hour","minute","second"],aRelativeParseScales:["year","quarter","month","week","day","hour","minute","second"],aIntervalCompareFields:["FullYear","Month","Date","Hours","Minutes","Seconds"]};D.oTimeInfo={oDefaultFormatOptions:{style:"medium",relativeScale:"auto",relativeStyle:"wide"},aFallbackFormatOptions:[{style:"short"},{style:"medium"},{pattern:"HH:mm:ss"},{pattern:"HHmmss"}],getPattern:function(o,s,b){return o.getTimePattern(s,b);},oRequiredParts:{"text":true,"hour0_23":true,"hour1_24":true,"hour0_11":true,"hour1_12":true},aRelativeScales:["hour","minute","second"],aRelativeParseScales:["year","quarter","month","week","day","hour","minute","second"],aIntervalCompareFields:["Hours","Minutes","Seconds"]};D.getInstance=function(F,o){return this.getDateInstance(F,o);};D.getDateInstance=function(F,o){return this.createInstance(F,o,this.oDateInfo);};D.getDateTimeInstance=function(F,o){return this.createInstance(F,o,this.oDateTimeInfo);};D.getTimeInstance=function(F,o){return this.createInstance(F,o,this.oTimeInfo);};D.createInstance=function(F,o,i){var b=Object.create(this.prototype);if(F instanceof L){o=F;F=undefined;}if(!o){o=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();}b.oLocale=o;b.oLocaleData=a.getInstance(o);b.oFormatOptions=q.extend(false,{},i.oDefaultFormatOptions,F);if(!b.oFormatOptions.calendarType){b.oFormatOptions.calendarType=sap.ui.getCore().getConfiguration().getCalendarType();}if(!b.oFormatOptions.pattern){if(b.oFormatOptions.format){b.oFormatOptions.pattern=b.oLocaleData.getCustomDateTimePattern(b.oFormatOptions.format,b.oFormatOptions.calendarType);}else{b.oFormatOptions.pattern=i.getPattern(b.oLocaleData,b.oFormatOptions.style,b.oFormatOptions.calendarType);}}if(!b.oFormatOptions.fallback){if(!i.oFallbackFormats){i.oFallbackFormats={};}var s=o.toString(),d=b.oFormatOptions.calendarType,k=s+"-"+d,p,e;if(b.oFormatOptions.pattern&&i.bPatternFallbackWithoutDelimiter){k=k+"-"+b.oFormatOptions.pattern;}if(!i.oFallbackFormats[k]){e=i.aFallbackFormatOptions;if(i.bShortFallbackFormatOptions){p=i.getPattern(b.oLocaleData,"short");e=e.concat(D._createFallbackOptionsWithoutDelimiter(p));}if(b.oFormatOptions.pattern&&i.bPatternFallbackWithoutDelimiter){e=D._createFallbackOptionsWithoutDelimiter(b.oFormatOptions.pattern).concat(e);}i.oFallbackFormats[k]=D._createFallbackFormat(e,d,o,i);}b.aFallbackFormats=i.oFallbackFormats[k];}b.oRequiredParts=i.oRequiredParts;b.aRelativeScales=i.aRelativeScales;b.aRelativeParseScales=i.aRelativeParseScales;b.aIntervalCompareFields=i.aIntervalCompareFields;b.init();return b;};D.prototype.init=function(){var s=this.oFormatOptions.calendarType;this.aMonthsAbbrev=this.oLocaleData.getMonths("abbreviated",s);this.aMonthsWide=this.oLocaleData.getMonths("wide",s);this.aMonthsNarrow=this.oLocaleData.getMonths("narrow",s);this.aMonthsAbbrevSt=this.oLocaleData.getMonthsStandAlone("abbreviated",s);this.aMonthsWideSt=this.oLocaleData.getMonthsStandAlone("wide",s);this.aMonthsNarrowSt=this.oLocaleData.getMonthsStandAlone("narrow",s);this.aDaysAbbrev=this.oLocaleData.getDays("abbreviated",s);this.aDaysWide=this.oLocaleData.getDays("wide",s);this.aDaysNarrow=this.oLocaleData.getDays("narrow",s);this.aDaysShort=this.oLocaleData.getDays("short",s);this.aDaysAbbrevSt=this.oLocaleData.getDaysStandAlone("abbreviated",s);this.aDaysWideSt=this.oLocaleData.getDaysStandAlone("wide",s);this.aDaysNarrowSt=this.oLocaleData.getDaysStandAlone("narrow",s);this.aDaysShortSt=this.oLocaleData.getDaysStandAlone("short",s);this.aQuartersAbbrev=this.oLocaleData.getQuarters("abbreviated",s);this.aQuartersWide=this.oLocaleData.getQuarters("wide",s);this.aQuartersNarrow=this.oLocaleData.getQuarters("narrow",s);this.aQuartersAbbrevSt=this.oLocaleData.getQuartersStandAlone("abbreviated",s);this.aQuartersWideSt=this.oLocaleData.getQuartersStandAlone("wide",s);this.aQuartersNarrowSt=this.oLocaleData.getQuartersStandAlone("narrow",s);this.aErasNarrow=this.oLocaleData.getEras("narrow",s);this.aErasAbbrev=this.oLocaleData.getEras("abbreviated",s);this.aErasWide=this.oLocaleData.getEras("wide",s);this.aDayPeriods=this.oLocaleData.getDayPeriods("abbreviated",s);this.aFormatArray=this.parseCldrDatePattern(this.oFormatOptions.pattern);this.sAllowedCharacters=this.getAllowedCharacters(this.aFormatArray);};D._createFallbackFormat=function(F,s,o,i){return F.map(function(b){b.calendarType=s;b.fallback=true;var d=D.createInstance(b,o,i);d.bIsFallback=true;return d;});};D._createFallbackOptionsWithoutDelimiter=function(b){var r=/[^dMyGU]/g,d={regex:/d+/g,replace:"dd"},m={regex:/M+/g,replace:"MM"},y={regex:/[yU]+/g,replace:["yyyy","yy"]};b=b.replace(r,"");b=b.replace(d.regex,d.replace);b=b.replace(m.regex,m.replace);return y.replace.map(function(R){return{pattern:b.replace(y.regex,R),strictParsing:true};});};D.prototype.oSymbols={"":{name:"text",format:function(F,d,u,o){return F.value;}},"G":{name:"era",format:function(F,d,u,o){var e=u?d.getUTCEra():d.getEra();if(F.digits<=3){return o.aErasAbbrev[e];}else if(F.digits===4){return o.aErasWide[e];}else{return o.aErasNarrow[e];}}},"y":{name:"year",format:function(F,d,u,o){var y=u?d.getUTCFullYear():d.getFullYear();var Y=String(y);var s=o.oFormatOptions.calendarType;if(F.digits==2&&Y.length>2){Y=Y.substr(Y.length-2);}if(s!=C.Japanese&&F.digits==1&&y<100){Y=q.sap.padLeft(Y,"0",4);}return q.sap.padLeft(Y,"0",F.digits);}},"Y":{name:"weekYear",format:function(F,d,u,o){var w=u?d.getUTCWeek():d.getWeek();var W=w.year;var s=String(W);var b=o.oFormatOptions.calendarType;if(F.digits==2&&s.length>2){s=s.substr(s.length-2);}if(b!=C.Japanese&&F.digits==1&&W<100){s=q.sap.padLeft(s,"0",4);}return q.sap.padLeft(s,"0",F.digits);}},"M":{name:"month",format:function(F,d,u,o){var m=u?d.getUTCMonth():d.getMonth();if(F.digits==3){return o.aMonthsAbbrev[m];}else if(F.digits==4){return o.aMonthsWide[m];}else if(F.digits>4){return o.aMonthsNarrow[m];}else{return q.sap.padLeft(String(m+1),"0",F.digits);}}},"L":{name:"monthStandalone",format:function(F,d,u,o){var m=u?d.getUTCMonth():d.getMonth();if(F.digits==3){return o.aMonthsAbbrevSt[m];}else if(F.digits==4){return o.aMonthsWideSt[m];}else if(F.digits>4){return o.aMonthsNarrowSt[m];}else{return q.sap.padLeft(String(m+1),"0",F.digits);}}},"w":{name:"weekInYear",format:function(F,d,u,o){var w=u?d.getUTCWeek():d.getWeek();var W=w.week;var s=String(W+1);if(F.digits<3){s=q.sap.padLeft(s,"0",F.digits);}else{s=o.oLocaleData.getCalendarWeek(F.digits===3?"narrow":"wide",q.sap.padLeft(s,"0",2));}return s;}},"W":{name:"weekInMonth",format:function(F,d,u,o){return"";}},"D":{name:"dayInYear",format:function(F,d,u,o){}},"d":{name:"day",format:function(F,d,u,o){var i=u?d.getUTCDate():d.getDate();return q.sap.padLeft(String(i),"0",F.digits);}},"Q":{name:"quarter",format:function(F,d,u,o){var m=u?d.getUTCMonth():d.getMonth();var Q=Math.floor(m/3);if(F.digits==3){return o.aQuartersAbbrev[Q];}else if(F.digits==4){return o.aQuartersWide[Q];}else if(F.digits>4){return o.aQuartersNarrow[Q];}else{return q.sap.padLeft(String(Q+1),"0",F.digits);}}},"q":{name:"quarterStandalone",format:function(F,d,u,o){var m=u?d.getUTCMonth():d.getMonth();var Q=Math.floor(m/3);if(F.digits==3){return o.aQuartersAbbrevSt[Q];}else if(F.digits==4){return o.aQuartersWideSt[Q];}else if(F.digits>4){return o.aQuartersNarrowSt[Q];}else{return q.sap.padLeft(String(Q+1),"0",F.digits);}}},"F":{name:"dayOfWeekInMonth",format:function(F,d,u,o){return"";}},"E":{name:"dayNameInWeek",format:function(F,d,u,o){var i=u?d.getUTCDay():d.getDay();if(F.digits<4){return o.aDaysAbbrev[i];}else if(F.digits==4){return o.aDaysWide[i];}else if(F.digits==5){return o.aDaysNarrow[i];}else{return o.aDaysShort[i];}}},"c":{name:"dayNameInWeekStandalone",format:function(F,d,u,o){var i=u?d.getUTCDay():d.getDay();if(F.digits<4){return o.aDaysAbbrevSt[i];}else if(F.digits==4){return o.aDaysWideSt[i];}else if(F.digits==5){return o.aDaysNarrowSt[i];}else{return o.aDaysShortSt[i];}}},"u":{name:"dayNumberOfWeek",format:function(F,d,u,o){var i=u?d.getUTCDay():d.getDay();var b=o.oLocaleData.getFirstDayOfWeek();var e=i-(b-1);if(e<=0){e+=7;}return e;}},"a":{name:"amPmMarker",format:function(F,d,u,o){var h=u?d.getUTCHours():d.getHours();var i=h<12?0:1;return o.aDayPeriods[i];}},"H":{name:"hour0_23",format:function(F,d,u,o){var h=u?d.getUTCHours():d.getHours();return q.sap.padLeft(String(h),"0",F.digits);}},"k":{name:"hour1_24",format:function(F,d,u,o){var h=u?d.getUTCHours():d.getHours();var H=(h===0?"24":String(h));return q.sap.padLeft(H,"0",F.digits);}},"K":{name:"hour0_11",format:function(F,d,u,o){var h=u?d.getUTCHours():d.getHours();var H=String(h>11?h-12:h);return q.sap.padLeft(H,"0",F.digits);}},"h":{name:"hour1_12",format:function(F,d,u,o){var h=u?d.getUTCHours():d.getHours();var H;if(h>12){H=String(h-12);}else if(h==0){H="12";}else{H=String(h);}return q.sap.padLeft(H,"0",F.digits);}},"m":{name:"minute",format:function(F,d,u,o){var m=u?d.getUTCMinutes():d.getMinutes();return q.sap.padLeft(String(m),"0",F.digits);}},"s":{name:"second",format:function(F,d,u,o){var s=u?d.getUTCSeconds():d.getSeconds();return q.sap.padLeft(String(s),"0",F.digits);}},"S":{name:"fractionalsecond",format:function(F,d,u,o){var m=u?d.getUTCMilliseconds():d.getMilliseconds();var M=String(m);var s=q.sap.padLeft(M,"0",3);s=s.substr(0,F.digits);s=q.sap.padRight(s,"0",F.digits);return s;}},"z":{name:"timezoneGeneral",format:function(F,d,u,o){if(F.digits>3&&d.getTimezoneLong()){return d.getTimezoneLong();}else if(d.getTimezoneShort()){return d.getTimezoneShort();}var t="GMT";var T=Math.abs(d.getTimezoneOffset());var p=d.getTimezoneOffset()>0;var h=Math.floor(T/60);var m=T%60;if(!u&&T!=0){t+=(p?"-":"+");t+=q.sap.padLeft(String(h),"0",2);t+=":";t+=q.sap.padLeft(String(m),"0",2);}else{t+="Z";}return t;}},"Z":{name:"timezoneRFC822",format:function(F,d,u,o){var t=Math.abs(d.getTimezoneOffset());var p=d.getTimezoneOffset()>0;var h=Math.floor(t/60);var m=t%60;var T="";if(!u&&t!=0){T+=(p?"-":"+");T+=q.sap.padLeft(String(h),"0",2);T+=q.sap.padLeft(String(m),"0",2);}return T;}},"X":{name:"timezoneISO8601",format:function(F,d,u,o){var t=Math.abs(d.getTimezoneOffset());var p=d.getTimezoneOffset()>0;var h=Math.floor(t/60);var m=t%60;var T="";if(!u&&t!=0){T+=(p?"-":"+");T+=q.sap.padLeft(String(h),"0",2);T+=":";T+=q.sap.padLeft(String(m),"0",2);}else{T+="Z";}return T;}}};D.prototype._format=function(j,u){if(this.oFormatOptions.relative){var r=this.formatRelative(j,u,this.oFormatOptions.relativeRange);if(r){return r;}}var s=this.oFormatOptions.calendarType;var d=U.getInstance(j,s);var b=[],p,R,S;for(var i=0;i<this.aFormatArray.length;i++){p=this.aFormatArray[i];S=p.symbol||"";b.push(this.oSymbols[S].format(p,d,u,this));}R=b.join("");if(sap.ui.getCore().getConfiguration().getOriginInfo()){R=new String(R);R.originInfo={source:"Common Locale Data Repository",locale:this.oLocale.toString(),style:this.oFormatOptions.style,pattern:this.oFormatOptions.pattern};}return R;};D.prototype.format=function(j,u){if(u===undefined){u=this.oFormatOptions.UTC;}if(Array.isArray(j)){if(!this.oFormatOptions.interval){q.sap.log.error("Non-interval DateFormat can't format more than one date instance.");return"";}if(j.length!==2){q.sap.log.error("Interval DateFormat can only format with 2 date instances but "+j.length+" is given.");return"";}var v=j.every(function(J){return J&&!isNaN(J.getTime());});if(!v){q.sap.log.error("At least one date instance which is passed to the interval DateFormat isn't valid.");return"";}return this._formatInterval(j,u);}else{if(!j||isNaN(j.getTime())){q.sap.log.error("The given date instance isn't valid.");return"";}if(this.oFormatOptions.interval){q.sap.log.error("Interval DateFormat expects an array with two dates for the first argument but only one date is given.");return"";}return this._format(j,u);}};D.prototype._formatInterval=function(j,u){var s=this.oFormatOptions.calendarType;var F=U.getInstance(j[0],s);var t=U.getInstance(j[1],s);var d;var p;var S;var b=[];var P;var e=this._getGreatestDiffField(j,u);if(!e){return this._format(j[0],u);}if(this.oFormatOptions.format){P=this.oLocaleData.getCustomIntervalPattern(this.oFormatOptions.format,e,s);}else{P=this.oLocaleData.getCombinedIntervalPattern(this.oFormatOptions.pattern,s);}this.aFormatArray=this.parseCldrDatePattern(P);d=F;for(var i=0;i<this.aFormatArray.length;i++){p=this.aFormatArray[i];S=p.symbol||"";if(p.repeat){d=t;}b.push(this.oSymbols[S].format(p,d,u,this));}return b.join("");};var f={"FullYear":{group:"Year"},"Month":{group:"Month"},"Date":{group:"Day"},"Hours":{group:"Hour"},"Minutes":{group:"Minute"},"Seconds":{group:"Second"}};D.prototype._getGreatestDiffField=function(j,u){var F;var t;var s;var b;var d=this.aIntervalCompareFields.some(function(e,i){var m="get"+(u?"UTC":"")+e;F=j[0][m].apply(j[0]);t=j[1][m].apply(j[1]);if(F!==t){s=e;return true;}});if(d){b=f[s].group;if(b==="Hour"){if((F<12&&t>=12)||(t<12&&F>=12)){b="a";}}return b;}else{return null;}};D.prototype.parse=function(v,u,s){if(u===undefined){u=this.oFormatOptions.UTC;}if(s===undefined){s=this.oFormatOptions.strictParsing;}var d,I=0,b=null,m=null,y=null,w=null,W=null,e=null,E=null,h=null,M=null,S=null,g=null,Q=null,p,P,k,t=null,V=true,F,n,o=this.aErasWide.length-1,r=this.oRequiredParts,x=this.oFormatOptions.calendarType,z=[this.aDaysWide,this.aDaysWideSt,this.aDaysAbbrev,this.aDaysAbbrevSt,this.aDaysShort,this.aDaysShortSt,this.aDaysNarrow,this.aDaysNarrowSt],A=[this.aMonthsWide,this.aMonthsWideSt,this.aMonthsAbbrev,this.aMonthsAbbrevSt,this.aMonthsNarrow,this.aMonthsNarrowSt],B=[this.aQuartersWide,this.aQuartersWideSt,this.aQuartersAbbrev,this.aQuartersAbbrevSt,this.aQuartersNarrow,this.aQuartersNarrowSt],G=[this.aErasWide,this.aErasAbbrev,this.aErasNarrow];function H(j){return j>=48&&j<=57;}function J(j){var i1=0;while(i1<j&&H(v.charCodeAt(I+i1))){i1++;}return v.substr(I,i1);}function K(i1){var j1=-1,k1=0;for(var j=0;j<i1.length;j++){if(i1[j]&&i1[j].length>k1&&v.indexOf(i1[j],I)==I){j1=j;k1=i1[j].length;}}return{index:j1,value:j1===-1?null:i1[j1]};}function N(j){var i1=v.charAt(I)=="+"?-1:1;I++;k=J(2);var j1=parseInt(k,10);I=I+2;if(j){I++;}k=J(2);I=I+2;t=parseInt(k,10);t=(t+60*j1)*i1;}function O(j,i1){if(j in r&&i1){V=false;}}function R(j){F=K(j);if(F.index!==-1){I+=F.value.length;return true;}}v=q.trim(v);var T=this.parseRelative(v,u);if(T){return T;}for(var i=0;i<this.aFormatArray.length;i++){P=this.aFormatArray[i];switch(P.type){case"text":if(v.indexOf(P.value,I)==I){I+=P.value.length;}else{O(P.type,this.aFormatArray[i+1].type in r);}break;case"day":k=J(Math.max(P.digits,2));O(P.type,k==="");I+=k.length;b=parseInt(k,10);if(s&&(b>31||b<1)){V=false;}break;case"dayNameInWeek":case"dayNameInWeekStandalone":z.some(R);break;case"dayNumberOfWeek":k=J(P.digits);I+=k.length;e=parseInt(k,10);break;case"month":case"monthStandalone":if(P.digits<3){k=J(Math.max(P.digits,2));O(P.type,k==="");m=parseInt(k,10)-1;I+=k.length;if(s&&(m>11||m<0)){V=false;}}else{n=A.some(R);if(n){m=F.index;}else{O(P.type,true);}}break;case"quarter":case"quarterStandalone":if(P.digits<3){k=J(Math.max(P.digits,2));O(P.type,k==="");Q=parseInt(k,10)-1;I+=k.length;if(s&&Q>3){V=false;}}else{n=B.some(R);if(n){Q=F.index;}else{O(P.type,true);}}break;case"era":n=G.some(R);if(n){E=F.index;}else{O(P.type,true);E=o;}break;case"year":if(P.digits==1){k=J(4);}else if(P.digits==2){k=J(2);}else{k=J(P.digits);}I+=k.length;O(P.type,k==="");y=parseInt(k,10);if(x!=C.Japanese&&k.length<=2){var X=U.getInstance(new Date(),x),Y=X.getFullYear(),Z=Math.floor(Y/100),$=Z*100+y-Y;if($<-70){y+=(Z+1)*100;}else if($<30){y+=Z*100;}else{y+=(Z-1)*100;}}break;case"weekYear":if(P.digits==1){k=J(4);}else if(P.digits==2){k=J(2);}else{k=J(P.digits);}I+=k.length;O(P.type,k==="");y=parseInt(k,10);if(x!=C.Japanese&&k.length<=2){var X=U.getInstance(new Date(),x),Y=X.getFullYear(),Z=Math.floor(Y/100),$=Z*100+w-Y;if($<-70){w+=(Z+1)*100;}else if($<30){w+=Z*100;}else{w+=(Z-1)*100;}}break;case"weekInYear":if(P.digits<3){k=J(2);W=parseInt(k,10)-1;I+=k.length;O(P.type,!k);}else{k=this.oLocaleData.getCalendarWeek(P.digits===3?"narrow":"wide");k=k.replace("{0}","[0-9]+");var _=new RegExp(k),a1=_.exec(v.substring(I));if(a1){I+=a1[0].length;W=parseInt(a1[0],10)-1;}else{O(P.type,true);}}break;case"hour0_23":k=J(Math.max(P.digits,2));O(P.type,k==="");I+=k.length;h=parseInt(k,10);if(s&&h>23){V=false;}break;case"hour1_24":k=J(Math.max(P.digits,2));O(P.type,k==="");I+=k.length;h=parseInt(k,10);if(h==24){h=0;}if(s&&h>23){V=false;}break;case"hour0_11":k=J(Math.max(P.digits,2));O(P.type,k==="");I+=k.length;h=parseInt(k,10);if(s&&h>11){V=false;}break;case"hour1_12":k=J(Math.max(P.digits,2));O(P.type,k==="");I+=k.length;h=parseInt(k,10);if(h==12){h=0;p=(p===undefined)?true:p;}if(s&&h>11){V=false;}break;case"minute":k=J(Math.max(P.digits,2));O(P.type,k==="");I+=k.length;M=parseInt(k,10);if(s&&M>59){V=false;}break;case"second":k=J(Math.max(P.digits,2));O(P.type,k==="");I+=k.length;S=parseInt(k,10);if(s&&S>59){V=false;}break;case"fractionalsecond":k=J(P.digits);I+=k.length;k=k.substr(0,3);k=q.sap.padRight(k,"0",3);g=parseInt(k,10);break;case"amPmMarker":var b1=this.aDayPeriods[0],c1=this.aDayPeriods[1];var d1=/[aApP](?:\.)?[mM](?:\.)?/;var e1=v.substring(I);var f1=e1.match(d1);var g1=(f1&&f1.index===0);if(g1){e1=f1[0].replace(/\./g,"").toLowerCase()+e1.substring(f1[0].length);b1=b1.toLowerCase();c1=c1.toLowerCase();}if(e1.indexOf(b1)==0){p=false;I+=(g1?f1[0].length:b1.length);}else if(e1.indexOf(c1)==0){p=true;I+=(g1?f1[0].length:c1.length);}break;case"timezoneGeneral":var h1=v.substring(I,I+3);if(h1==="GMT"||h1==="UTC"){I=I+3;}else if(v.substring(I,I+2)==="UT"){I=I+2;}else if(v.charAt(I)=="Z"){I=I+1;t=0;break;}else{q.sap.log.error(v+" cannot be parsed correcly by sap.ui.core.format.DateFormat: The given timezone is not supported!");break;}case"timezoneISO8601":if(v.charAt(I)=="Z"){I=I+1;t=0;break;}N(true);break;case"timezoneRFC822":N(false);break;}if(!V){break;}}if(I<v.length){V=false;}if(p){h+=12;}if(Q!==null&&m===null&&b===null){m=3*Q;b=1;}if(V){if(u||t!=null){d=U.getInstance(new Date(0),x);d.setUTCEra(E||U.getCurrentEra(x));d.setUTCFullYear(y||1970);d.setUTCMonth(m||0);d.setUTCDate(b||1);d.setUTCHours(h||0);d.setUTCMinutes(M||0);d.setUTCSeconds(S||0);d.setUTCMilliseconds(g||0);if(s&&(b||1)!==d.getUTCDate()){V=false;d=undefined;}else{if(t){d.setUTCMinutes((M||0)+t);}if(W!==null){d.setUTCWeek({year:w||y,week:W});if(e!==null){d.setUTCDate(d.getUTCDate()+e-1);}}}}else{d=U.getInstance(new Date(1970,0,1,0,0,0),x);d.setEra(E||U.getCurrentEra(x));d.setFullYear(y||1970);d.setMonth(m||0);d.setDate(b||1);d.setHours(h||0);d.setMinutes(M||0);d.setSeconds(S||0);d.setMilliseconds(g||0);if(s&&(b||1)!==d.getDate()){V=false;d=undefined;}else if(W!==null){d.setWeek({year:w||y,week:W});if(e!==null){d.setDate(d.getDate()+e-1);}}}if(V){d=d.getJSDate();return d;}}if(!this.bIsFallback){q.each(this.aFallbackFormats,function(i,j){d=j.parse(v,u,s);if(d){return false;}});return d;}return null;};D.prototype.parseCldrDatePattern=function(p){if(c[p]){return c[p];}var F=[],i,Q=false,o=null,s="",n="",A={},I=false;for(i=0;i<p.length;i++){var b=p.charAt(i),N,P,d;if(Q){if(b=="'"){P=p.charAt(i-1);d=p.charAt(i-2);N=p.charAt(i+1);if(P=="'"&&d!="'"){Q=false;}else if(N=="'"){i+=1;}else{Q=false;continue;}}if(s=="text"){o.value+=b;}else{o={type:"text",value:b};F.push(o);s="text";}}else{if(b=="'"){Q=true;}else if(this.oSymbols[b]){n=this.oSymbols[b].name;if(s==n){o.digits++;}else{o={type:n,symbol:b,digits:1};F.push(o);s=n;if(!I){if(A[n]){o.repeat=true;I=true;}else{A[n]=true;}}}}else{if(s=="text"){o.value+=b;}else{o={type:"text",value:b};F.push(o);s="text";}}}}c[p]=F;return F;};D.prototype.parseRelative=function(v,u){var p,e,r,R,V;if(!v){return null;}p=this.oLocaleData.getRelativePatterns(this.aRelativeParseScales,this.oFormatOptions.relativeStyle);for(var i=0;i<p.length;i++){e=p[i];r=new RegExp("^\\s*"+e.pattern.replace(/\{0\}/,"(\\d+)")+"\\s*$","i");R=r.exec(v);if(R){if(e.value!==undefined){return b(e.value,e.scale);}else{V=parseInt(R[1],10);return b(V*e.sign,e.scale);}}}function b(d,s){var t,T=new Date(),j;if(u){t=T.getTime();}else{t=Date.UTC(T.getFullYear(),T.getMonth(),T.getDate(),T.getHours(),T.getMinutes(),T.getSeconds(),T.getMilliseconds());}j=new Date(t);switch(s){case"second":j.setUTCSeconds(j.getUTCSeconds()+d);break;case"minute":j.setUTCMinutes(j.getUTCMinutes()+d);break;case"hour":j.setUTCHours(j.getUTCHours()+d);break;case"day":j.setUTCDate(j.getUTCDate()+d);break;case"week":j.setUTCDate(j.getUTCDate()+d*7);break;case"month":j.setUTCMonth(j.getUTCMonth()+d);break;case"quarter":j.setUTCMonth(j.getUTCMonth()+d*3);break;case"year":j.setUTCFullYear(j.getUTCFullYear()+d);break;}if(u){return j;}else{return new Date(j.getUTCFullYear(),j.getUTCMonth(),j.getUTCDate(),j.getUTCHours(),j.getUTCMinutes(),j.getUTCSeconds(),j.getUTCMilliseconds());}}};D.prototype.formatRelative=function(j,u,r){var t=new Date(),s=this.oFormatOptions.relativeScale||"day",T,d,i,p,b;b=(j.getTime()-t.getTime())/1000;if(this.oFormatOptions.relativeScale=="auto"){s=this._getScale(b,this.aRelativeScales);}if(!r){r=this._mRanges[s];}if(s=="year"||s=="month"||s=="day"){T=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate());if(u){d=Date.UTC(j.getUTCFullYear(),j.getUTCMonth(),j.getUTCDate());}else{d=Date.UTC(j.getFullYear(),j.getMonth(),j.getDate());}b=(d-T)/1000;}i=this._getDifference(s,b);if(this.oFormatOptions.relativeScale!="auto"&&(i<r[0]||i>r[1])){return null;}p=this.oLocaleData.getRelativePattern(s,i,b>0,this.oFormatOptions.relativeStyle);return q.sap.formatMessage(p,[Math.abs(i)]);};D.prototype._mRanges={second:[-60,60],minute:[-60,60],hour:[-24,24],day:[-6,6],week:[-4,4],month:[-12,12],year:[-10,10]};D.prototype._mScales={second:1,minute:60,hour:3600,day:86400,week:604800,month:2592000,quarter:7776000,year:31536000};D.prototype._getScale=function(d,s){var S,t;d=Math.abs(d);for(var i=0;i<s.length;i++){t=s[i];if(d>=this._mScales[t]){S=t;break;}}if(!S){S=s[s.length-1];}return S;};D.prototype._getDifference=function(s,d){var S=this._mScales[s],i=d/S;if(d>0){i=Math.floor(i);}else{i=Math.ceil(i);}return i;};D.prototype.getAllowedCharacters=function(F){if(this.oFormatOptions.relative){return"";}var A="";var n=false;var b=false;var p;for(var i=0;i<this.aFormatArray.length;i++){p=this.aFormatArray[i];switch(p.type){case"text":if(A.indexOf(p.value)<0){A+=p.value;}break;case"day":case"year":case"weekYear":case"dayNumberOfWeek":case"weekInYear":case"hour0_23":case"hour1_24":case"hour0_11":case"hour1_12":case"minute":case"second":case"fractionalsecond":if(!n){A+="0123456789";n=true;}break;case"month":case"monthStandalone":if(p.digits<3){if(!n){A+="0123456789";n=true;}}else{b=true;}break;default:b=true;break;}}if(b){A="";}return A;};return D;},true);
