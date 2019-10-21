<svelte:options tag="iscnu-footer" />
<script>
	import cssVars from 'svelte-css-vars';
	const now = new Date();
	// Svelte web compoment porety only lowercase and only string
	export let nowyear = now.getFullYear();
	export let bgcolor = '#fff';
	export let techdepart = true;
	export let allrightreserved = 'true';

	let modalActive = false;
	$: isActive = modalActive ? 'is-active' : '';
	$: styleVars = {
		bg_color: bgcolor
	};
	$: allRightReserved = allrightreserved !== 'false';
	$: techDepart = techdepart !== 'false';
	

	function closeModal(ev) {
		modalActive = !modalActive;
	}
	const isWechat = () =>  (navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1);
	function wechatClick(ev) {
		if(!isWechat()) {
			ev.preventDefault();
			modalActive = !modalActive;
		}

	}
</script>

<style>
.footer {
    background: var(--bg_color);
    padding: 2rem 1rem 2rem;
    position: static;
    width: 100%;
    bottom: 0;
    display: block;
    box-sizing: border-box;

}

body, button, input, select, textarea {
    font-family: BlinkMacSystemFont,-apple-system,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
}

* {
	text-rendering: optimizeLegibility;
}

.container {
 margin:0 auto;
 position:relative
}

@media screen and (min-width:1088px) {
 .container {
  max-width:960px;
  width:960px
 }
 .container.is-fluid {
  margin-left:64px;
  margin-right:64px;
  max-width:none;
  width:auto
 }
}

@media screen and (max-width:1279px) {
 .container.is-widescreen {
  max-width:1152px;
  width:auto
 }
}

@media screen and (max-width:1471px) {
 .container.is-fullhd {
  max-width:1344px;
  width:auto
 }
}

@media screen and (min-width:1280px) {
 .container {
  max-width:1152px;
  width:1152px
 }
}

@media screen and (min-width:1472px) {
 .container {
  max-width:1344px;
  width:1344px
 }
}

.is-pulled-right {
    float: right !important;
}

.content:not(:last-child) {
	margin-bottom: 1.5rem;
}

.content.is-small {
    font-size: .75rem;
}

.has-text-left {
    text-align: left !important;
}


a:link {
    text-decoration: none;
    color: inherit;
}

.contact-weibo {
    background-position: -40px -60px;
}

.contact, .contact-email, .contact-wechat, .contact-weibo {
	display: inline-block;
	width: 26px;
	height: 26px;
	line-height: 10em;
	text-indent: -9999px;
	overflow: hidden;
	background-size: 65px;
	background-repeat: no-repeat; 
	background-image: url('https://i.scnu.edu.cn/images/icon_contact.png');
}
.contact.contact-wechat:hover {
    background-position: 0 0;
}
.contact-wechat {
    background-position: -40px 0;
}
.contact.contact-weibo:hover {
    background-position: 0 -60px;
}
p {
    padding: 0.15rem;
}

/*
modal
 */

.modal {
    align-items: center;
    display: none;
    justify-content: center;
    overflow: hidden;
    position: fixed;
    z-index: 40;
}

.modal.is-active {
    display: flex;
}

.modal, .modal-background{
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
}
.modal-background {
    background-color: rgba(10,10,10,.86);
}

.modal-card,
.modal-content {
 margin:0 20px;
 max-height:calc(100vh - 160px);
 overflow:auto;
 position:relative;
 width:100%
}
@media screen and (min-width:769px),print {
 .modal-card,
 .modal-content {
  margin:0 auto;
  max-height:calc(100vh - 40px);
  width:640px
 }
}
.modal-close {
 background:0 0;
 height:40px;
 position:fixed;
 right:20px;
 top:20px;
 width:40px;
 -webkit-appearance: none;
 border: none;
 border-radius: 290486px;
 cursor: pointer;
 display: inline-block;
 flex-grow: 0;
 flex-shrink: 0;
 font-size: 0;
 outline: 0;
 vertical-align: top;
}

.is-flex {
    display: flex !important;
}
.modal-card, .modal-content {
    margin: 0 auto;
    width: 640px;
    margin: 0 20px;
    max-height: calc(100vh - 160px);
    overflow: auto;
    position: relative;
    width: 100%;
}
.delete::before, .modal-close::before {
    height: 2px;
    width: 50%;
}
.delete::after, .modal-close::after {
    height: 50%;
    width: 2px;
}
.delete::after, .delete::before, .modal-close::after, .modal-close::before {
    background-color: #fff;
    content: "";
    display: block;
    left: 50%;
    position: absolute;
    top: 50%;
    -webkit-transform: translateX(-50%) translateY(-50%) rotate(45deg);
    transform: translateX(-50%) translateY(-50%) rotate(45deg);
    -webkit-transform-origin: center center;
    transform-origin: center center;
}
img {
    height: auto;
    max-width: 100%;
}
</style>
<div class="modal {isActive}">
  <div class="modal-background"></div>
  <div class="modal-content">
    <div class="image is-flex" style="align-items: center;justify-content: center">
      <img src="https://i.scnu.edu.cn/zixi/static/qr.png" style="width: 300px;height:360px" alt="wechat_scnu">
    </div>
  </div>
  <button on:click={closeModal} class="modal-close is-large" aria-label="close"></button>
</div>
<footer use:cssVars={styleVars} class="footer">
  <div class="container">
    <div class="content  is-pulled-right">
      <a href="https://weibo.com/iscnu" class="contact contact-weibo" target="_blank"></a>
      <a on:click={wechatClick} href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzA5OTcwMzIxNA==&scene=124#wechat_redirect" class="contact contact-wechat wechat_link" target="_blank"></a>
    </div>
    <div class="content is-small has-text-left">
	    <p>Copyright © 2008-{nowyear} <a href="https://i.scnu.edu.cn/about" target="_blank">ISCNU</a> 
	    {#if allRightReserved}
	    All rights Reserved.
	    {/if}<br><a href="https://i.scnu.edu.cn/about" target="_blank" style="color:#38485a; text-decoration:none">华南师范大学网络协会</a>
	    {#if techDepart}
	    技术部出品
	    {/if}</p>
    </div>
  </div>
</footer>
