!function(){var t,e=function(t,e){return function(){return t.apply(e,arguments)}};$(function(){var t,e;return t=function(){return location.hash="#download"},e=function(){return location.hash=""},"#download"===location.hash&&$("#download-modal").reveal({close:e}),$("[data-show-downloads]").click(function(n){return n.preventDefault(),$("#download-modal").reveal({open:t,close:e})})}),t=angular.module("infiniteScrollSite",["infinite-scroll"]),t.controller("DownloadsController",["$scope",function(t){var e,n,r,o,s,i,a;return a=function(t){var e,n,r,o,s;for(t=t.replace("v",""),n=t.split("."),s=[],r=0,o=n.length;o>r;r++)e=n[r],s.push(parseInt(e,10));return s},s=function(t){var e,n;try{return n=a(t),0===n[1]%2}catch(r){return e=r,!1}},i=function(t){var e,n;try{return n=a(t),1===n[1]%2}catch(r){return e=r,!1}},t.versions=["master","0.1.0","0.2.0","1.0.0"],t.versions=_(t.versions).sort(function(t,e){var n,r,o,s,i,u;if("master"===t)return-1;if("master"===e)return 1;for(i=function(){var n,o,s,i;for(s=[t,e],i=[],n=0,o=s.length;o>n;n++)r=s[n],i.push(a(r));return i}(),t=i[0],e=i[1],u=[0,1,2],o=0,s=u.length;s>o;o++){if(n=u[o],t[n]>e[n])return-1;if(t[n]<e[n])return 1}return 0}),r=_(t.versions).filter(s),o=_(t.versions).filter(i),e=r[0],n=o[0],t.selectedVersion=e?e:n?n:"master",t.versionIsStable=s,t.versionIsUnstable=i,t.versionLabel=function(t){var r;return r=t,t===n&&(r+=" (latest unstable release)"),t===e&&(r+=" (latest stable release)"),"master"===t&&(r+=" (development head)"),r}}]),t.controller("BasicDemoController",["$scope",function(t){var e,n;return t.items=function(){for(n=[],e=1;64>=e;e++)n.push(e);return n}.apply(this),t.enabled=!0,t.loadMore=function(){var e,n,r,o;for(e=t.items[t.items.length-1],o=[],n=r=1;8>=r;n=++r)o.push(t.items.push(e+n));return o}}]),t.factory("Reddit",["$http",function(t){var n;return n=function(){function n(){this.nextPage=e(this.nextPage,this),this.items=[],this.busy=!1,this.after=""}return n.prototype.nextPage=function(){var e,n=this;if(!this.busy)return this.busy=!0,e="https://api.reddit.com/hot?after="+this.after+"&jsonp=JSON_CALLBACK",t.jsonp(e).success(function(t){var e,r,o,s;for(r=t.data.children,o=0,s=r.length;s>o;o++)e=r[o],n.items.push(e.data);return n.after="t3_"+n.items[n.items.length-1].id,n.busy=!1})},n}()}]),t.controller("RemoteDemoController",["$scope","Reddit",function(t,e){var n;return n=t.reddit=new e,t.nextPage=function(){return t.paused()?void 0:n.nextPage()},t.paused=function(){return n.busy||n.items.length>=1e3}}])}.call(this);