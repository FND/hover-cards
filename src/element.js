/* eslint-env browser */
import { html2dom } from "uitil/dom/create";
import Popper from "popper.js";

export default class HoverCards extends HTMLElement {
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
			// TODO: support for `click` and `focus`/`blur`?
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
		popper.reference = referenceNode; // XXX: hacky?
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

	// limits the rate of `method` invocations
	// `delay` is the rate limit in milliseconds
	// `method` is the respective method's name
	// adapted from uitil <https://github.com/FND/uitil>
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
}
