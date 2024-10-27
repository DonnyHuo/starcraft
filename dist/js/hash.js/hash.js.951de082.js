import{g as t}from"../aes-js/aes-js.52245d71.js";import{m as i}from"../minimalistic-assert/minimalistic-assert.62310433.js";import{i as h}from"../inherits/inherits.e883a70c.js";var n={},r={},s=i,e=h;function o(t,i){return 55296==(64512&t.charCodeAt(i))&&(!(i<0||i+1>=t.length)&&56320==(64512&t.charCodeAt(i+1)))}function u(t){return(t>>>24|t>>>8&65280|t<<8&16711680|(255&t)<<24)>>>0}function a(t){return 1===t.length?"0"+t:t}function c(t){return 7===t.length?"0"+t:6===t.length?"00"+t:5===t.length?"000"+t:4===t.length?"0000"+t:3===t.length?"00000"+t:2===t.length?"000000"+t:1===t.length?"0000000"+t:t}r.inherits=e,r.toArray=function(t,i){if(Array.isArray(t))return t.slice();if(!t)return[];var h=[];if("string"==typeof t)if(i){if("hex"===i)for((t=t.replace(/[^a-z0-9]+/gi,"")).length%2!=0&&(t="0"+t),r=0;r<t.length;r+=2)h.push(parseInt(t[r]+t[r+1],16))}else for(var n=0,r=0;r<t.length;r++){var s=t.charCodeAt(r);s<128?h[n++]=s:s<2048?(h[n++]=s>>6|192,h[n++]=63&s|128):o(t,r)?(s=65536+((1023&s)<<10)+(1023&t.charCodeAt(++r)),h[n++]=s>>18|240,h[n++]=s>>12&63|128,h[n++]=s>>6&63|128,h[n++]=63&s|128):(h[n++]=s>>12|224,h[n++]=s>>6&63|128,h[n++]=63&s|128)}else for(r=0;r<t.length;r++)h[r]=0|t[r];return h},r.toHex=function(t){for(var i="",h=0;h<t.length;h++)i+=a(t[h].toString(16));return i},r.htonl=u,r.toHex32=function(t,i){for(var h="",n=0;n<t.length;n++){var r=t[n];"little"===i&&(r=u(r)),h+=c(r.toString(16))}return h},r.zero2=a,r.zero8=c,r.join32=function(t,i,h,n){var r=h-i;s(r%4==0);for(var e=new Array(r/4),o=0,u=i;o<e.length;o++,u+=4){var a;a="big"===n?t[u]<<24|t[u+1]<<16|t[u+2]<<8|t[u+3]:t[u+3]<<24|t[u+2]<<16|t[u+1]<<8|t[u],e[o]=a>>>0}return e},r.split32=function(t,i){for(var h=new Array(4*t.length),n=0,r=0;n<t.length;n++,r+=4){var s=t[n];"big"===i?(h[r]=s>>>24,h[r+1]=s>>>16&255,h[r+2]=s>>>8&255,h[r+3]=255&s):(h[r+3]=s>>>24,h[r+2]=s>>>16&255,h[r+1]=s>>>8&255,h[r]=255&s)}return h},r.rotr32=function(t,i){return t>>>i|t<<32-i},r.rotl32=function(t,i){return t<<i|t>>>32-i},r.sum32=function(t,i){return t+i>>>0},r.sum32_3=function(t,i,h){return t+i+h>>>0},r.sum32_4=function(t,i,h,n){return t+i+h+n>>>0},r.sum32_5=function(t,i,h,n,r){return t+i+h+n+r>>>0},r.sum64=function(t,i,h,n){var r=t[i],s=n+t[i+1]>>>0,e=(s<n?1:0)+h+r;t[i]=e>>>0,t[i+1]=s},r.sum64_hi=function(t,i,h,n){return(i+n>>>0<i?1:0)+t+h>>>0},r.sum64_lo=function(t,i,h,n){return i+n>>>0},r.sum64_4_hi=function(t,i,h,n,r,s,e,o){var u=0,a=i;return u+=(a=a+n>>>0)<i?1:0,u+=(a=a+s>>>0)<s?1:0,t+h+r+e+(u+=(a=a+o>>>0)<o?1:0)>>>0},r.sum64_4_lo=function(t,i,h,n,r,s,e,o){return i+n+s+o>>>0},r.sum64_5_hi=function(t,i,h,n,r,s,e,o,u,a){var c=0,l=i;return c+=(l=l+n>>>0)<i?1:0,c+=(l=l+s>>>0)<s?1:0,c+=(l=l+o>>>0)<o?1:0,t+h+r+e+u+(c+=(l=l+a>>>0)<a?1:0)>>>0},r.sum64_5_lo=function(t,i,h,n,r,s,e,o,u,a){return i+n+s+o+a>>>0},r.rotr64_hi=function(t,i,h){return(i<<32-h|t>>>h)>>>0},r.rotr64_lo=function(t,i,h){return(t<<32-h|i>>>h)>>>0},r.shr64_hi=function(t,i,h){return t>>>h},r.shr64_lo=function(t,i,h){return(t<<32-h|i>>>h)>>>0};var l={},f=r,g=i;function p(){this.pending=null,this.pendingTotal=0,this.blockSize=this.constructor.blockSize,this.outSize=this.constructor.outSize,this.hmacStrength=this.constructor.hmacStrength,this.padLength=this.constructor.padLength/8,this.endian="big",this._delta8=this.blockSize/8,this._delta32=this.blockSize/32}l.BlockHash=p,p.prototype.update=function(t,i){if(t=f.toArray(t,i),this.pending?this.pending=this.pending.concat(t):this.pending=t,this.pendingTotal+=t.length,this.pending.length>=this._delta8){var h=(t=this.pending).length%this._delta8;this.pending=t.slice(t.length-h,t.length),0===this.pending.length&&(this.pending=null),t=f.join32(t,0,t.length-h,this.endian);for(var n=0;n<t.length;n+=this._delta32)this._update(t,n,n+this._delta32)}return this},p.prototype.digest=function(t){return this.update(this._pad()),g(null===this.pending),this._digest(t)},p.prototype._pad=function(){var t=this.pendingTotal,i=this._delta8,h=i-(t+this.padLength)%i,n=new Array(h+this.padLength);n[0]=128;for(var r=1;r<h;r++)n[r]=0;if(t<<=3,"big"===this.endian){for(var s=8;s<this.padLength;s++)n[r++]=0;n[r++]=0,n[r++]=0,n[r++]=0,n[r++]=0,n[r++]=t>>>24&255,n[r++]=t>>>16&255,n[r++]=t>>>8&255,n[r++]=255&t}else for(n[r++]=255&t,n[r++]=t>>>8&255,n[r++]=t>>>16&255,n[r++]=t>>>24&255,n[r++]=0,n[r++]=0,n[r++]=0,n[r++]=0,s=8;s<this.padLength;s++)n[r++]=0;return n};var d={},_={},v=r.rotr32;function m(t,i,h){return t&i^~t&h}function S(t,i,h){return t&i^t&h^i&h}function b(t,i,h){return t^i^h}_.ft_1=function(t,i,h,n){return 0===t?m(i,h,n):1===t||3===t?b(i,h,n):2===t?S(i,h,n):void 0},_.ch32=m,_.maj32=S,_.p32=b,_.s0_256=function(t){return v(t,2)^v(t,13)^v(t,22)},_.s1_256=function(t){return v(t,6)^v(t,11)^v(t,25)},_.g0_256=function(t){return v(t,7)^v(t,18)^t>>>3},_.g1_256=function(t){return v(t,17)^v(t,19)^t>>>10};var k=r,y=l,z=_,H=k.rotl32,w=k.sum32,x=k.sum32_5,A=z.ft_1,L=y.BlockHash,j=[1518500249,1859775393,2400959708,3395469782];function B(){if(!(this instanceof B))return new B;L.call(this),this.h=[1732584193,4023233417,2562383102,271733878,3285377520],this.W=new Array(80)}k.inherits(B,L);var W=B;B.blockSize=512,B.outSize=160,B.hmacStrength=80,B.padLength=64,B.prototype._update=function(t,i){for(var h=this.W,n=0;n<16;n++)h[n]=t[i+n];for(;n<h.length;n++)h[n]=H(h[n-3]^h[n-8]^h[n-14]^h[n-16],1);var r=this.h[0],s=this.h[1],e=this.h[2],o=this.h[3],u=this.h[4];for(n=0;n<h.length;n++){var a=~~(n/20),c=x(H(r,5),A(a,s,e,o),u,h[n],j[a]);u=o,o=e,e=H(s,30),s=r,r=c}this.h[0]=w(this.h[0],r),this.h[1]=w(this.h[1],s),this.h[2]=w(this.h[2],e),this.h[3]=w(this.h[3],o),this.h[4]=w(this.h[4],u)},B.prototype._digest=function(t){return"hex"===t?k.toHex32(this.h,"big"):k.split32(this.h,"big")};var C=r,T=l,I=_,q=i,D=C.sum32,E=C.sum32_4,F=C.sum32_5,G=I.ch32,J=I.maj32,K=I.s0_256,M=I.s1_256,N=I.g0_256,O=I.g1_256,P=T.BlockHash,Q=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];function R(){if(!(this instanceof R))return new R;P.call(this),this.h=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],this.k=Q,this.W=new Array(64)}C.inherits(R,P);var U=R;R.blockSize=512,R.outSize=256,R.hmacStrength=192,R.padLength=64,R.prototype._update=function(t,i){for(var h=this.W,n=0;n<16;n++)h[n]=t[i+n];for(;n<h.length;n++)h[n]=E(O(h[n-2]),h[n-7],N(h[n-15]),h[n-16]);var r=this.h[0],s=this.h[1],e=this.h[2],o=this.h[3],u=this.h[4],a=this.h[5],c=this.h[6],l=this.h[7];for(q(this.k.length===h.length),n=0;n<h.length;n++){var f=F(l,M(u),G(u,a,c),this.k[n],h[n]),g=D(K(r),J(r,s,e));l=c,c=a,a=u,u=D(o,f),o=e,e=s,s=r,r=D(f,g)}this.h[0]=D(this.h[0],r),this.h[1]=D(this.h[1],s),this.h[2]=D(this.h[2],e),this.h[3]=D(this.h[3],o),this.h[4]=D(this.h[4],u),this.h[5]=D(this.h[5],a),this.h[6]=D(this.h[6],c),this.h[7]=D(this.h[7],l)},R.prototype._digest=function(t){return"hex"===t?C.toHex32(this.h,"big"):C.split32(this.h,"big")};var V=r,X=U;function Y(){if(!(this instanceof Y))return new Y;X.call(this),this.h=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428]}V.inherits(Y,X);var Z=Y;Y.blockSize=512,Y.outSize=224,Y.hmacStrength=192,Y.padLength=64,Y.prototype._digest=function(t){return"hex"===t?V.toHex32(this.h.slice(0,7),"big"):V.split32(this.h.slice(0,7),"big")};var $=r,tt=l,it=i,ht=$.rotr64_hi,nt=$.rotr64_lo,rt=$.shr64_hi,st=$.shr64_lo,et=$.sum64,ot=$.sum64_hi,ut=$.sum64_lo,at=$.sum64_4_hi,ct=$.sum64_4_lo,lt=$.sum64_5_hi,ft=$.sum64_5_lo,gt=tt.BlockHash,pt=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591];function dt(){if(!(this instanceof dt))return new dt;gt.call(this),this.h=[1779033703,4089235720,3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,1541459225,327033209],this.k=pt,this.W=new Array(160)}$.inherits(dt,gt);var _t=dt;function vt(t,i,h,n,r){var s=t&h^~t&r;return s<0&&(s+=4294967296),s}function mt(t,i,h,n,r,s){var e=i&n^~i&s;return e<0&&(e+=4294967296),e}function St(t,i,h,n,r){var s=t&h^t&r^h&r;return s<0&&(s+=4294967296),s}function bt(t,i,h,n,r,s){var e=i&n^i&s^n&s;return e<0&&(e+=4294967296),e}function kt(t,i){var h=ht(t,i,28)^ht(i,t,2)^ht(i,t,7);return h<0&&(h+=4294967296),h}function yt(t,i){var h=nt(t,i,28)^nt(i,t,2)^nt(i,t,7);return h<0&&(h+=4294967296),h}function zt(t,i){var h=ht(t,i,14)^ht(t,i,18)^ht(i,t,9);return h<0&&(h+=4294967296),h}function Ht(t,i){var h=nt(t,i,14)^nt(t,i,18)^nt(i,t,9);return h<0&&(h+=4294967296),h}function wt(t,i){var h=ht(t,i,1)^ht(t,i,8)^rt(t,i,7);return h<0&&(h+=4294967296),h}function xt(t,i){var h=nt(t,i,1)^nt(t,i,8)^st(t,i,7);return h<0&&(h+=4294967296),h}function At(t,i){var h=ht(t,i,19)^ht(i,t,29)^rt(t,i,6);return h<0&&(h+=4294967296),h}function Lt(t,i){var h=nt(t,i,19)^nt(i,t,29)^st(t,i,6);return h<0&&(h+=4294967296),h}dt.blockSize=1024,dt.outSize=512,dt.hmacStrength=192,dt.padLength=128,dt.prototype._prepareBlock=function(t,i){for(var h=this.W,n=0;n<32;n++)h[n]=t[i+n];for(;n<h.length;n+=2){var r=At(h[n-4],h[n-3]),s=Lt(h[n-4],h[n-3]),e=h[n-14],o=h[n-13],u=wt(h[n-30],h[n-29]),a=xt(h[n-30],h[n-29]),c=h[n-32],l=h[n-31];h[n]=at(r,s,e,o,u,a,c,l),h[n+1]=ct(r,s,e,o,u,a,c,l)}},dt.prototype._update=function(t,i){this._prepareBlock(t,i);var h=this.W,n=this.h[0],r=this.h[1],s=this.h[2],e=this.h[3],o=this.h[4],u=this.h[5],a=this.h[6],c=this.h[7],l=this.h[8],f=this.h[9],g=this.h[10],p=this.h[11],d=this.h[12],_=this.h[13],v=this.h[14],m=this.h[15];it(this.k.length===h.length);for(var S=0;S<h.length;S+=2){var b=v,k=m,y=zt(l,f),z=Ht(l,f),H=vt(l,f,g,p,d),w=mt(l,f,g,p,d,_),x=this.k[S],A=this.k[S+1],L=h[S],j=h[S+1],B=lt(b,k,y,z,H,w,x,A,L,j),W=ft(b,k,y,z,H,w,x,A,L,j);b=kt(n,r),k=yt(n,r),y=St(n,r,s,e,o),z=bt(n,r,s,e,o,u);var C=ot(b,k,y,z),T=ut(b,k,y,z);v=d,m=_,d=g,_=p,g=l,p=f,l=ot(a,c,B,W),f=ut(c,c,B,W),a=o,c=u,o=s,u=e,s=n,e=r,n=ot(B,W,C,T),r=ut(B,W,C,T)}et(this.h,0,n,r),et(this.h,2,s,e),et(this.h,4,o,u),et(this.h,6,a,c),et(this.h,8,l,f),et(this.h,10,g,p),et(this.h,12,d,_),et(this.h,14,v,m)},dt.prototype._digest=function(t){return"hex"===t?$.toHex32(this.h,"big"):$.split32(this.h,"big")};var jt=r,Bt=_t;function Wt(){if(!(this instanceof Wt))return new Wt;Bt.call(this),this.h=[3418070365,3238371032,1654270250,914150663,2438529370,812702999,355462360,4144912697,1731405415,4290775857,2394180231,1750603025,3675008525,1694076839,1203062813,3204075428]}jt.inherits(Wt,Bt);var Ct=Wt;Wt.blockSize=1024,Wt.outSize=384,Wt.hmacStrength=192,Wt.padLength=128,Wt.prototype._digest=function(t){return"hex"===t?jt.toHex32(this.h.slice(0,12),"big"):jt.split32(this.h.slice(0,12),"big")},d.sha1=W,d.sha224=Z,d.sha256=U,d.sha384=Ct,d.sha512=_t;var Tt={},It=r,qt=l,Dt=It.rotl32,Et=It.sum32,Ft=It.sum32_3,Gt=It.sum32_4,Jt=qt.BlockHash;function Kt(){if(!(this instanceof Kt))return new Kt;Jt.call(this),this.h=[1732584193,4023233417,2562383102,271733878,3285377520],this.endian="little"}function Mt(t,i,h,n){return t<=15?i^h^n:t<=31?i&h|~i&n:t<=47?(i|~h)^n:t<=63?i&n|h&~n:i^(h|~n)}function Nt(t){return t<=15?0:t<=31?1518500249:t<=47?1859775393:t<=63?2400959708:2840853838}function Ot(t){return t<=15?1352829926:t<=31?1548603684:t<=47?1836072691:t<=63?2053994217:0}It.inherits(Kt,Jt),Tt.ripemd160=Kt,Kt.blockSize=512,Kt.outSize=160,Kt.hmacStrength=192,Kt.padLength=64,Kt.prototype._update=function(t,i){for(var h=this.h[0],n=this.h[1],r=this.h[2],s=this.h[3],e=this.h[4],o=h,u=n,a=r,c=s,l=e,f=0;f<80;f++){var g=Et(Dt(Gt(h,Mt(f,n,r,s),t[Pt[f]+i],Nt(f)),Rt[f]),e);h=e,e=s,s=Dt(r,10),r=n,n=g,g=Et(Dt(Gt(o,Mt(79-f,u,a,c),t[Qt[f]+i],Ot(f)),Ut[f]),l),o=l,l=c,c=Dt(a,10),a=u,u=g}g=Ft(this.h[1],r,c),this.h[1]=Ft(this.h[2],s,l),this.h[2]=Ft(this.h[3],e,o),this.h[3]=Ft(this.h[4],h,u),this.h[4]=Ft(this.h[0],n,a),this.h[0]=g},Kt.prototype._digest=function(t){return"hex"===t?It.toHex32(this.h,"little"):It.split32(this.h,"little")};var Pt=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13],Qt=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11],Rt=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6],Ut=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11],Vt=r,Xt=i;function Yt(t,i,h){if(!(this instanceof Yt))return new Yt(t,i,h);this.Hash=t,this.blockSize=t.blockSize/8,this.outSize=t.outSize/8,this.inner=null,this.outer=null,this._init(Vt.toArray(i,h))}var Zt,$t=Yt;Yt.prototype._init=function(t){t.length>this.blockSize&&(t=(new this.Hash).update(t).digest()),Xt(t.length<=this.blockSize);for(var i=t.length;i<this.blockSize;i++)t.push(0);for(i=0;i<t.length;i++)t[i]^=54;for(this.inner=(new this.Hash).update(t),i=0;i<t.length;i++)t[i]^=106;this.outer=(new this.Hash).update(t)},Yt.prototype.update=function(t,i){return this.inner.update(t,i),this},Yt.prototype.digest=function(t){return this.outer.update(this.inner.digest()),this.outer.digest(t)},(Zt=n).utils=r,Zt.common=l,Zt.sha=d,Zt.ripemd=Tt,Zt.hmac=$t,Zt.sha1=Zt.sha.sha1,Zt.sha256=Zt.sha.sha256,Zt.sha224=Zt.sha.sha224,Zt.sha384=Zt.sha.sha384,Zt.sha512=Zt.sha.sha512,Zt.ripemd160=Zt.ripemd.ripemd160;const ti=t(n);export{ti as h};