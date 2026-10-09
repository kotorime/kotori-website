// 冒頭の「お試しのキーボード」。フリックでかなを打てるだけで、変換はしない。
(() => {
	const padElement = document.getElementById("pad");
	const keysElement = document.getElementById("pad-keys");
	const textElement = document.getElementById("pad-text");
	if (!padElement || !keysElement || !textElement) return;

	// 行ごとの文字。並びは [そのまま, 左, 上, 右, 下]
	const ROWS = {
		あ: ["あ", "い", "う", "え", "お"],
		か: ["か", "き", "く", "け", "こ"],
		さ: ["さ", "し", "す", "せ", "そ"],
		た: ["た", "ち", "つ", "て", "と"],
		な: ["な", "に", "ぬ", "ね", "の"],
		は: ["は", "ひ", "ふ", "へ", "ほ"],
		ま: ["ま", "み", "む", "め", "も"],
		や: ["や", "（", "ゆ", "）", "よ"],
		ら: ["ら", "り", "る", "れ", "ろ"],
		わ: ["わ", "を", "ん", "ー", ""],
		"、": ["、", "。", "？", "！", ""],
	};

	// 「゛小゜」で順に切り替わる文字の組
	const CYCLES = [
		"あぁ", "いぃ", "うぅゔ", "えぇ", "おぉ",
		"かが", "きぎ", "くぐ", "けげ", "こご",
		"さざ", "しじ", "すず", "せぜ", "そぞ",
		"ただ", "ちぢ", "つっづ", "てで", "とど",
		"はばぱ", "ひびぴ", "ふぶぷ", "へべぺ", "ほぼぽ",
		"やゃ", "ゆゅ", "よょ", "わゎ",
	];

	const DIRECTIONS = ["left", "up", "right", "down"];
	const THRESHOLD = 16; // これより動いたらフリックと見なす（px）
	const MAX_LENGTH = 14;

	const ICONS = {
		delete: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7z"/><path d="m12 9.5 5 5m0-5-5 5"/></svg>',
	};

	// 配列は、かな 3 列と機能キー 1 列。「消す」は下の 2 行ぶんの高さ（アプリの確定キーと同じ形）
	const LAYOUT = [
		{ row: "あ" }, { row: "か" }, { row: "さ" }, { label: ICONS.delete, type: "delete", name: "削除" },
		{ row: "た" }, { row: "な" }, { row: "は" }, { label: "空白", type: "space", name: "空白" },
		{ row: "ま" }, { row: "や" }, { row: "ら" }, { label: "消す", type: "clear", name: "すべて消す" },
		{ label: "゛小゜", type: "cycle", name: "濁点・小文字" }, { row: "わ" }, { row: "、" },
	];

	let text = "";

	function render() {
		textElement.textContent = text;
		padElement.classList.toggle("has-text", text.length > 0);
	}

	function type(character) {
		if (!character) return;
		text = (text + character).slice(-MAX_LENGTH);
		render();
	}

	function cycleLast() {
		const last = text.slice(-1);
		const group = CYCLES.find((candidate) => candidate.includes(last));
		if (!last || !group) return;
		const next = group[(group.indexOf(last) + 1) % group.length];
		text = text.slice(0, -1) + next;
		render();
	}

	function directionOf(dx, dy) {
		if (Math.hypot(dx, dy) < THRESHOLD) return 0;
		if (Math.abs(dx) > Math.abs(dy)) return dx < 0 ? 1 : 3;
		return dy < 0 ? 2 : 4;
	}

	function attachFlick(button, characters) {
		let start = null;
		let petals = [];
		let direction = 0;

		function clear() {
			petals.forEach((petal) => petal.remove());
			petals = [];
			button.classList.remove("is-down");
			start = null;
		}

		function update() {
			petals.forEach((petal) => petal.classList.toggle("is-target", Number(petal.dataset.direction) === direction));
			button.firstChild.textContent = characters[direction] || characters[0];
		}

		button.addEventListener("pointerdown", (event) => {
			event.preventDefault();
			button.setPointerCapture(event.pointerId);
			start = { x: event.clientX, y: event.clientY };
			direction = 0;
			button.classList.add("is-down");
			DIRECTIONS.forEach((name, index) => {
				const character = characters[index + 1];
				if (!character) return;
				const petal = document.createElement("span");
				petal.className = `petal petal-${name}`;
				petal.dataset.direction = String(index + 1);
				petal.textContent = character;
				petal.setAttribute("aria-hidden", "true");
				button.appendChild(petal);
				petals.push(petal);
			});
		});

		button.addEventListener("pointermove", (event) => {
			if (!start) return;
			const next = directionOf(event.clientX - start.x, event.clientY - start.y);
			const usable = characters[next] ? next : 0;
			if (usable !== direction) {
				direction = usable;
				update();
			}
		});

		button.addEventListener("pointerup", () => {
			if (!start) return;
			type(characters[direction]);
			direction = 0;
			update();
			clear();
		});

		button.addEventListener("pointercancel", () => {
			direction = 0;
			update();
			clear();
		});

		// キーボードからは、そのままの文字だけ打てる（Enter / Space）
		button.addEventListener("keydown", (event) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				type(characters[0]);
			}
		});
	}

	LAYOUT.forEach((item) => {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "key";

		if (item.row) {
			const characters = ROWS[item.row];
			const label = document.createElement("span");
			label.textContent = characters[0];
			button.appendChild(label);
			button.setAttribute("aria-label", `${characters[0]}行。${characters.filter(Boolean).join("、")}`);
			attachFlick(button, characters);
		} else {
			if (item.type === "cycle") button.classList.add("key-small");
			else button.classList.add("key-func");
			if (item.type === "clear") button.classList.add("key-enter");
			button.innerHTML = item.label;
			button.setAttribute("aria-label", item.name);
			button.addEventListener("click", () => {
				if (item.type === "delete") text = text.slice(0, -1);
				if (item.type === "clear") text = "";
				if (item.type === "space") text = (text + "　").slice(-MAX_LENGTH);
				if (item.type === "cycle") return cycleLast();
				render();
			});
		}
		keysElement.appendChild(button);
	});

	render();
})();
