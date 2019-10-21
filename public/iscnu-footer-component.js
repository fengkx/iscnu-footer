var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function a(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function i(t,e){t.appendChild(e)}function c(t,e,n){t.insertBefore(e,n||null)}function l(t){t.parentNode.removeChild(t)}function s(t){return document.createElement(t)}function d(t){return document.createTextNode(t)}function h(){return d(" ")}function p(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function u(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function f(t,e,n,o){t.style.setProperty(e,n,o?"important":"")}let g;function m(t){g=t}const x=[],b=[],w=[],v=[],y=Promise.resolve();let $=!1;function k(t){w.push(t)}function _(){const t=new Set;do{for(;x.length;){const t=x.shift();m(t),A(t.$$)}for(;b.length;)b.pop()();for(let e=0;e<w.length;e+=1){const n=w[e];t.has(n)||(n(),t.add(n))}w.length=0}while(x.length);for(;v.length;)v.pop()();$=!1}function A(t){t.fragment&&(t.update(t.dirty),o(t.before_update),t.fragment.p(t.dirty,t.ctx),t.dirty=null,t.after_update.forEach(k))}const C=new Set;function E(t,e){t.$$.dirty||(x.push(t),$||($=!0,y.then(_)),t.$$.dirty=n()),t.$$.dirty[e]=!0}function R(a,i,c,l,s,d){const h=g;m(a);const p=i.props||{},u=a.$$={fragment:null,ctx:null,props:d,update:t,not_equal:s,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(h?h.$$.context:[]),callbacks:n(),dirty:null};let f=!1;var x,b,w;u.ctx=c?c(a,p,(t,e,n=e)=>(u.ctx&&s(u.ctx[t],u.ctx[t]=n)&&(u.bound[t]&&u.bound[t](n),f&&E(a,t)),e)):p,u.update(),f=!0,o(u.before_update),u.fragment=l(u.ctx),i.target&&(i.hydrate?u.fragment.l((w=i.target,Array.from(w.childNodes))):u.fragment.c(),i.intro&&((x=a.$$.fragment)&&x.i&&(C.delete(x),x.i(b))),function(t,n,a){const{fragment:i,on_mount:c,on_destroy:l,after_update:s}=t.$$;i.m(n,a),k(()=>{const n=c.map(e).filter(r);l?l.push(...n):o(n),t.$$.on_mount=[]}),s.forEach(k)}(a,i.target,i.anchor),_()),m(h)}let z;"undefined"!=typeof HTMLElement&&(z=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){for(const t in this.$$.slotted)this.appendChild(this.$$.slotted[t])}attributeChangedCallback(t,e,n){this[t]=n}$destroy(){var e,n;n=1,(e=this).$$.fragment&&(o(e.$$.on_destroy),e.$$.fragment.d(n),e.$$.on_destroy=e.$$.fragment=null,e.$$.ctx={}),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}});var M=(t,e)=>{let n=new Set(Object.keys(e));return n.forEach(n=>{t.style.setProperty(`--${n}`,e[n])}),{update(e){const o=new Set(Object.keys(e));o.forEach(o=>{t.style.setProperty(`--${o}`,e[o]),n.delete(o)}),n.forEach(e=>t.style.removeProperty(`--${e}`)),n=o}}};function S(t){var e;return{c(){e=d("All rights Reserved.\n\t    ")},m(t,n){c(t,e,n)},d(t){t&&l(e)}}}function L(t){var e;return{c(){e=d("技术部出品")},m(t,n){c(t,e,n)},d(t){t&&l(e)}}}function D(e){var n,r,a,g,m,x,b,w,v,y,$,k,_,A,C,E,R,z,D,O,j,H,N,T,P,V,q,F=e.allRightReserved&&S(),I=e.techDepart&&L();return{c(){n=s("div"),r=s("div"),a=h(),(g=s("div")).innerHTML='<div class="image is-flex" style="align-items: center;justify-content: center"><img src="https://i.scnu.edu.cn/zixi/static/qr.png" style="width: 300px;height:360px" alt="wechat_scnu"></div>',m=h(),x=s("button"),w=h(),v=s("footer"),y=s("div"),$=s("div"),k=s("a"),_=h(),A=s("a"),C=h(),E=s("div"),R=s("p"),z=d("Copyright © 2008-"),D=d(e.nowyear),O=h(),(j=s("a")).textContent="ISCNU",H=h(),F&&F.c(),N=s("br"),(T=s("a")).textContent="华南师范大学网络协会",P=h(),I&&I.c(),this.c=t,u(r,"class","modal-background"),u(g,"class","modal-content"),u(x,"class","modal-close is-large"),u(x,"aria-label","close"),u(n,"class",b="modal "+e.isActive),u(k,"href","https://weibo.com/iscnu"),u(k,"class","contact contact-weibo"),u(k,"target","_blank"),u(A,"href","https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzA5OTcwMzIxNA==&scene=124#wechat_redirect"),u(A,"class","contact contact-wechat wechat_link"),u(A,"target","_blank"),u($,"class","content  is-pulled-right"),u(j,"href","https://i.scnu.edu.cn/about"),u(j,"target","_blank"),u(T,"href","https://i.scnu.edu.cn/about"),u(T,"target","_blank"),f(T,"color","#38485a"),f(T,"text-decoration","none"),u(E,"class","content is-small has-text-left"),u(y,"class","container"),u(v,"class","footer"),q=[p(x,"click",e.closeModal),p(A,"click",e.wechatClick)]},m(t,o){c(t,n,o),i(n,r),i(n,a),i(n,g),i(n,m),i(n,x),c(t,w,o),c(t,v,o),i(v,y),i(y,$),i($,k),i($,_),i($,A),i(y,C),i(y,E),i(E,R),i(R,z),i(R,D),i(R,O),i(R,j),i(R,H),F&&F.m(R,null),i(R,N),i(R,T),i(R,P),I&&I.m(R,null),V=M.call(null,v,e.styleVars)||{}},p(t,e){var o,r;t.isActive&&b!==(b="modal "+e.isActive)&&u(n,"class",b),t.nowyear&&(o=D,r=""+(r=e.nowyear),o.data!==r&&(o.data=r)),e.allRightReserved?F||((F=S()).c(),F.m(R,N)):F&&(F.d(1),F=null),e.techDepart?I||((I=L()).c(),I.m(R,null)):I&&(I.d(1),I=null),"function"==typeof V.update&&t.styleVars&&V.update.call(null,e.styleVars)},i:t,o:t,d(t){t&&(l(n),l(w),l(v)),F&&F.d(),I&&I.d(),V&&"function"==typeof V.destroy&&V.destroy(),o(q)}}}function O(t,e,n){const o=new Date;let{nowyear:r=o.getFullYear(),bgcolor:a="#fff",techdepart:i=!0,allrightreserved:c="true"}=e,l=!1;const s=()=>-1!==navigator.userAgent.toLowerCase().indexOf("micromessenger");let d,h,p,u;return t.$set=(t=>{"nowyear"in t&&n("nowyear",r=t.nowyear),"bgcolor"in t&&n("bgcolor",a=t.bgcolor),"techdepart"in t&&n("techdepart",i=t.techdepart),"allrightreserved"in t&&n("allrightreserved",c=t.allrightreserved)}),t.$$.update=((t={modalActive:1,bgcolor:1,allrightreserved:1,techdepart:1})=>{t.modalActive&&n("isActive",d=l?"is-active":""),t.bgcolor&&n("styleVars",h={bg_color:a}),t.allrightreserved&&n("allRightReserved",p="false"!==c),t.techdepart&&n("techDepart",u="false"!==i)}),{nowyear:r,bgcolor:a,techdepart:i,allrightreserved:c,closeModal:function(t){n("modalActive",l=!l)},wechatClick:function(t){s()||(t.preventDefault(),n("modalActive",l=!l))},isActive:d,styleVars:h,allRightReserved:p,techDepart:u}}return customElements.define("iscnu-footer",class extends z{constructor(t){super(),this.shadowRoot.innerHTML='<style>.footer{background:var(--bg_color);padding:2rem 1rem 2rem;position:static;width:100%;bottom:0;display:block;box-sizing:border-box}button{font-family:BlinkMacSystemFont,-apple-system,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",Helvetica,Arial,sans-serif}*{text-rendering:optimizeLegibility}.container{margin:0 auto;position:relative\n\t\t}@media screen and (min-width:1088px){.container{max-width:960px;width:960px\n\t\t }.container.is-fluid{margin-left:64px;margin-right:64px;max-width:none;width:auto\n\t\t }}@media screen and (max-width:1279px){.container.is-widescreen{max-width:1152px;width:auto\n\t\t }}@media screen and (max-width:1471px){.container.is-fullhd{max-width:1344px;width:auto\n\t\t }}@media screen and (min-width:1280px){.container{max-width:1152px;width:1152px\n\t\t }}@media screen and (min-width:1472px){.container{max-width:1344px;width:1344px\n\t\t }}.is-pulled-right{float:right !important}.content:not(:last-child){margin-bottom:1.5rem}.content.is-small{font-size:.75rem}.has-text-left{text-align:left !important}a:link{text-decoration:none;color:inherit}.contact-weibo{background-position:-40px -60px}.contact,.contact-email,.contact-wechat,.contact-weibo{display:inline-block;width:26px;height:26px;line-height:10em;text-indent:-9999px;overflow:hidden;background-size:65px;background-repeat:no-repeat;background-image:url(\'https://i.scnu.edu.cn/images/icon_contact.png\')}.contact.contact-wechat:hover{background-position:0 0}.contact-wechat{background-position:-40px 0}.contact.contact-weibo:hover{background-position:0 -60px}p{padding:0.15rem}.modal{align-items:center;display:none;justify-content:center;overflow:hidden;position:fixed;z-index:40}.modal.is-active{display:flex}.modal,.modal-background{bottom:0;left:0;position:absolute;right:0;top:0}.modal-background{background-color:rgba(10,10,10,.86)}.modal-card,.modal-content{margin:0 20px;max-height:calc(100vh - 160px);overflow:auto;position:relative;width:100%\n\t\t}@media screen and (min-width:769px),print{.modal-card,.modal-content{margin:0 auto;max-height:calc(100vh - 40px);width:640px\n\t\t }}.modal-close{background:0 0;height:40px;position:fixed;right:20px;top:20px;width:40px;-webkit-appearance:none;border:none;border-radius:290486px;cursor:pointer;display:inline-block;flex-grow:0;flex-shrink:0;font-size:0;outline:0;vertical-align:top}.is-flex{display:flex !important}.modal-card,.modal-content{margin:0 auto;width:640px;margin:0 20px;max-height:calc(100vh - 160px);overflow:auto;position:relative;width:100%}.delete::before,.modal-close::before{height:2px;width:50%}.delete::after,.modal-close::after{height:50%;width:2px}.delete::after,.delete::before,.modal-close::after,.modal-close::before{background-color:#fff;content:"";display:block;left:50%;position:absolute;top:50%;-webkit-transform:translateX(-50%) translateY(-50%) rotate(45deg);transform:translateX(-50%) translateY(-50%) rotate(45deg);-webkit-transform-origin:center center;transform-origin:center center}img{height:auto;max-width:100%}</style>',R(this,{target:this.shadowRoot},O,D,a,["nowyear","bgcolor","techdepart","allrightreserved"]),t&&(t.target&&c(t.target,this,t.anchor),t.props&&(this.$set(t.props),_()))}static get observedAttributes(){return["nowyear","bgcolor","techdepart","allrightreserved"]}get nowyear(){return this.$$.ctx.nowyear}set nowyear(t){this.$set({nowyear:t}),_()}get bgcolor(){return this.$$.ctx.bgcolor}set bgcolor(t){this.$set({bgcolor:t}),_()}get techdepart(){return this.$$.ctx.techdepart}set techdepart(t){this.$set({techdepart:t}),_()}get allrightreserved(){return this.$$.ctx.allrightreserved}set allrightreserved(t){this.$set({allrightreserved:t}),_()}}),footer}();
//# sourceMappingURL=iscnu-footer-component.js.map
