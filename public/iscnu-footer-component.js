
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
(function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    let SvelteElement;
    if (typeof HTMLElement !== 'undefined') {
        SvelteElement = class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }
            connectedCallback() {
                // @ts-ignore todo: improve typings
                for (const key in this.$$.slotted) {
                    // @ts-ignore todo: improve typings
                    this.appendChild(this.$$.slotted[key]);
                }
            }
            attributeChangedCallback(attr, _oldValue, newValue) {
                this[attr] = newValue;
            }
            $destroy() {
                destroy_component(this, 1);
                this.$destroy = noop;
            }
            $on(type, callback) {
                // TODO should this delegate to addEventListener?
                const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
                callbacks.push(callback);
                return () => {
                    const index = callbacks.indexOf(callback);
                    if (index !== -1)
                        callbacks.splice(index, 1);
                };
            }
            $set() {
                // overridden by instance, if it has props
            }
        };
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }

    var cssVars = (e,t)=>{let r=new Set(Object.keys(t));return r.forEach(r=>{e.style.setProperty(`--${r}`,t[r]);}),{update(t){const o=new Set(Object.keys(t));o.forEach(o=>{e.style.setProperty(`--${o}`,t[o]),r.delete(o);}),r.forEach(t=>e.style.removeProperty(`--${t}`)),r=o;}}};

    /* src/Footer.svelte generated by Svelte v3.12.1 */

    const file = "src/Footer.svelte";

    // (266:5) {#if allRightReserved}
    function create_if_block_1(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("All rights Reserved.\n\t    ");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1.name, type: "if", source: "(266:5) {#if allRightReserved}", ctx });
    	return block;
    }

    // (269:5) {#if techDepart}
    function create_if_block(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("技术部出品");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block.name, type: "if", source: "(269:5) {#if techDepart}", ctx });
    	return block;
    }

    function create_fragment(ctx) {
    	var div3, div0, t0, div2, div1, img, t1, button, div3_class_value, t2, footer, div6, div4, a0, t3, a1, t4, div5, p, t5, t6, t7, a2, t9, br, a3, t11, cssVars_action, dispose;

    	var if_block0 = (ctx.allRightReserved) && create_if_block_1(ctx);

    	var if_block1 = (ctx.techDepart) && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t1 = space();
    			button = element("button");
    			t2 = space();
    			footer = element("footer");
    			div6 = element("div");
    			div4 = element("div");
    			a0 = element("a");
    			t3 = space();
    			a1 = element("a");
    			t4 = space();
    			div5 = element("div");
    			p = element("p");
    			t5 = text("Copyright © 2008-");
    			t6 = text(ctx.nowyear);
    			t7 = space();
    			a2 = element("a");
    			a2.textContent = "ISCNU";
    			t9 = space();
    			if (if_block0) if_block0.c();
    			br = element("br");
    			a3 = element("a");
    			a3.textContent = "华南师范大学网络协会";
    			t11 = space();
    			if (if_block1) if_block1.c();
    			this.c = noop;
    			attr_dev(div0, "class", "modal-background");
    			add_location(div0, file, 249, 2, 4545);
    			attr_dev(img, "src", "https://i.scnu.edu.cn/zixi/static/qr.png");
    			set_style(img, "width", "300px");
    			set_style(img, "height", "360px");
    			attr_dev(img, "alt", "wechat_scnu");
    			add_location(img, file, 252, 6, 4702);
    			attr_dev(div1, "class", "image is-flex");
    			set_style(div1, "align-items", "center");
    			set_style(div1, "justify-content", "center");
    			add_location(div1, file, 251, 4, 4616);
    			attr_dev(div2, "class", "modal-content");
    			add_location(div2, file, 250, 2, 4584);
    			attr_dev(button, "class", "modal-close is-large");
    			attr_dev(button, "aria-label", "close");
    			add_location(button, file, 255, 2, 4829);
    			attr_dev(div3, "class", div3_class_value = "modal " + ctx.isActive);
    			add_location(div3, file, 248, 0, 4512);
    			attr_dev(a0, "href", "https://weibo.com/iscnu");
    			attr_dev(a0, "class", "contact contact-weibo");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file, 260, 6, 5047);
    			attr_dev(a1, "href", "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzA5OTcwMzIxNA==&scene=124#wechat_redirect");
    			attr_dev(a1, "class", "contact contact-wechat wechat_link");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file, 261, 6, 5138);
    			attr_dev(div4, "class", "content  is-pulled-right");
    			add_location(div4, file, 259, 4, 5002);
    			attr_dev(a2, "href", "https://i.scnu.edu.cn/about");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file, 264, 35, 5431);
    			add_location(br, file, 267, 10, 5560);
    			attr_dev(a3, "href", "https://i.scnu.edu.cn/about");
    			attr_dev(a3, "target", "_blank");
    			set_style(a3, "color", "#38485a");
    			set_style(a3, "text-decoration", "none");
    			add_location(a3, file, 267, 14, 5564);
    			add_location(p, file, 264, 5, 5401);
    			attr_dev(div5, "class", "content is-small has-text-left");
    			add_location(div5, file, 263, 4, 5351);
    			attr_dev(div6, "class", "container");
    			add_location(div6, file, 258, 2, 4974);
    			attr_dev(footer, "class", "footer");
    			add_location(footer, file, 257, 0, 4924);

    			dispose = [
    				listen_dev(button, "click", ctx.closeModal),
    				listen_dev(a1, "click", ctx.wechatClick)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    			append_dev(div3, t1);
    			append_dev(div3, button);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div6);
    			append_dev(div6, div4);
    			append_dev(div4, a0);
    			append_dev(div4, t3);
    			append_dev(div4, a1);
    			append_dev(div6, t4);
    			append_dev(div6, div5);
    			append_dev(div5, p);
    			append_dev(p, t5);
    			append_dev(p, t6);
    			append_dev(p, t7);
    			append_dev(p, a2);
    			append_dev(p, t9);
    			if (if_block0) if_block0.m(p, null);
    			append_dev(p, br);
    			append_dev(p, a3);
    			append_dev(p, t11);
    			if (if_block1) if_block1.m(p, null);
    			cssVars_action = cssVars.call(null, footer, ctx.styleVars) || {};
    		},

    		p: function update(changed, ctx) {
    			if ((changed.isActive) && div3_class_value !== (div3_class_value = "modal " + ctx.isActive)) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (changed.nowyear) {
    				set_data_dev(t6, ctx.nowyear);
    			}

    			if (ctx.allRightReserved) {
    				if (!if_block0) {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(p, br);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.techDepart) {
    				if (!if_block1) {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(p, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (typeof cssVars_action.update === 'function' && changed.styleVars) {
    				cssVars_action.update.call(null, ctx.styleVars);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div3);
    				detach_dev(t2);
    				detach_dev(footer);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (cssVars_action && typeof cssVars_action.destroy === 'function') cssVars_action.destroy();
    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	const now = new Date();
    	// Svelte web compoment porety only lowercase and only string
    	let { nowyear = now.getFullYear(), bgcolor = '#fff', techdepart = true, allrightreserved = 'true' } = $$props;

    	let modalActive = false;
    	

    	function closeModal(ev) {
    		$$invalidate('modalActive', modalActive = !modalActive);
    	}
    	const isWechat = () =>  (navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1);
    	function wechatClick(ev) {
    		if(!isWechat()) {
    			ev.preventDefault();
    			$$invalidate('modalActive', modalActive = !modalActive);
    		}

    	}

    	const writable_props = ['nowyear', 'bgcolor', 'techdepart', 'allrightreserved'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<iscnu-footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('nowyear' in $$props) $$invalidate('nowyear', nowyear = $$props.nowyear);
    		if ('bgcolor' in $$props) $$invalidate('bgcolor', bgcolor = $$props.bgcolor);
    		if ('techdepart' in $$props) $$invalidate('techdepart', techdepart = $$props.techdepart);
    		if ('allrightreserved' in $$props) $$invalidate('allrightreserved', allrightreserved = $$props.allrightreserved);
    	};

    	$$self.$capture_state = () => {
    		return { nowyear, bgcolor, techdepart, allrightreserved, modalActive, isActive, styleVars, allRightReserved, techDepart };
    	};

    	$$self.$inject_state = $$props => {
    		if ('nowyear' in $$props) $$invalidate('nowyear', nowyear = $$props.nowyear);
    		if ('bgcolor' in $$props) $$invalidate('bgcolor', bgcolor = $$props.bgcolor);
    		if ('techdepart' in $$props) $$invalidate('techdepart', techdepart = $$props.techdepart);
    		if ('allrightreserved' in $$props) $$invalidate('allrightreserved', allrightreserved = $$props.allrightreserved);
    		if ('modalActive' in $$props) $$invalidate('modalActive', modalActive = $$props.modalActive);
    		if ('isActive' in $$props) $$invalidate('isActive', isActive = $$props.isActive);
    		if ('styleVars' in $$props) $$invalidate('styleVars', styleVars = $$props.styleVars);
    		if ('allRightReserved' in $$props) $$invalidate('allRightReserved', allRightReserved = $$props.allRightReserved);
    		if ('techDepart' in $$props) $$invalidate('techDepart', techDepart = $$props.techDepart);
    	};

    	let isActive, styleVars, allRightReserved, techDepart;

    	$$self.$$.update = ($$dirty = { modalActive: 1, bgcolor: 1, allrightreserved: 1, techdepart: 1 }) => {
    		if ($$dirty.modalActive) { $$invalidate('isActive', isActive = modalActive ? 'is-active' : ''); }
    		if ($$dirty.bgcolor) { $$invalidate('styleVars', styleVars = {
        		bg_color: bgcolor
        	}); }
    		if ($$dirty.allrightreserved) { $$invalidate('allRightReserved', allRightReserved = allrightreserved !== 'false'); }
    		if ($$dirty.techdepart) { $$invalidate('techDepart', techDepart = techdepart !== 'false'); }
    	};

    	return {
    		nowyear,
    		bgcolor,
    		techdepart,
    		allrightreserved,
    		closeModal,
    		wechatClick,
    		isActive,
    		styleVars,
    		allRightReserved,
    		techDepart
    	};
    }

    class Footer extends SvelteElement {
    	constructor(options) {
    		super();

    		this.shadowRoot.innerHTML = `<style>.footer{background:var(--bg_color);padding:2rem 1rem 2rem;position:static;width:100%;bottom:0;display:block;box-sizing:border-box}button{font-family:BlinkMacSystemFont,-apple-system,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",Helvetica,Arial,sans-serif}*{text-rendering:optimizeLegibility}.container{margin:0 auto;position:relative
		}@media screen and (min-width:1088px){.container{max-width:960px;width:960px
		 }.container.is-fluid{margin-left:64px;margin-right:64px;max-width:none;width:auto
		 }}@media screen and (max-width:1279px){.container.is-widescreen{max-width:1152px;width:auto
		 }}@media screen and (max-width:1471px){.container.is-fullhd{max-width:1344px;width:auto
		 }}@media screen and (min-width:1280px){.container{max-width:1152px;width:1152px
		 }}@media screen and (min-width:1472px){.container{max-width:1344px;width:1344px
		 }}.is-pulled-right{float:right !important}.content:not(:last-child){margin-bottom:1.5rem}.content.is-small{font-size:.75rem}.has-text-left{text-align:left !important}a:link{text-decoration:none;color:inherit}.contact-weibo{background-position:-40px -60px}.contact,.contact-email,.contact-wechat,.contact-weibo{display:inline-block;width:26px;height:26px;line-height:10em;text-indent:-9999px;overflow:hidden;background-size:65px;background-repeat:no-repeat;background-image:url('https://i.scnu.edu.cn/images/icon_contact.png')}.contact.contact-wechat:hover{background-position:0 0}.contact-wechat{background-position:-40px 0}.contact.contact-weibo:hover{background-position:0 -60px}p{padding:0.15rem}.modal{align-items:center;display:none;justify-content:center;overflow:hidden;position:fixed;z-index:40}.modal.is-active{display:flex}.modal,.modal-background{bottom:0;left:0;position:absolute;right:0;top:0}.modal-background{background-color:rgba(10,10,10,.86)}.modal-card,.modal-content{margin:0 20px;max-height:calc(100vh - 160px);overflow:auto;position:relative;width:100%
		}@media screen and (min-width:769px),print{.modal-card,.modal-content{margin:0 auto;max-height:calc(100vh - 40px);width:640px
		 }}.modal-close{background:0 0;height:40px;position:fixed;right:20px;top:20px;width:40px;-webkit-appearance:none;border:none;border-radius:290486px;cursor:pointer;display:inline-block;flex-grow:0;flex-shrink:0;font-size:0;outline:0;vertical-align:top}.is-flex{display:flex !important}.modal-card,.modal-content{margin:0 auto;width:640px;margin:0 20px;max-height:calc(100vh - 160px);overflow:auto;position:relative;width:100%}.delete::before,.modal-close::before{height:2px;width:50%}.delete::after,.modal-close::after{height:50%;width:2px}.delete::after,.delete::before,.modal-close::after,.modal-close::before{background-color:#fff;content:"";display:block;left:50%;position:absolute;top:50%;-webkit-transform:translateX(-50%) translateY(-50%) rotate(45deg);transform:translateX(-50%) translateY(-50%) rotate(45deg);-webkit-transform-origin:center center;transform-origin:center center}img{height:auto;max-width:100%}
		/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9vdGVyLnN2ZWx0ZSIsInNvdXJjZXMiOlsiRm9vdGVyLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c3ZlbHRlOm9wdGlvbnMgdGFnPVwiaXNjbnUtZm9vdGVyXCIgLz5cbjxzY3JpcHQ+XG5cdGltcG9ydCBjc3NWYXJzIGZyb20gJ3N2ZWx0ZS1jc3MtdmFycyc7XG5cdGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG5cdC8vIFN2ZWx0ZSB3ZWIgY29tcG9tZW50IHBvcmV0eSBvbmx5IGxvd2VyY2FzZSBhbmQgb25seSBzdHJpbmdcblx0ZXhwb3J0IGxldCBub3d5ZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG5cdGV4cG9ydCBsZXQgYmdjb2xvciA9ICcjZmZmJztcblx0ZXhwb3J0IGxldCB0ZWNoZGVwYXJ0ID0gdHJ1ZTtcblx0ZXhwb3J0IGxldCBhbGxyaWdodHJlc2VydmVkID0gJ3RydWUnO1xuXG5cdGxldCBtb2RhbEFjdGl2ZSA9IGZhbHNlO1xuXHQkOiBpc0FjdGl2ZSA9IG1vZGFsQWN0aXZlID8gJ2lzLWFjdGl2ZScgOiAnJztcblx0JDogc3R5bGVWYXJzID0ge1xuXHRcdGJnX2NvbG9yOiBiZ2NvbG9yXG5cdH07XG5cdCQ6IGFsbFJpZ2h0UmVzZXJ2ZWQgPSBhbGxyaWdodHJlc2VydmVkICE9PSAnZmFsc2UnO1xuXHQkOiB0ZWNoRGVwYXJ0ID0gdGVjaGRlcGFydCAhPT0gJ2ZhbHNlJztcblx0XG5cblx0ZnVuY3Rpb24gY2xvc2VNb2RhbChldikge1xuXHRcdG1vZGFsQWN0aXZlID0gIW1vZGFsQWN0aXZlO1xuXHR9XG5cdGNvbnN0IGlzV2VjaGF0ID0gKCkgPT4gIChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignbWljcm9tZXNzZW5nZXInKSAhPT0gLTEpO1xuXHRmdW5jdGlvbiB3ZWNoYXRDbGljayhldikge1xuXHRcdGlmKCFpc1dlY2hhdCgpKSB7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bW9kYWxBY3RpdmUgPSAhbW9kYWxBY3RpdmU7XG5cdFx0fVxuXG5cdH1cbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4uZm9vdGVyIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iZ19jb2xvcik7XG4gICAgcGFkZGluZzogMnJlbSAxcmVtIDJyZW07XG4gICAgcG9zaXRpb246IHN0YXRpYztcbiAgICB3aWR0aDogMTAwJTtcbiAgICBib3R0b206IDA7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcblxufVxuXG5ib2R5LCBidXR0b24sIGlucHV0LCBzZWxlY3QsIHRleHRhcmVhIHtcbiAgICBmb250LWZhbWlseTogQmxpbmtNYWNTeXN0ZW1Gb250LC1hcHBsZS1zeXN0ZW0sXCJTZWdvZSBVSVwiLFJvYm90byxPeHlnZW4sVWJ1bnR1LENhbnRhcmVsbCxcIkZpcmEgU2Fuc1wiLFwiRHJvaWQgU2Fuc1wiLFwiSGVsdmV0aWNhIE5ldWVcIixIZWx2ZXRpY2EsQXJpYWwsc2Fucy1zZXJpZjtcbn1cblxuKiB7XG5cdHRleHQtcmVuZGVyaW5nOiBvcHRpbWl6ZUxlZ2liaWxpdHk7XG59XG5cbi5jb250YWluZXIge1xuIG1hcmdpbjowIGF1dG87XG4gcG9zaXRpb246cmVsYXRpdmVcbn1cblxuQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDoxMDg4cHgpIHtcbiAuY29udGFpbmVyIHtcbiAgbWF4LXdpZHRoOjk2MHB4O1xuICB3aWR0aDo5NjBweFxuIH1cbiAuY29udGFpbmVyLmlzLWZsdWlkIHtcbiAgbWFyZ2luLWxlZnQ6NjRweDtcbiAgbWFyZ2luLXJpZ2h0OjY0cHg7XG4gIG1heC13aWR0aDpub25lO1xuICB3aWR0aDphdXRvXG4gfVxufVxuXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjEyNzlweCkge1xuIC5jb250YWluZXIuaXMtd2lkZXNjcmVlbiB7XG4gIG1heC13aWR0aDoxMTUycHg7XG4gIHdpZHRoOmF1dG9cbiB9XG59XG5cbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6MTQ3MXB4KSB7XG4gLmNvbnRhaW5lci5pcy1mdWxsaGQge1xuICBtYXgtd2lkdGg6MTM0NHB4O1xuICB3aWR0aDphdXRvXG4gfVxufVxuXG5AbWVkaWEgc2NyZWVuIGFuZCAobWluLXdpZHRoOjEyODBweCkge1xuIC5jb250YWluZXIge1xuICBtYXgtd2lkdGg6MTE1MnB4O1xuICB3aWR0aDoxMTUycHhcbiB9XG59XG5cbkBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6MTQ3MnB4KSB7XG4gLmNvbnRhaW5lciB7XG4gIG1heC13aWR0aDoxMzQ0cHg7XG4gIHdpZHRoOjEzNDRweFxuIH1cbn1cblxuLmlzLXB1bGxlZC1yaWdodCB7XG4gICAgZmxvYXQ6IHJpZ2h0ICFpbXBvcnRhbnQ7XG59XG5cbi5jb250ZW50Om5vdCg6bGFzdC1jaGlsZCkge1xuXHRtYXJnaW4tYm90dG9tOiAxLjVyZW07XG59XG5cbi5jb250ZW50LmlzLXNtYWxsIHtcbiAgICBmb250LXNpemU6IC43NXJlbTtcbn1cblxuLmhhcy10ZXh0LWxlZnQge1xuICAgIHRleHQtYWxpZ246IGxlZnQgIWltcG9ydGFudDtcbn1cblxuXG5hOmxpbmsge1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICBjb2xvcjogaW5oZXJpdDtcbn1cblxuLmNvbnRhY3Qtd2VpYm8ge1xuICAgIGJhY2tncm91bmQtcG9zaXRpb246IC00MHB4IC02MHB4O1xufVxuXG4uY29udGFjdCwgLmNvbnRhY3QtZW1haWwsIC5jb250YWN0LXdlY2hhdCwgLmNvbnRhY3Qtd2VpYm8ge1xuXHRkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG5cdHdpZHRoOiAyNnB4O1xuXHRoZWlnaHQ6IDI2cHg7XG5cdGxpbmUtaGVpZ2h0OiAxMGVtO1xuXHR0ZXh0LWluZGVudDogLTk5OTlweDtcblx0b3ZlcmZsb3c6IGhpZGRlbjtcblx0YmFja2dyb3VuZC1zaXplOiA2NXB4O1xuXHRiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0OyBcblx0YmFja2dyb3VuZC1pbWFnZTogdXJsKCdodHRwczovL2kuc2NudS5lZHUuY24vaW1hZ2VzL2ljb25fY29udGFjdC5wbmcnKTtcbn1cbi5jb250YWN0LmNvbnRhY3Qtd2VjaGF0OmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwIDA7XG59XG4uY29udGFjdC13ZWNoYXQge1xuICAgIGJhY2tncm91bmQtcG9zaXRpb246IC00MHB4IDA7XG59XG4uY29udGFjdC5jb250YWN0LXdlaWJvOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwIC02MHB4O1xufVxucCB7XG4gICAgcGFkZGluZzogMC4xNXJlbTtcbn1cblxuLypcbm1vZGFsXG4gKi9cblxuLm1vZGFsIHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgei1pbmRleDogNDA7XG59XG5cbi5tb2RhbC5pcy1hY3RpdmUge1xuICAgIGRpc3BsYXk6IGZsZXg7XG59XG5cbi5tb2RhbCwgLm1vZGFsLWJhY2tncm91bmR7XG4gICAgYm90dG9tOiAwO1xuICAgIGxlZnQ6IDA7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHJpZ2h0OiAwO1xuICAgIHRvcDogMDtcbn1cbi5tb2RhbC1iYWNrZ3JvdW5kIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDEwLDEwLDEwLC44Nik7XG59XG5cbi5tb2RhbC1jYXJkLFxuLm1vZGFsLWNvbnRlbnQge1xuIG1hcmdpbjowIDIwcHg7XG4gbWF4LWhlaWdodDpjYWxjKDEwMHZoIC0gMTYwcHgpO1xuIG92ZXJmbG93OmF1dG87XG4gcG9zaXRpb246cmVsYXRpdmU7XG4gd2lkdGg6MTAwJVxufVxuQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDo3NjlweCkscHJpbnQge1xuIC5tb2RhbC1jYXJkLFxuIC5tb2RhbC1jb250ZW50IHtcbiAgbWFyZ2luOjAgYXV0bztcbiAgbWF4LWhlaWdodDpjYWxjKDEwMHZoIC0gNDBweCk7XG4gIHdpZHRoOjY0MHB4XG4gfVxufVxuLm1vZGFsLWNsb3NlIHtcbiBiYWNrZ3JvdW5kOjAgMDtcbiBoZWlnaHQ6NDBweDtcbiBwb3NpdGlvbjpmaXhlZDtcbiByaWdodDoyMHB4O1xuIHRvcDoyMHB4O1xuIHdpZHRoOjQwcHg7XG4gLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xuIGJvcmRlcjogbm9uZTtcbiBib3JkZXItcmFkaXVzOiAyOTA0ODZweDtcbiBjdXJzb3I6IHBvaW50ZXI7XG4gZGlzcGxheTogaW5saW5lLWJsb2NrO1xuIGZsZXgtZ3JvdzogMDtcbiBmbGV4LXNocmluazogMDtcbiBmb250LXNpemU6IDA7XG4gb3V0bGluZTogMDtcbiB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xufVxuXG4uaXMtZmxleCB7XG4gICAgZGlzcGxheTogZmxleCAhaW1wb3J0YW50O1xufVxuLm1vZGFsLWNhcmQsIC5tb2RhbC1jb250ZW50IHtcbiAgICBtYXJnaW46IDAgYXV0bztcbiAgICB3aWR0aDogNjQwcHg7XG4gICAgbWFyZ2luOiAwIDIwcHg7XG4gICAgbWF4LWhlaWdodDogY2FsYygxMDB2aCAtIDE2MHB4KTtcbiAgICBvdmVyZmxvdzogYXV0bztcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgd2lkdGg6IDEwMCU7XG59XG4uZGVsZXRlOjpiZWZvcmUsIC5tb2RhbC1jbG9zZTo6YmVmb3JlIHtcbiAgICBoZWlnaHQ6IDJweDtcbiAgICB3aWR0aDogNTAlO1xufVxuLmRlbGV0ZTo6YWZ0ZXIsIC5tb2RhbC1jbG9zZTo6YWZ0ZXIge1xuICAgIGhlaWdodDogNTAlO1xuICAgIHdpZHRoOiAycHg7XG59XG4uZGVsZXRlOjphZnRlciwgLmRlbGV0ZTo6YmVmb3JlLCAubW9kYWwtY2xvc2U6OmFmdGVyLCAubW9kYWwtY2xvc2U6OmJlZm9yZSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgICBjb250ZW50OiBcIlwiO1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIGxlZnQ6IDUwJTtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiA1MCU7XG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSkgdHJhbnNsYXRlWSgtNTAlKSByb3RhdGUoNDVkZWcpO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKSB0cmFuc2xhdGVZKC01MCUpIHJvdGF0ZSg0NWRlZyk7XG4gICAgLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXIgY2VudGVyO1xuICAgIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlciBjZW50ZXI7XG59XG5pbWcge1xuICAgIGhlaWdodDogYXV0bztcbiAgICBtYXgtd2lkdGg6IDEwMCU7XG59XG48L3N0eWxlPlxuPGRpdiBjbGFzcz1cIm1vZGFsIHtpc0FjdGl2ZX1cIj5cbiAgPGRpdiBjbGFzcz1cIm1vZGFsLWJhY2tncm91bmRcIj48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICA8ZGl2IGNsYXNzPVwiaW1hZ2UgaXMtZmxleFwiIHN0eWxlPVwiYWxpZ24taXRlbXM6IGNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlclwiPlxuICAgICAgPGltZyBzcmM9XCJodHRwczovL2kuc2NudS5lZHUuY24veml4aS9zdGF0aWMvcXIucG5nXCIgc3R5bGU9XCJ3aWR0aDogMzAwcHg7aGVpZ2h0OjM2MHB4XCIgYWx0PVwid2VjaGF0X3NjbnVcIj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDxidXR0b24gb246Y2xpY2s9e2Nsb3NlTW9kYWx9IGNsYXNzPVwibW9kYWwtY2xvc2UgaXMtbGFyZ2VcIiBhcmlhLWxhYmVsPVwiY2xvc2VcIj48L2J1dHRvbj5cbjwvZGl2PlxuPGZvb3RlciB1c2U6Y3NzVmFycz17c3R5bGVWYXJzfSBjbGFzcz1cImZvb3RlclwiPlxuICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG4gICAgPGRpdiBjbGFzcz1cImNvbnRlbnQgIGlzLXB1bGxlZC1yaWdodFwiPlxuICAgICAgPGEgaHJlZj1cImh0dHBzOi8vd2VpYm8uY29tL2lzY251XCIgY2xhc3M9XCJjb250YWN0IGNvbnRhY3Qtd2VpYm9cIiB0YXJnZXQ9XCJfYmxhbmtcIj48L2E+XG4gICAgICA8YSBvbjpjbGljaz17d2VjaGF0Q2xpY2t9IGhyZWY9XCJodHRwczovL21wLndlaXhpbi5xcS5jb20vbXAvcHJvZmlsZV9leHQ/YWN0aW9uPWhvbWUmX19iaXo9TXpBNU9UY3dNekl4TkE9PSZzY2VuZT0xMjQjd2VjaGF0X3JlZGlyZWN0XCIgY2xhc3M9XCJjb250YWN0IGNvbnRhY3Qtd2VjaGF0IHdlY2hhdF9saW5rXCIgdGFyZ2V0PVwiX2JsYW5rXCI+PC9hPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJjb250ZW50IGlzLXNtYWxsIGhhcy10ZXh0LWxlZnRcIj5cblx0ICAgIDxwPkNvcHlyaWdodCDCqSAyMDA4LXtub3d5ZWFyfSA8YSBocmVmPVwiaHR0cHM6Ly9pLnNjbnUuZWR1LmNuL2Fib3V0XCIgdGFyZ2V0PVwiX2JsYW5rXCI+SVNDTlU8L2E+IFxuXHQgICAgeyNpZiBhbGxSaWdodFJlc2VydmVkfVxuXHQgICAgQWxsIHJpZ2h0cyBSZXNlcnZlZC5cblx0ICAgIHsvaWZ9PGJyPjxhIGhyZWY9XCJodHRwczovL2kuc2NudS5lZHUuY24vYWJvdXRcIiB0YXJnZXQ9XCJfYmxhbmtcIiBzdHlsZT1cImNvbG9yOiMzODQ4NWE7IHRleHQtZGVjb3JhdGlvbjpub25lXCI+5Y2O5Y2X5biI6IyD5aSn5a2m572R57uc5Y2P5LyaPC9hPlxuXHQgICAgeyNpZiB0ZWNoRGVwYXJ0fVxuXHQgICAg5oqA5pyv6YOo5Ye65ZOBXG5cdCAgICB7L2lmfTwvcD5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Zvb3Rlcj5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFpQ0EsT0FBTyxBQUFDLENB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 */</style>`;

    		init(this, { target: this.shadowRoot }, instance, create_fragment, safe_not_equal, ["nowyear", "bgcolor", "techdepart", "allrightreserved"]);

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}

    			if (options.props) {
    				this.$set(options.props);
    				flush();
    			}
    		}
    	}

    	static get observedAttributes() {
    		return ["nowyear","bgcolor","techdepart","allrightreserved"];
    	}

    	get nowyear() {
    		return this.$$.ctx.nowyear;
    	}

    	set nowyear(nowyear) {
    		this.$set({ nowyear });
    		flush();
    	}

    	get bgcolor() {
    		return this.$$.ctx.bgcolor;
    	}

    	set bgcolor(bgcolor) {
    		this.$set({ bgcolor });
    		flush();
    	}

    	get techdepart() {
    		return this.$$.ctx.techdepart;
    	}

    	set techdepart(techdepart) {
    		this.$set({ techdepart });
    		flush();
    	}

    	get allrightreserved() {
    		return this.$$.ctx.allrightreserved;
    	}

    	set allrightreserved(allrightreserved) {
    		this.$set({ allrightreserved });
    		flush();
    	}
    }

    customElements.define("iscnu-footer", Footer);

}());
//# sourceMappingURL=iscnu-footer-component.js.map
