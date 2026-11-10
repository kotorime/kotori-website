# kotori-website

Kotori日本語入力の紹介サイト。GitHub Pages で公開している（<https://kotorime.github.io/kotori-website/>）。

ビルドは無い。`index.html` と `styles.css` をそのまま配信する。手元で見るときは次のとおり。

```bash
python3 -m http.server 8765   # http://localhost:8765/
```

## 構成

| ファイル | 中身 |
|---|---|
| `index.html` | ページ本体。文面はここに直接書いてある。冒頭の図は、実際の画面（`assets/turn-1.jpg`〜`turn-5.jpg`）を段階ごとに送るもので、指の位置と送る間隔は末尾のスクリプトにある |
| `styles.css` | 色・文字・レイアウト。色と形はアプリ（Android 版の `ui/Theme.kt`、`ui/Expressive.kt`）に合わせてある |
| `assets/` | 小鳥のアイコンと、Android 版の実際の画面（下の「画面を撮り直すとき」）。`og.png` は共有されたときに出る画像（1200×630）、`apple-touch-icon.png` はホーム画面用のアイコン |

ターンフリック（設定の名前。以前は拡張フリック）の説明は、Android 版の `keys/GyoKey.kt` の `createFlickTransitions`（どの向きへ曲げるとどの文字になるか）に合わせてある。挙動を変えたらここも直す。

## 画面を撮り直すとき

画面はどれも Android 版をエミュレータ（1080×2400）で動かして撮り、キーボードの部分を切り抜いたもの。配色は Kotori のブランドの色（`5A6F47`）に揃えて撮る（壁紙の色がアプリに乗るため。やり方は Android 版の `docs/play-store/capture.py` の `brand_palette`）。

| ファイル | 撮り方 |
|---|---|
| `turn-1.jpg`〜`turn-5.jpg` | ターンフリック（濁音・拗音・ターンフリック+）と AI 超変換をオンにして、「か」を押す → 左へ → 右下へ戻す → もう一度左へ（きょう）の各段階と、離して「とにかえる」と打ったあと。拗音に「う」を足す動きは `-Pkotori.flickContractedExtension=true` を付けたビルドにだけ入る |
| `ai-off.jpg`、`ai-on.jpg` | 「くすりがきく」と打ったときの候補の列。AI 超変換のオフとオン |
| `themes.jpg` | 設定アプリの「きせかえ」の一覧 |
| `background.jpg`、`background-picker.jpg` | 「きせかえ」の「キーボードに画像を使う」で Android 版の `docs/play-store/landscape.png` を選び、その背景で入力しているキーボードと、画像を選ぶ画面 |

「AI 超変換」の節の表と件数は、kanakanji-rs の `zenz_corpus`（`--no-typing`）を、アプリに入っている辞書とモデルで動かした結果（辞書だけの 1 位と `fix_candidates` の 1 位）。辞書やモデルを替えたら測り直して、表の例がまだ成り立つかも確かめる。

## スタイルを直すとき

`styles.css` を変えたら、`index.html` の `styles.css?v=…` の数字を上げる（ブラウザに残った古いスタイルで表示が崩れるのを防ぐ）。

## 文面を直すとき

- 「打ったことばは、外へ出しません。」の節は、プライバシーポリシー（<https://kotorime.github.io/>）と食い違わないこと。
  iOS 版と Android 版で事実が違うので、分けて書いてある（iOS 版は通信しない。Android 版は同意後のクラッシュレポートだけ送る）
- 「ダウンロード」の節は、公開の状況が変わったら直す（ストアや TestFlight のリンクを足す）
