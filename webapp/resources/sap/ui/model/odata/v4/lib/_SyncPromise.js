/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";function S(p,c,v,R){var f=false,P,b=false,t=this,a=t;function d(){if(P===0){a=v;f=true;}}if(R){a=p;b=true;}else if(v){P=v.length;d();v.forEach(function(V,i){r(V).then(function(g){v[i]=g;P-=1;d();},function(g){if(!b){a=g;b=true;}});});}else if(typeof c==="function"){try{a=c(p.getResult());f=true;p=null;if(a instanceof Promise||a instanceof S){return new S(a);}}catch(e){a=e;b=true;p=null;}}else if(p instanceof Promise||p instanceof S){p.then(function(g){a=g;f=true;p=null;},function(g){a=g;b=true;p=null;});}else{a=p;f=true;}this.catch=function(o){return this.then(undefined,o);};this.getResult=function(){return a;};this.isFulfilled=function(){return f;};this.isPending=function(){return a===this;};this.isRejected=function(){return b;};this.then=function(o,O){if(f||b){return new S(t,f?o:O);}if(!p){p=Promise.all(v);}return new S(p.then(o,O));};this.toString=function(){if(this.isPending()){return"SyncPromise: pending";}return String(this.getResult());};}function r(p){return p instanceof S?p:new S(p);}return{all:function(v){return new S(null,null,v.slice());},createGetMethod:function(f,t){return function(){var s=this[f].apply(this,arguments);if(s.isFulfilled()){return s.getResult();}else if(t){throw s.isRejected()?s.getResult():new Error("Result pending");}};},createRequestMethod:function(f){return function(){return Promise.resolve(this[f].apply(this,arguments));};},reject:function(R){return new S(R,null,null,true);},resolve:r};});
