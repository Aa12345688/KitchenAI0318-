# 🍳 AI 智慧廚房 | Kitchen AI (Intelligence & Efficiency)

這是一個專為「智慧家庭」與「食品效期管理」量身製作的 Web App。透過 AI 神經網絡技術，協助使用者實現食材的數位化管理、減少浪費並激發料理創意。

---

## 🚀 核心產品功能

### 🧠 神經網絡視覺 (Neural Vision)
*   **本地端即時辨識**：整合 YOLOv8 ONNX 模型，直接在瀏覽器呼叫攝影機進行即時食材偵測（不需將影像傳回伺服器，隱私更安全）。
*   **品質異常檢測**：自動標記疑似損壞或過期的食材，並同步至浪費數據統計圖表。

### 📦 智慧批次管理 (Smart Batching)
*   **FIFO 先進先出**：系統自動根據「登錄時間」區分食材。同名食材若登錄時間相差超過 **1 小時**，將自動視為獨立批次。
*   **批次追蹤**：每張食材卡片皆清楚顯示「系統登錄時間」，確保您先吃掉舊的採購項目，避免浪費。

### 🔎 精準全境縮放 (Precision UI Scaling)
*   **無障礙縮放**：支援最高 **200% (超級放大鏡)** 的介面縮放。
*   **rem 自適應佈局**：字體、圖標與按鈕均採用相對單位，即使在大比例縮放下，文字依然銳利且不跑版。
*   **手機導向設計**：彈出視窗具備「空間壓縮邏輯」，在 200% 縮放下依然能輕鬆滑動操作。

### 👨‍🍳 AI 食譜生成 (Recipe Synthesis)
*   **Gemini 引擎驅動**：串接 Google Gemini API，根據您冰箱內的現有食材一鍵生成食譜。
*   **多元過濾**：支援素食、低卡等飲食偏好設定，自動過敏源比對。

---

## 🛠️ 開發架構與技術棧

*   **前端核心**: React 18 + Vite 7 (最強大的開發體驗)
*   **樣式系統**: TailwindCSS + Framer Motion (精緻的賽博龐克動效)
*   **AI 引擎**: ONNX Runtime Web (WASM / WebGL 加速)
*   **狀態管理**: React Context API
*   **持久化**: 本地 LocalStorage，支援離線操作

---

## 🚀 換機遷移與環境建置 (Migration & Setup)

如果您更換了電腦，或是從 GitHub / 雲端下載了這個專案資料夾，請依照下列步驟快速恢復開發環境：

### 1. 確保基礎環境
請在您的新電腦上安裝 [Node.js](https://nodejs.org/) (建議版本為 **v18** 或 **v20** LTR)。安裝完成後，開啟終端機（Terminal）確認版本：
```powershell
node -v
```

### 2. 下載並進入資料夾
將專案資料夾下載至您的電腦中，並在終端機中進入該目錄：
```powershell
cd fridge-ai-main
```

### 3. 「重新建立」依賴模組 (Node Modules)
**⚠ 重要提醒：** 絕對不要直接拷貝 `node_modules` 資料夾（這會導致路徑或二進位檔案損毀）。請執行下列指令讓系統自動根據 `package.json` 重新安裝：
```powershell
npm install
```
*這會下載所有必要的 React 框架、AI 引擎組件與樣式庫。*

### 4. 啟動應用程式
當依賴安裝完成後，執行以下指令啟動：
```powershell
npm run dev
```
系統會提供一個網址（例如：`http://localhost:5173/`），請用 Chrome 或 Edge 瀏覽器開啟即可開始使用。

### 💡 瀏覽器需求
由於本專案包含 AI 神經網絡運算，建議使用 **Google Chrome** 或 **Microsoft Edge** 瀏覽器，以獲得最佳的 WebGPU / WebGL 硬體加速效能。

---

## 🔒 安全與 API 金鑰保護 (Security & API Keys)

為了確保您的 Google Gemini API Key 不會洩露在公開的 GitHub 倉庫中，本專案實施了以下保護機制：

### 1. 本地開發 (Local Development)
*   系統會讀取根目錄下的 `.env` 檔案。
*   請參考 `.env.example` 建立您的 `.env`：
    ```bash
    VITE_LLM_API_KEY=您的金鑰
    ```
*   `.gitignore` 已設定忽略 `.env`，**金鑰絕不會被 git push 上傳**。

### 2. GitHub Pages 部署 (GitHub Actions)
若要在自動部署的網頁上使用預設金鑰，而不需每次手動輸入：
1.  進入 GitHub 倉庫的 **Settings** -> **Secrets and variables** -> **Actions**。
2.  新增一個 **Repository secret**。
3.  名稱（Name）設定為：`VITE_LLM_API_KEY`。
4.  數值（Value）填入您的 API Key。
5.  下次推送程式碼時，GitHub Actions 會自動將此金鑰注入到編譯後的程式碼中。

### ⚠️ 安全聲明 (Frontend-Only Security)
在「無後端部署」的前提下，API 金鑰會被封裝在 JavaScript Bundle 中。雖然對於一般使用者是不可見的，但對於技術高手仍有被反編譯提取的風險。
*   **建議做法**：在 Google AI Studio 中設定 API 金鑰的 **「IP 限制」** 或 **「使用配額限制」**，以增加安全性。
*   **終極方案**：本 App 支援「使用者手動輸入」。如果您不信任雲端部署，可以不設定 Secret，讓每位使用者在 App 內的「神經節點配置」自行輸入私有金鑰，這也是最安全的模式。

---

## 📖 核心功能開發重點
如果您是開發者，請注意以下架構細節：
*   **AI 核心 (Gemini)**：進入 App 後點擊個人頭像 -> **神經節點配置**，輸入 API Key。
*   **本地辨識 (YOLO)**：模型檔案存放於 `/public/models/`，由 `yoloService.ts` 負責加載。
*   **介面縮放 (UI Scaling)**：全域樣式定義於 `src/app/styles/index.css`，透過 `--zoom-factor` 變數驅動。

---

## 📱 行動載具優化
本專案特別針對手機螢幕進行視窗層級優化，確保在行動端縮放操作時，彈出視窗（Modals）不會溢出螢幕邊界，並保持最佳的滑動體驗。

---

## 🌟 聯絡與支援
如果您在使用或開發上遇到任何問題，請隨時回報。
