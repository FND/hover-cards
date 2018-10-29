(function(Popper){'use strict';if(typeof global === "undefined" && typeof window !== "undefined") {
	window.global = window;
}

Popper=Popper&&Popper.hasOwnProperty('default')?Popper['default']:Popper;function html2dom(parts, ...values) {
	let html = parts.reduce((memo, part, i) => {
		let val = values[i];
		let blank = val === undefined || val === null || val === false;
		return memo.concat(blank ? [part] : [part, val]);
	}, []).join("");
	let tmp = document.createElement("div");
	tmp.innerHTML = html.trim();
	return tmp.childNodes[0];
}class HoverCards extends HTMLElement {
	connectedCallback() {
		let popup = this.popup = html2dom`<div class="popup" aria-live="polite" hidden>
			<div class="popup-coupler"></div>
			<div class="popup-content"></div>
		</div>`;
		this.appendChild(popup);
		this.popper = new Popper(this, popup, { placement: this.position });
		let onHover = this.debounce(this.delay, "onHover");
		let onReset = this.onReset.bind(this);
		let targets = this.querySelectorAll(this.targets);
		[].forEach.call(targets, target => {
			target.addEventListener("mouseenter", onHover);
			target.addEventListener("mouseleave", onReset);
		});
	}
	onHover(ev) {
		this.setContent("");
		let node = ev.target;
		this.determineContent(node).
			then(html => {
				if(!html) {
					return;
				}
				this.show(html, node);
			});
	}
	onReset(ev) {
		this.hide();
		clearTimeout(this.timer);
	}
	determineContent(node) {
		return Promise.resolve(node.title);
	}
	show(html, referenceNode) {
		let { popper } = this;
		popper.reference = referenceNode;
		popper.scheduleUpdate();
		this.setContent(html);
		this.popup.removeAttribute("hidden");
	}
	hide() {
		this.popup.setAttribute("hidden", "");
	}
	setContent(html) {
		this.popup.querySelector(".popup-content").innerHTML = html;
	}
	debounce(delay, method) {
		return (...args) => {
			if(this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
			this.timer = setTimeout(() => {
				this[method](...args);
				this.timer = null;
			}, delay);
		};
	}
	get targets() {
		return this.getAttribute("targets") || "abbr";
	}
	get delay() {
		let delay = this.getAttribute("delay");
		return delay ? parseInt(delay, 10) : 200;
	}
	get position() {
		return this.getAttribute("position") || "top";
	}
}customElements.define("hover-cards", HoverCards);}(Popper));