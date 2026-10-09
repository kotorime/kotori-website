# kotori-website

Kotori日本語入力の紹介サイト。GitHub Pages で公開している（<https://kotorime.github.io/kotori-website/>）。

ビルドは無い。`index.html`・`styles.css`・`flick.js` をそのまま配信する。手元で見るときは次のとおり。

```bash
python3 -m http.server 8765   # http://localhost:8765/
```

## 構成

| ファイル | 中身 |
|---|---|
| `index.html` | ページ本体。文面はここに直接書いてある |
| `styles.css` | 色・文字・レイアウト。色と形はアプリ（Android 版の `ui/Theme.kt`、`ui/Expressive.kt`）に合わせてある |
| `flick.js` | 冒頭の「お試しのキーボード」。フリックでかなを打てるだけで、変換はしない |
| `assets/` | 小鳥のアイコンと、アプリの画面（iOS 版の UI テストが撮ったものを切り抜いたもの） |

## 文面を直すとき

- 「打ったことばは、外へ出しません。」の節は、プライバシーポリシー（<https://kotorime.github.io/>）と食い違わないこと。
  iOS 版と Android 版で事実が違うので、分けて書いてある（iOS 版は通信しない。Android 版は同意後のクラッシュレポートだけ送る）
- 「入手」の節は、公開の状況が変わったら直す（ストアや TestFlight のリンクを足す）
