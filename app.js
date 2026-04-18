window.gapiLoaded = function() {
    if (window.initializeGapiClient) window.initializeGapiClient();
};
window.gisLoaded = function() {
    if (window.initializeGisClient) window.initializeGisClient();
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Elements
    const homeScreen = document.getElementById('homeScreen');
    const appLayout = document.getElementById('appLayout');
    const createNewProjectBtn = document.getElementById('createNewProjectBtn');
    const projectListEl = document.getElementById('projectList');
    const homeBtn = document.getElementById('homeBtn');

    const editor = document.getElementById('editor');
    const editorContainer = document.getElementById('editorContainer');
    const charCountEl = document.getElementById('charCount');
    const lineCountEl = document.getElementById('lineCount');
    const pageCountEl = document.getElementById('pageCount');
    const fileNameInput = document.getElementById('fileName');
    const mainSidebar = document.getElementById('mainSidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarShowBtn = document.getElementById('sidebarShowBtn');
    const rubyPopup = document.getElementById('rubyPopup');
    const rubyInput = document.getElementById('rubyInput');
    const applyRubyBtn = document.getElementById('applyRubyBtn');
    const cancelRubyBtn = document.getElementById('cancelRubyBtn');

    // Tab Elements
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Inputs
    const charsPerLineInput = document.getElementById('charsPerLine');
    const linesPerPageInput = document.getElementById('linesPerPage');
    const autoScrollToggle = document.getElementById('autoScrollToggle');
    const rubyPopupToggle = document.getElementById('rubyPopupToggle');
    const fontFamilySelect = document.getElementById('fontFamily');
    const themeToggle = document.getElementById('themeToggle');
    const fileInput = document.getElementById('fileInput');

    const boldBtn = document.getElementById('boldBtn');
    const italicBtn = document.getElementById('italicBtn');
    const exportAllBtn = document.getElementById('exportAllBtn');

    // Buttons
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const saveBtn = document.getElementById('saveBtn');
    const importBtn = document.getElementById('importBtn');
    const exportTextBtn = document.getElementById('exportText');
    const exportWordBtn = document.getElementById('exportWord');
    const addBtns = document.querySelectorAll('.add-btn');
    const fullScreenBtn = document.getElementById('fullScreenBtn');
    const inquiryBtn = document.getElementById('inquiryBtn');
    const privacyBtn = document.getElementById('privacyBtn');

    // Modals
    const inquiryModal = document.getElementById('inquiryModal');
    const privacyModal = document.getElementById('privacyModal');
    const modalCloses = document.querySelectorAll('.modal-close');
    const inquiryForm = document.getElementById('inquiryForm');
    const honeypot = document.getElementById('honeypot');
    const saveIndicator = document.getElementById('saveIndicator');
    const gdriveLoginBtn = document.getElementById('gdriveLoginBtn');
    const gdriveLogoutBtn = document.getElementById('gdriveLogoutBtn');
    const saveLocationToggle = document.getElementById('saveLocationToggle');
    const saveLocationSelect = document.getElementById('saveLocationSelect');

    // State
    let projects = [];
    let currentProjectId = null;
    let project = {};

    function createDefaultProject() {
        return {
            id: Date.now().toString(),
            fileName: '無題',
            charsPerLine: 40,
            linesPerPage: 16,
            autoScroll: true,
            rubyPopupEnabled: true,
            fontFamily: "'Shippori Mincho', serif",
            theme: 'dark',
            content: '<p>ここに<ruby>書<rt>か</rt></ruby>き<ruby>込<rt>こ</rt></ruby>んでください……</p>',
            characterItems: [],
            plotItems: [],
            updatedAt: Date.now()
        };
    }

    // --- Persistence ---

    // プロジェクト一覧を読み込んで表示する関数
    function loadProjects() {
        // 保存時と同じキー 'tomoshi_projects_list' を使用
        const savedProjects = localStorage.getItem('tomoshi_projects_list');

        if (savedProjects) {
            // 保存データがあればグローバルの projects に格納
            projects = JSON.parse(savedProjects);
        } else {
            // --- 初回訪問時のデフォルトプロジェクトを設定 ---
            const defaultProject = createDefaultProject();
            defaultProject.fileName = "灯エディタの使い方";
            defaultProject.content =
                "<p><b>　灯エディタへようこそ！</b></p>" +
                "<p>縦書きやルビ振りが楽しめるシンプルな執筆エディタです。</p>" +
                "<p><br></p>" +
                "<p><b>【基本の使い方】</b></p>" +
                "<p><b>〇始め方</b></p>" +
                "<p>・HOME画面で＋ボタンを押すと新しいプロジェクトが始められます</p>" +
                "<p>・編集したいプロジェクトを押すとそのプロジェクトを編集できます</p>" +
                "<p><br></p>" +
                "<p><b>〇ファイル名</b></p>" +
                "<p>・左の操作バーの「ファイル名」からいつでもファイル名を変更できます</p>" +
                "<p>・設定したファイル名で出力されます</p>" +
                "<p>・ファイルを読み込んだ場合、読み込んだファイル名が反映されます</p>" +
                "<p><br></p>" +
                "<p><b>〇文字数・行数</b></p>" +
                "<p>・設定文字数によってフォントサイズが自動で変わります</p>" +
                "<p>・いつでも変更できるので、編集しやすい大きさに設定してください</p>" +
                "<p>・文字数・行数を設定すると、操作バーの左下でいつでもページ数を確認できます</p>" +
                "<p><br></p>" +
                "<p><b>〇追尾モード</b></p>" +
                "<p>・オンにすると、編集している場所に自動で焦点が合います</p>" +
                "<p><br></p>" +
                "<p><b>〇ポップアップ</b></p>" +
                "<p>・オンにすると、ルビの編集ができるようになります</p>" +
                "<p>・オフにしても、Ctrl+B・Ctrl+Cで太字・斜字の変更は可能です</p>" +
                "<p><br></p>" +
                "<p><b>〇元に戻す・やり直し</b></p>" +
                "<p>・Ctrl+X・Ctrl+Yのショートカットキーもお使いいただけます</p>" +
                "<p><br></p>" +
                "<p><b>〇書体</b></p>" +
                "<p>・いつでも変更可能です</p>" +
                "<p>・現在は「しっぽり明朝」「Noto Serif JP」「標準明朝」「ゴシック」の4つをサポートしています</p>" +
                "<p>・個々の文字だけ変えることはできません</p>" +
                "<p><br></p>" +
                "<p><b>〇テーマ</b></p>" +
                "<p>・ライトモードとダークモードの切り替えが可能です</p>" +
                "<p>・全画面表示ボタンまたはF11キーを押すことで全画面表示が可能です</p>" +
                "<p><br></p>" +
                "<p><b>〇ファイル操作</b></p>" +
                "<p>・保存（Ctrl+S）でブラウザに保存します。この操作をしなくても自動的にブラウザに保存されます</p>" +
                "<p>・読み込みで外部からのテキストファイルを開くことが可能です</p>" +
                "<p>・Text出力が最も確実な保存方法です</p>" +
                "<p>・ルビは青空文庫形式（|○○《ルビ》）で保存されます</p>" +
                "<p>・Word出力は現在開発中です</p>" +
                "<p><br></p>" +
                "<p><b>〇キャラ・プロット</b></p>" +
                "<p>・キャラ設定やプロットをメモとして残すことが可能です</p>" +
                "<p><br></p>" +
                "<p><b>〇操作バー最小化</b></p>" +
                "<p>・操作バーの右上にある「∨」のボタンで操作バーを最小化できます</p>" +
                "<p>・最小化した状態で「|||」を押すと操作バーを再度表示することができます</p>" +
                "<p><br></p>" +
                "<p><b>【注意】</b></p>" +
                "<p>・Word出力は現在改良中なので、お使いしないほうが良いと思います</p>" +
                "<p>・プロジェクトはブラウザに保存しているだけですので、キャッシュクリアやブラウザの変更によりデータが消える可能性があります。定期的な出力（バックアップ）をお勧めします</p>";

            projects.push(defaultProject);
            // 初回データを保存
            saveProjectsList();
        }

        // ホーム画面のプロジェクト一覧を描画
        renderHome();
    }

    function saveProjectsList() {
        localStorage.setItem('tomoshi_projects_list', JSON.stringify(projects));
    }

    // --- Google Drive Integration & Save Logic ---
    let tokenClient;
    let accessToken = null;
    let driveFolderId = null;

    window.initializeGapiClient = async function() {
        try {
            await gapi.client.init({
                apiKey: typeof GAPI_API_KEY !== 'undefined' ? GAPI_API_KEY : '',
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
            });
        } catch(e) {
            console.error('GAPI init failed', e);
        }
    };

    window.initializeGisClient = function() {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: typeof GAPI_CLIENT_ID !== 'undefined' ? GAPI_CLIENT_ID : '',
            scope: "https://www.googleapis.com/auth/drive.file",
            callback: (resp) => {
                if (resp.error !== undefined) {
                    throw (resp);
                }
                accessToken = resp.access_token;
                handleAuthChange(true);
            },
        });
    };

    function handleAuthChange(isAuthenticated) {
        if (isAuthenticated) {
            gdriveLoginBtn.classList.add('hidden');
            gdriveLogoutBtn.classList.remove('hidden');
            saveLocationToggle.classList.remove('hidden');
            saveLocationSelect.value = 'drive';
            // Sync default when logged in
            triggerDebouncedSave();
        } else {
            gdriveLoginBtn.classList.remove('hidden');
            gdriveLogoutBtn.classList.add('hidden');
            saveLocationToggle.classList.add('hidden');
            saveLocationSelect.value = 'local';
            accessToken = null;
        }
    }

    gdriveLoginBtn.addEventListener('click', () => {
        if (tokenClient) {
            tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
            alert("Google APIが読み込めていません");
        }
    });

    gdriveLogoutBtn.addEventListener('click', () => {
        if (accessToken) {
            google.accounts.oauth2.revoke(accessToken, () => {
                console.log('access token revoked');
            });
            handleAuthChange(false);
        }
    });

    saveLocationSelect.addEventListener('change', () => {
        saveProject(true);
    });

    async function getOrCreateDriveFolder() {
        if (driveFolderId) return driveFolderId;
        try {
            const response = await gapi.client.drive.files.list({
                q: "mimeType='application/vnd.google-apps.folder' and name='灯エディタ_保存データ' and trashed=false",
                fields: 'files(id, name)',
            });
            const files = response.result.files;
            if (files && files.length > 0) {
                driveFolderId = files[0].id;
                return driveFolderId;
            } else {
                const folderMetadata = {
                    'name': '灯エディタ_保存データ',
                    'mimeType': 'application/vnd.google-apps.folder'
                };
                const createResponse = await gapi.client.drive.files.create({
                    resource: folderMetadata,
                    fields: 'id'
                });
                driveFolderId = createResponse.result.id;
                return driveFolderId;
            }
        } catch (err) {
            console.error('Error finding/creating folder', err);
            return null;
        }
    }

    async function syncToDrive(projectData) {
        if (!accessToken || saveLocationSelect.value !== 'drive') return;
        
        const folderId = await getOrCreateDriveFolder();
        if (!folderId) {
            setSaveStatus('error');
            return;
        }

        const projectJson = JSON.stringify(projectData);
        const fileContent = new Blob([projectJson], {type: 'application/json'});
        const fileName = `${projectData.fileName}_${projectData.id}.json`;

        try {
            if (projectData.googleDriveFileId) {
                const url = `https://www.googleapis.com/upload/drive/v3/files/${projectData.googleDriveFileId}?uploadType=media`;
                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: new Headers({'Authorization': 'Bearer ' + accessToken}),
                    body: fileContent
                });
                if (!response.ok) throw new Error('Drive upload failed');
            } else {
                const listResp = await gapi.client.drive.files.list({
                    q: `'${folderId}' in parents and name='${fileName}' and trashed=false`,
                    fields: 'files(id, name)'
                });
                if (listResp.result.files && listResp.result.files.length > 0) {
                    projectData.googleDriveFileId = listResp.result.files[0].id;
                    const url = `https://www.googleapis.com/upload/drive/v3/files/${projectData.googleDriveFileId}?uploadType=media`;
                    await fetch(url, {
                        method: 'PATCH',
                        headers: new Headers({'Authorization': 'Bearer ' + accessToken}),
                        body: fileContent
                    });
                } else {
                    const metadata = {
                        'name': fileName,
                        'parents': [folderId],
                        'mimeType': 'application/json'
                    };
                    const form = new FormData();
                    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
                    form.append('file', fileContent);
                    const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: new Headers({'Authorization': 'Bearer ' + accessToken}),
                        body: form
                    });
                    if (!response.ok) throw new Error('Drive creation failed');
                    const data = await response.json();
                    projectData.googleDriveFileId = data.id;
                    saveProjectsList();
                }
            }
            setSaveStatus('saved');
        } catch(e) {
            console.error('Sync failed', e);
            setSaveStatus('error');
        }
    }

    function setSaveStatus(status) {
        if (!saveIndicator) return;
        saveIndicator.classList.remove('hidden');
        if (status === 'saving') {
            saveIndicator.innerHTML = '<i data-lucide="loader" class="spin" style="width: 12px; height: 12px;"></i> <span>保存中...</span>';
        } else if (status === 'saved') {
            saveIndicator.innerHTML = '<i data-lucide="check-circle" style="width: 12px; height: 12px; color: #10b981;"></i> <span>保存済み</span>';
            setTimeout(() => {
                if (saveIndicator.innerHTML.includes('保存済み')) saveIndicator.classList.add('hidden');
            }, 3000);
        } else if (status === 'error') {
            saveIndicator.innerHTML = '<i data-lucide="alert-circle" style="width: 12px; height: 12px; color: #ef4444;"></i> <span>保存失敗</span>';
        } else if (status === 'wait') {
            saveIndicator.innerHTML = '<i data-lucide="edit-2" style="width: 12px; height: 12px;"></i> <span>編集中...</span>';
        }
        lucide.createIcons();
    }

    let saveTimeout = null;
    function triggerDebouncedSave() {
        setSaveStatus('wait');
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveProject(false);
        }, 3000);
    }

    async function saveProject(isManualEvent = false) {
        if (!currentProjectId) return;

        if (saveTimeout) clearTimeout(saveTimeout);
        setSaveStatus('saving');

        // Validation: File name is required
        if (!fileNameInput.value.trim()) {
            fileNameInput.classList.add('error');
            setSaveStatus('error');
            return;
        }
        fileNameInput.classList.remove('error');

        project.fileName = fileNameInput.value;
        project.charsPerLine = parseInt(charsPerLineInput.value);
        project.linesPerPage = parseInt(linesPerPageInput.value);
        project.autoScroll = autoScrollToggle.checked;
        project.rubyPopupEnabled = rubyPopupToggle.checked;
        project.fontFamily = fontFamilySelect.value;
        project.theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        project.content = editor.innerHTML;
        project.updatedAt = Date.now();

        const idx = projects.findIndex(p => p.id === currentProjectId);
        if (idx !== -1) {
            projects[idx] = project;
        } else {
            projects.push(project);
        }
        saveProjectsList(); // Local save

        if (accessToken && saveLocationSelect.value === 'drive') {
            await syncToDrive(project); // syncs and sets resolved saved status
        } else {
            setSaveStatus('saved');
        }

        if (isManualEvent) {
            showTomoshiToast('プロジェクトを保存しました');
        }
    }

    function openProject(id) {
        const found = projects.find(p => p.id === id);
        if (found) {
            project = JSON.parse(JSON.stringify(found)); // deep copy
            currentProjectId = id;

            // Apply states
            fileNameInput.value = project.fileName;
            charsPerLineInput.value = project.charsPerLine || 40;
            linesPerPageInput.value = project.linesPerPage || 16;
            autoScrollToggle.checked = project.autoScroll !== false;
            rubyPopupToggle.checked = project.rubyPopupEnabled !== false;
            fontFamilySelect.value = project.fontFamily || "'Shippori Mincho', serif";

            if (project.theme === 'light') {
                document.body.classList.add('light-mode');
            } else {
                document.body.classList.remove('light-mode');
            }

            editor.innerHTML = project.content || '<p>ここに<ruby>書<rt>か</rt></ruby>き<ruby>込<rt>こ</rt></ruby>んでください……</p>';

            renderItemList('character');
            renderItemList('plot');

            // Show Editor, Hide Home
            homeScreen.classList.add('hidden');
            appLayout.classList.remove('hidden');
            lucide.createIcons();

            // 描画が完了してからサイズを再計算させる
            setTimeout(() => {
                updateStyles();
                updateStats();
                editor.focus();
                const sel = window.getSelection();
                if (sel) sel.collapse(editor, 0);

                // ページの右端が画面中央に表示されるようにする
                alignRightEdgeToCenter();
            }, 10);

            // pushState routing
            if (window.location.hash !== `#project-${id}`) {
                history.pushState(null, '', `#project-${id}`);
            }
        }
    }

    function goHome() {
        if (currentProjectId) saveProject();
        currentProjectId = null;
        appLayout.classList.add('hidden');
        homeScreen.classList.remove('hidden');
        renderHome();

        if (window.location.hash !== '') {
            history.pushState(null, '', window.location.pathname + window.location.search);
        }
    }

    function renderHome() {
        projectListEl.innerHTML = '';
        if (projects.length === 0) {
            projectListEl.innerHTML = '<p style="color: #888;">新しいプロジェクトを作成してください。</p>';
            return;
        }

        // Sort by updatedAt desc
        const sorted = [...projects].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

        sorted.forEach(p => {
            const date = new Date(p.updatedAt || Date.now()).toLocaleString();
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <div class="project-info-home">
                    <h3>${p.fileName}</h3>
                    <p>最終更新: ${date}</p>
                </div>
                <div class="project-card-actions">
                    <button class="delete-project-btn" title="削除"><i data-lucide="trash-2"></i></button>
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.closest('.delete-project-btn')) return;
                openProject(p.id);
            });

            card.querySelector('.delete-project-btn').addEventListener('click', () => {
                if (confirm(`「${p.fileName}」を本当に削除しますか？`)) {
                    projects = projects.filter(item => item.id !== p.id);
                    saveProjectsList();
                    renderHome();
                }
            });

            projectListEl.appendChild(card);
        });
        lucide.createIcons();
    }

    // --- Home Screen Events ---
    createNewProjectBtn.addEventListener('click', () => {
        const newProj = createDefaultProject();
        projects.push(newProj);
        saveProjectsList();
        openProject(newProj.id);
    });

    homeBtn.addEventListener('click', () => {
        goHome();
    });

    window.addEventListener('popstate', handleRoute);

    function handleRoute() {
        const hash = window.location.hash;
        if (hash.startsWith('#project-')) {
            const id = hash.replace('#project-', '');
            openProject(id);
        } else {
            goHome();
        }
    }

    // --- Sanitization & Import Ruby parsing ---

    function parseRubyToHTML(text) {
        // |ルビ対象《ルビ》 or |ルビ対象（対象）《ルビ》 -> <ruby>ルビ対象<rt>ルビ</rt></ruby>
        // Use a regex to match the pattern: |...《...》
        return text.replace(/\|([^《]+?)《([^》]+?)》/g, (match, base, rt) => {
            return `<ruby>${base}<rt>${rt}</rt></ruby>`;
        });
    }

    function sanitizeHtml(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;

        const allowedTags = ['RUBY', 'RT', 'BR', 'P', 'DIV'];

        function clean(node) {
            const children = Array.from(node.childNodes);
            children.forEach(child => {
                if (child.nodeType === Node.ELEMENT_NODE) {
                    if (!allowedTags.includes(child.nodeName)) {
                        const text = child.innerText || child.textContent;
                        child.replaceWith(document.createTextNode(text));
                    } else {
                        // Remove all attributes (style, class, etc.)
                        while (child.attributes.length > 0) {
                            child.removeAttribute(child.attributes[0].name);
                        }
                        clean(child);
                    }
                }
            });
        }

        clean(temp);
        return temp.innerHTML;
    }

    // --- Editor Styles & Font Size ---

    function updateStyles() {
        if (!appLayout || appLayout.classList.contains('hidden')) return;
        const containerHeight = editorContainer.clientHeight;

        const paperMargin = 40;
        const paperHeight = containerHeight - paperMargin;
        const paperPadding = 80;
        const availableHeight = paperHeight - paperPadding;

        const chars = parseInt(charsPerLineInput.value) || 20;
        const fontSize = availableHeight / chars;

        editor.style.fontSize = `${fontSize}px`;
        editor.style.fontFamily = fontFamilySelect.value;
        editor.style.lineHeight = '1.8';
        editor.style.height = `${paperHeight}px`;
    }

    function updateStats() {
        const text = editor.innerText || '';
        const chars = text.replace(/\n/g, '').length;

        // Count lines including empty blocks
        const blocks = Array.from(editor.childNodes);
        let linesCount = 0;
        if (blocks.length === 0 && text.length > 0) {
            linesCount = 1;
        } else {
            blocks.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && (node.nodeName === 'P' || node.nodeName === 'DIV')) {
                    linesCount++;
                } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'BR') {
                    // Raw BR
                    linesCount++;
                } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                    // Check if it's not wrapped
                    linesCount++;
                }
            });
            // fallback
            if (linesCount === 0 && text.length > 0) {
                linesCount = text.split('\n').length;
            }
        }
        // At least 1 line if empty
        if (linesCount === 0) linesCount = 1;

        const linesPerPage = parseInt(linesPerPageInput.value) || 20;
        const pageCount = Math.ceil(linesCount / linesPerPage);

        charCountEl.textContent = chars;
        lineCountEl.textContent = linesCount;
        pageCountEl.textContent = pageCount;
    }

    // --- Ruby Support (Selection Popup) ---

    let currentSelectionRange = null;

    function clearRubyHighlight() {
        if (window.CSS && CSS.highlights) {
            CSS.highlights.delete("ruby-selection");
        }
        // Fallback for visual indication if needed could be added here
        // but Highlight API is standard in modern browsers.
    }

    function addRubyHighlight(range) {
        clearRubyHighlight();
        if (window.CSS && CSS.highlights) {
            const highlight = new Highlight(range);
            CSS.highlights.set("ruby-selection", highlight);
        }
    }

    function restoreSelection() {
        if (currentSelectionRange) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(currentSelectionRange);
        }
    }

    function alignRightEdgeToCenter() {
        if (!appLayout || appLayout.classList.contains('hidden')) return;
        const paperRect = editor.getBoundingClientRect();
        const containerRect = editorContainer.getBoundingClientRect();
        const paperRight = paperRect.right;
        const centerX = containerRect.left + (containerRect.width / 2);

        editorContainer.scrollBy({
            left: paperRight - centerX,
            behavior: 'auto'
        });
    }

    function handleSelection() {
        if (!rubyPopupToggle.checked) {
            rubyPopup.classList.add('hidden');
            clearRubyHighlight();
            return;
        }

        const selection = window.getSelection();
        if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
            const range = selection.getRangeAt(0);

            // Check if selection is within editor
            if (editor.contains(range.commonAncestorContainer)) {
                currentSelectionRange = range.cloneRange();
                const rect = range.getBoundingClientRect();

                addRubyHighlight(currentSelectionRange);

                rubyPopup.classList.remove('hidden');

                // Adjust position so it doesn't go off-screen at the top
                const popupRect = rubyPopup.getBoundingClientRect();
                const popupHeight = popupRect.height || 64;

                if (rect.top - (popupHeight * 1.2) < 10) {
                    // Position below selection
                    rubyPopup.style.transform = 'translate(-50%, 0)';
                    rubyPopup.style.top = `${rect.bottom + 10}px`;
                } else {
                    // Normal position above selection
                    rubyPopup.style.transform = 'translate(-50%, -120%)';
                    rubyPopup.style.top = `${rect.top}px`;
                }

                rubyPopup.style.left = `${rect.left + rect.width / 2}px`;
                return;
            }
        }
        if (document.activeElement === rubyInput || rubyPopup.contains(document.activeElement)) {
            return;
        }
        rubyPopup.classList.add('hidden');
        clearRubyHighlight();
    }

    applyRubyBtn.addEventListener('click', () => {
        const rubyText = rubyInput.value.trim();
        clearRubyHighlight();
        if (rubyText && currentSelectionRange) {
            const selectedText = currentSelectionRange.toString();
            const rubyElement = document.createElement('ruby');
            rubyElement.innerHTML = `${selectedText}<rt>${rubyText}</rt>`;

            currentSelectionRange.deleteContents();
            currentSelectionRange.insertNode(rubyElement);

            rubyInput.value = '';
            rubyPopup.classList.add('hidden');
            window.getSelection().removeAllRanges();
            updateStats();
            saveProject();
        }
    });

    cancelRubyBtn.addEventListener('click', () => {
        rubyPopup.classList.add('hidden');
        clearRubyHighlight();
        window.getSelection().removeAllRanges();
    });

    // mousedownでフォーカスの奪取防止（ルビ振り時も選択を維持するため）
    rubyPopup.addEventListener('mousedown', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.id !== 'rubyInput') {
            e.preventDefault();
        }
    });

    if (boldBtn) {
        boldBtn.addEventListener('click', (e) => {
            e.preventDefault();
            restoreSelection();
            document.execCommand('bold', false, null);
            updateStats();
            saveProject();
        });
    }

    if (italicBtn) {
        italicBtn.addEventListener('click', (e) => {
            e.preventDefault();
            restoreSelection();
            document.execCommand('italic', false, null);
            updateStats();
            saveProject();
        });
    }

    autoScrollToggle.addEventListener('change', () => {
        saveProject();
    });

    rubyPopupToggle.addEventListener('change', () => {
        saveProject();
    });

    // --- Sidebar & Tabs ---

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            navBtns.forEach(b => b.classList.toggle('active', b === btn));
            tabPanes.forEach(p => p.classList.toggle('active', p.id === `tab-${tab}`));
        });
    });

    sidebarToggle.addEventListener('click', () => {
        mainSidebar.classList.add('hidden');
        sidebarShowBtn.classList.remove('hidden');
    });

    sidebarShowBtn.addEventListener('click', () => {
        mainSidebar.classList.remove('hidden');
        sidebarShowBtn.classList.add('hidden');
    });

    // --- Character & Plot Items ---

    function renderItemList(type) {
        const listEl = document.getElementById(`${type}List`);
        const items = type === 'character' ? project.characterItems : project.plotItems;
        listEl.innerHTML = '';

        items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'sidebar-item';
            div.innerHTML = `
                <div class="item-header">
                    <input class="item-title" value="${item.title}">
                    <button class="delete-item-btn" title="削除">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
                <textarea class="item-content" placeholder="詳細を入力...">${item.content}</textarea>
            `;

            div.querySelector('.item-title').addEventListener('input', (e) => {
                items[index].title = e.target.value;
                saveProject();
            });

            div.querySelector('.item-content').addEventListener('input', (e) => {
                items[index].content = e.target.value;
                saveProject();
            });

            div.querySelector('.delete-item-btn').addEventListener('click', () => {
                if (confirm('削除してもよろしいですか？')) {
                    items.splice(index, 1);
                    renderItemList(type);
                    saveProject();
                }
            });

            listEl.appendChild(div);
        });
        lucide.createIcons();
    }

    addBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            const items = type === 'character' ? project.characterItems : project.plotItems;
            items.push({
                title: type === 'character' ? '新キャラクター' : '新プロット',
                content: ''
            });
            renderItemList(type);
            saveProject();
        });
    });

    // --- Editor Logic ---
    function scrollToCaret() {
        if (!autoScrollToggle.checked) return;

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const containerRect = editorContainer.getBoundingClientRect();

            const caretX = rect.left;
            const centerX = containerRect.left + (containerRect.width / 2);
            const diff = centerX - caretX;

            editorContainer.scrollBy({
                left: -diff,
                behavior: 'smooth'
            });

            const editorRect = editor.getBoundingClientRect();
            const distanceToLeftEdge = rect.left - editorRect.left;

            if (distanceToLeftEdge < containerRect.width / 2) {
                const currentMinWidth = parseFloat(getComputedStyle(editor).minWidth);
                editor.style.minWidth = `${currentMinWidth + (containerRect.width / 2)}px`;
            }
        }
    }

    // --- Full Screen ---

    fullScreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            document.getElementById('fullScreenToast').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('fullScreenToast').classList.add('hidden');
            }, 3000);
        } else {
            document.exitFullscreen();
        }
    });

    // --- Modals ---

    inquiryBtn.addEventListener('click', () => inquiryModal.classList.remove('hidden'));
    privacyBtn.addEventListener('click', () => privacyModal.classList.remove('hidden'));

    modalCloses.forEach(btn => {
        btn.addEventListener('click', () => {
            inquiryModal.classList.add('hidden');
            privacyModal.classList.add('hidden');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === inquiryModal) inquiryModal.classList.add('hidden');
        if (e.target === privacyModal) privacyModal.classList.add('hidden');
    });

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            if (honeypot && honeypot.value !== "") {
                e.preventDefault();
                return;
            }

            setTimeout(() => {
                showTomoshiToast("送信が完了しました");
                inquiryForm.reset();
                if (inquiryModal) inquiryModal.classList.add('hidden');
            }, 500);
        });
    }

    // --- File IO ---

    importBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        project.fileName = file.name.replace(/\.[^/.]+$/, "");
        fileNameInput.value = project.fileName;

        if (file.name.endsWith('.docx')) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            editor.innerHTML = sanitizeHtml(result.value);
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                let text = e.target.result;
                // Parse Ruby from imported text
                text = parseRubyToHTML(text);
                const html = text.split('\n').map(l => {
                    return l === '' ? '<p><br></p>' : `<p>${l}</p>`;
                }).join('');
                // Note: sanitization already allows Ruby and RT after parsed
                editor.innerHTML = sanitizeHtml(html);
                updateStats();
                saveProject();
            };
            reader.readAsText(file);
        }
        updateStats();
        saveProject();
        // Reset file input
        fileInput.value = '';
    });

    function domToText(element) {
        let lines = [];

        // blocks: P and DIV.
        const children = Array.from(element.childNodes);
        children.forEach(node => {
            let lineText = '';
            if (node.nodeType === Node.TEXT_NODE) {
                lineText = node.textContent;
                if (lineText) lines.push(lineText);
            } else if (node.nodeName === 'DIV' || node.nodeName === 'P') {
                // handle internals for Ruby
                lineText = nodeToTextWithRuby(node);
                // empty line output as blank string
                lines.push(lineText);
            } else if (node.nodeName === 'BR') {
                lines.push('');
            } else if (node.nodeName === 'RUBY') {
                lines.push(nodeToTextWithRuby(node));
            }
        });

        // Join by \n, but clean up trailing breaks if absolutely needed
        return lines.join('\n');
    }

    function nodeToTextWithRuby(node) {
        let result = '';
        const walk = (n) => {
            if (n.nodeType === Node.TEXT_NODE) {
                result += n.textContent;
            } else if (n.nodeName === 'RUBY') {
                const base = Array.from(n.childNodes)
                    .filter(child => child.nodeName !== 'RT')
                    .map(child => child.textContent)
                    .join('');
                const rt = n.querySelector('rt')?.textContent || '';
                result += `|${base}《${rt}》`;
            } else if (n.nodeName === 'BR') {
                // Ignore BR inside P or DIV if it's just filler, unless we want inline breaks
                // Generally P or DIV handles the line structure
            } else {
                n.childNodes.forEach(walk);
            }
        };
        walk(node);
        // If empty block with just BR, result is '' which gives us empty line.
        return result;
    }

    function showTomoshiToast(message) {
        const toast = document.createElement('div');
        toast.className = 'tomoshi-toast';
        toast.innerHTML = `
        <i data-lucide="flame" style="width: 32px; height: 32px; margin: 0 auto;"></i>
        <span>${message}</span>
    `;
        document.body.appendChild(toast);
        lucide.createIcons();
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 800);
        }, 3000);
    }

    saveBtn.addEventListener('click', () => {
        saveProject(true);
    });

    exportTextBtn.addEventListener('click', () => {
        const text = domToText(editor);
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${project.fileName}.txt`;
        link.click();
    });

    // Pyodideの初期化（関数を少し強化しました）
    let pyodideReady = null;
    async function initPyodide() {
        if (pyodideReady) return pyodideReady;

        // ロード中であることをユーザーに伝えると親切です
        console.log("Python環境を起動中...");

        pyodideReady = (async () => {
            const py = await loadPyodide();
            await py.loadPackage("micropip");
            const micropip = py.pyimport("micropip");
            // python-docxのインストール
            await micropip.install("python-docx");
            console.log("Python環境の準備が完了しました");
            return py;
        })();
        return pyodideReady;
    }

    exportWordBtn.addEventListener('click', async () => {
        const originalText = exportWordBtn.innerHTML;
        exportWordBtn.disabled = true;
        exportWordBtn.innerText = "生成中...";

        try {
            const py = await initPyodide();

            py.globals.set("text_data", domToText(editor));
            py.globals.set("file_name", fileNameInput.value || 'novel');
            py.globals.set("chars_data", parseInt(charsPerLineInput.value) || 40);
            py.globals.set("lines_data", parseInt(linesPerPageInput.value) || 16);

            const pythonCode = `
import io
from docx import Document
from docx.shared import Pt, Mm
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from docx.enum.section import WD_ORIENT

def create_docx(text, chars, lines):
    doc = Document()
    
    # セクション設定
    section = doc.sections[0]
    section.orientation = WD_ORIENT.PORTRAIT
    section.page_width = Mm(210)
    section.page_height = Mm(297)

    # --- 縦書き設定 (XML直接操作) ---
    sectPr = section._sectPr
    vPr = OxmlElement('w:vTextDirection')
    vPr.set(qn('w:val'), 'tb-rl') # Top-to-Bottom, Right-to-Left (縦書き)
    sectPr.append(vPr)

    # 余白設定 (縦書き時は上下左右の感覚が入れ替わることがあるため調整)
    section.top_margin = Mm(30)
    section.bottom_margin = Mm(30)
    section.left_margin = Mm(30)
    section.right_margin = Mm(30)

    # デフォルトフォント
    style = doc.styles['Normal']
    style.font.name = 'MS Mincho'
    style.font.size = Pt(11)
    # 日本語フォント用の明示的指定
    style._element.rPr.rFonts.set(qn('w:eastAsia'), 'MS Mincho')

    # 本文追加
    paragraphs = text.split('\\n')
    for p_text in paragraphs:
        # 空行も維持
        p = doc.add_paragraph(p_text if p_text.strip() else "")
        # 縦書き時の行間調整（必要に応じて数値を変更してください）
        p.paragraph_format.line_spacing = 1.5

    target = io.BytesIO()
    doc.save(target)
    return target.getvalue()

create_docx(text_data, chars_data, lines_data)
`;

            const result = await py.runPythonAsync(pythonCode);
            const docxUint8Array = result.toJs();

            const blob = new Blob([docxUint8Array], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileNameInput.value || 'novel'}.docx`;
            link.click();
            URL.revokeObjectURL(url);
            result.destroy();

        } catch (err) {
            console.error("Pyodide Error:", err);
            alert("Word出力中にエラーが発生しました。");
        } finally {
            exportWordBtn.disabled = false;
            exportWordBtn.innerHTML = originalText;
        }
    });

    // --- Shortcuts ---

    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 's') {
                e.preventDefault();
                saveProject(true);
            } else if (e.key === 'b') {
                e.preventDefault();
                if (!appLayout.classList.contains('hidden')) {
                    document.execCommand('bold', false, null);
                    updateStats();
                    saveProject();
                }
            } else if (e.key === 'i') {
                e.preventDefault();
                if (!appLayout.classList.contains('hidden')) {
                    document.execCommand('italic', false, null);
                    updateStats();
                    saveProject();
                }
            }
        }
    });

    if (exportAllBtn) {
        exportAllBtn.addEventListener('click', () => {
            if (projects.length === 0) {
                alert("出力するプロジェクトがありません。");
                return;
            }
            let combinedText = '';
            projects.forEach((p, index) => {
                const temp = document.createElement('div');
                temp.innerHTML = p.content;
                const text = domToText(temp);
                if (index > 0) combinedText += `\n\n`;
                combinedText += `========================================\n`;
                combinedText += `タイトル：${p.fileName}\n`;
                combinedText += `最終更新：${new Date(p.updatedAt || Date.now()).toLocaleString()}\n`;
                combinedText += `========================================\n\n`;
                combinedText += text;
            });

            const blob = new Blob([combinedText.trim()], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `灯エディタ_全プロジェクトバックアップ_${new Date().toLocaleDateString().replace(/\//g, '')}.txt`;
            link.click();
        });
    }

    // --- Listeners ---

    editor.addEventListener('input', () => {
        updateStats();
        scrollToCaret();
        triggerDebouncedSave();
    });

    editor.addEventListener('mouseup', handleSelection);
    editor.addEventListener('keyup', (e) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            handleSelection();
        }
    });

    // TAB indent
    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            // Insert full-width space for indent
            document.execCommand('insertText', false, '　');
        }
    });

    charsPerLineInput.addEventListener('input', () => {
        updateStyles();
        saveProject();
    });

    linesPerPageInput.addEventListener('input', () => {
        updateStats();
        saveProject();
    });

    fontFamilySelect.addEventListener('change', () => {
        updateStyles();
        saveProject();
    });

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        saveProject();
        lucide.createIcons();
    });

    window.addEventListener('resize', updateStyles);

    undoBtn.addEventListener('click', () => {
        document.execCommand('undo', false, null);
        updateStats();
    });

    redoBtn.addEventListener('click', () => {
        document.execCommand('redo', false, null);
        updateStats();
    });

    // Initial Load
    loadProjects();
    handleRoute();
});
