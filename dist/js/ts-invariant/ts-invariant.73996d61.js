import{b as r}from"../tslib/tslib.cdb03bbf.js";var n="Invariant Violation",o=Object.setPrototypeOf,t=void 0===o?function(r,n){return r.__proto__=n,r}:o,e=function(o){function e(r){void 0===r&&(r=n);var i=o.call(this,"number"==typeof r?n+": "+r+" (see https://github.com/apollographql/invariant-packages)":r)||this;return i.framesToPop=1,i.name=n,t(i,e.prototype),i}return r(e,o),e}(Error);function i(r,n){if(!r)throw new e(n)}var u,c=["debug","log","warn","error","silent"],a=c.indexOf("log");function l(r){return function(){if(c.indexOf(r)>=a)return(console[r]||console.log).apply(console,arguments)}}function s(r){try{return r()}catch(n){}}(u=i||(i={})).debug=l("debug"),u.log=l("log"),u.warn=l("warn"),u.error=l("error");var f=s((function(){return globalThis}))||s((function(){return window}))||s((function(){return self}))||s((function(){return global}))||s((function(){return s.constructor("return this")()})),p=!1;function b(){p&&(delete f.process,p=!1)}!f||s((function(){return"production"}))||s((function(){return process}))||(Object.defineProperty(f,"process",{value:{env:{NODE_ENV:"production"}},configurable:!0,enumerable:!1,writable:!0}),p=!0);export{e as I,i,b as r};
