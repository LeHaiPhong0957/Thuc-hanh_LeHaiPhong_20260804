/* ==============================================================================
   CLIENT JAVASCRIPT - LÊ HẢI PHONG-Seawind
   Features: Dynamic Menu Engine, Portal Switching, Exam Anti-Cheat, Q&A Forum
   ============================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Initializing LÊ HẢI PHONG-Seawind Web Application...");

    // State Variables
    let currentExam = null;
    let userAnswers = {};
    let tabSwitchCount = 0;
    let timerInterval = null;
    let remainingSeconds = 600; // 10 mins

    // 1. Dynamic Menu Engine Fetch & Render
    fetchDynamicMenu();

    // 2. Setup Portal Tab Switchers
    setupPortalTabs();

    // 3. Setup Anti-Cheat Detection for Online Exams
    setupAntiCheatEngine();

    // 4. Load Data from Backend REST API
    loadCourses();
    loadExamData();
    loadForumTopics();

    // 5. Form Handlers & Modal
    setupFormHandlers();
});

// ==============================================================================
// 1. DYNAMIC MENU ENGINE (NGANG / DỌC / MẸ / CON)
// ==============================================================================
async function fetchDynamicMenu() {
    try {
        const response = await fetch('/api/menu');
        const result = await response.json();
        if (result.success) {
            renderNavMenu(result.data);
        }
    } catch (err) {
        console.warn("Using fallback static menu data...", err);
    }
}

function renderNavMenu(menuList) {
    const navMenuEl = document.getElementById('nav-menu-list');
    if (!navMenuEl) return;

    navMenuEl.innerHTML = menuList.map(item => {
        const hasChildren = item.children && item.children.length > 0;
        return `
            <li class="nav-item">
                <a href="${item.url}" class="nav-link">
                    ${item.title}
                    ${hasChildren ? '<span class="arrow-down">▼</span>' : ''}
                </a>
                ${hasChildren ? renderDropdownLevel1(item.children) : ''}
            </li>
        `;
    }).join('');
}

function renderDropdownLevel1(childrenList) {
    return `
        <ul class="dropdown-menu">
            ${childrenList.map(child => {
                const hasSubchildren = child.children && child.children.length > 0;
                return `
                    <li class="dropdown-item">
                        <a href="${child.url}" class="dropdown-link">
                            ${child.title}
                            ${hasSubchildren ? '<span>▸</span>' : ''}
                        </a>
                        ${hasSubchildren ? renderSubmenuLevel2(child.children) : ''}
                    </li>
                `;
            }).join('')}
        </ul>
    `;
}

function renderSubmenuLevel2(subchildrenList) {
    return `
        <ul class="submenu">
            ${subchildrenList.map(sub => `
                <li class="dropdown-item">
                    <a href="${sub.url}" class="dropdown-link">${sub.title}</a>
                </li>
            `).join('')}
        </ul>
    `;
}

// ==============================================================================
// 2. PORTAL SWITCHING SYSTEM
// ==============================================================================
function setupPortalTabs() {
    const tabBtns = document.querySelectorAll('.portal-tab-btn');
    const panels = document.querySelectorAll('.panel-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPortal = btn.getAttribute('data-portal');

            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPanel = document.getElementById(`portal-${targetPortal}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
                window.scrollTo({ top: targetPanel.offsetTop - 100, behavior: 'smooth' });
            }
        });
    });
}

function switchPortal(portalName) {
    const btn = document.querySelector(`.portal-tab-btn[data-portal="${portalName}"]`);
    if (btn) btn.click();
}

// ==============================================================================
// 3. COURSES LOADER
// ==============================================================================
async function loadCourses() {
    const grid = document.getElementById('courses-grid-container');
    if (!grid) return;

    try {
        const res = await fetch('/api/courses');
        const result = await res.json();
        if (result.success && result.data) {
            grid.innerHTML = result.data.map(course => `
                <div class="course-card">
                    <div class="course-thumb">
                        🎓
                        <div class="course-badge">${course.discountBadge}</div>
                    </div>
                    <div class="course-body">
                        <span class="course-category">${course.category}</span>
                        <h3 class="course-title">${course.title}</h3>
                        <div class="price-row">
                            <span class="price-discount">${course.priceDiscount}</span>
                            <span class="price-original">${course.priceOriginal}</span>
                        </div>
                        <ul class="course-highlights">
                            ${course.highlights.map(h => `<li>${h}</li>`).join('')}
                        </ul>
                        <button class="btn-cta-gold" style="width:100%; margin-top: auto; justify-content:center;" onclick="openConsultationModal('${course.title}')">
                            ĐĂNG KÝ HỌC NGAY
                        </button>
                    </div>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error("Lỗi tải khóa học:", err);
    }
}

// ==============================================================================
// 4. ONLINE EXAM ENGINE & ANTI-CHEAT SYSTEM
// ==============================================================================
async function loadExamData() {
    const examBox = document.getElementById('exam-render-box');
    if (!examBox) return;

    try {
        const res = await fetch('/api/exams');
        const result = await res.json();
        if (result.success && result.data.length > 0) {
            currentExam = result.data[0];
            renderExamForm(currentExam);
        }
    } catch (err) {
        console.error("Lỗi tải đề thi:", err);
    }
}

function renderExamForm(exam) {
    const examBox = document.getElementById('exam-render-box');
    if (!examBox) return;

    examBox.innerHTML = `
        <div class="anti-cheat-status">
            <div>🛡️ <strong>Hệ Thống Anti-Cheat Đang Bật:</strong> Vui lòng giữ màn hình làm bài, không chuyển Tab khác!</div>
            <div id="anti-cheat-count" style="font-weight:700;">Chuyển Tab: 0 lần</div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h2>${exam.title}</h2>
            <div class="exam-timer-badge">⏱️ Thời gian: <span id="exam-timer-display">10:00</span></div>
        </div>
        
        <form id="exam-submission-form">
            ${exam.questions.map((q, idx) => `
                <div class="question-box">
                    <div class="question-title">Câu ${idx + 1}: ${q.question}</div>
                    <div class="options-list">
                        ${q.options.map(opt => {
                            const optKey = opt.charAt(0);
                            return `
                                <label class="option-item">
                                    <input type="radio" name="question_${q.id}" value="${optKey}" onchange="recordAnswer(${q.id}, '${optKey}')">
                                    <span>${opt}</span>
                                </label>
                            `;
                        }).join('')}
                    </div>
                </div>
            `).join('')}
            <button type="button" class="btn-cta-gold" style="width:100%; justify-content:center;" onclick="submitExam()">
                NỘP BÀI THI KẾT QUẢ LIVE 🚀
            </button>
        </form>
        <div id="exam-result-panel" style="display:none; margin-top:30px;"></div>
    `;

    startExamTimer();
}

function recordAnswer(questionId, optionKey) {
    userAnswers[questionId] = optionKey;
}

function startExamTimer() {
    clearInterval(timerInterval);
    remainingSeconds = 600;
    const display = document.getElementById('exam-timer-display');

    timerInterval = setInterval(() => {
        remainingSeconds--;
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        if (display) {
            display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            alert("⏰ Đã hết thời gian làm bài! Hệ thống tự động nộp bài.");
            submitExam();
        }
    }, 1000);
}

function setupAntiCheatEngine() {
    window.addEventListener('blur', () => {
        const examPanel = document.getElementById('portal-exam-center');
        if (examPanel && examPanel.classList.contains('active')) {
            tabSwitchCount++;
            const counter = document.getElementById('anti-cheat-count');
            if (counter) {
                counter.textContent = `Chuyển Tab: ${tabSwitchCount} lần ⚠️`;
                counter.style.color = '#dc2626';
            }
        }
    });
}

async function submitExam() {
    clearInterval(timerInterval);
    const resultPanel = document.getElementById('exam-result-panel');
    if (!resultPanel) return;

    try {
        const res = await fetch('/api/exams/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                examId: currentExam.id,
                answers: userAnswers,
                tabSwitches: tabSwitchCount,
                studentName: "Học Viên LÊ HẢI PHONG-Seawind"
            })
        });

        const result = await res.json();
        if (result.success) {
            const data = result.data;
            resultPanel.style.display = 'block';
            resultPanel.innerHTML = `
                <div style="background: ${data.isPassed ? '#f0fdf4' : '#fef2f2'}; border: 2px solid ${data.isPassed ? '#22c55e' : '#ef4444'}; padding: 24px; border-radius:16px;">
                    <h3 style="color:${data.isPassed ? '#15803d' : '#b91c1c'}; font-size:1.5rem; margin-bottom:10px;">
                        ${data.isPassed ? '🎉 CHÚC MỪNG BẠN ĐÃ ĐẠT CHUẨN NĂNG LỰC!' : '⚠️ BẠN CẦN ÔN TẬP THÊM ĐỂ ĐẠT CHUẨN'}
                    </h3>
                    <p style="font-size:1.1rem; font-weight:700;">Điểm số: <span style="font-size:1.5rem; color:#d97706;">${data.scorePercent}/100</span> (${data.correctCount}/${data.total} câu đúng)</p>
                    <p style="margin:8px 0; color:#475569;">🛡️ ${data.antiCheatWarning}</p>
                    
                    <h4 style="margin-top:20px; margin-bottom:10px;">Chi tiết đáp án & Lời giải:</h4>
                    ${data.details.map(d => `
                        <div style="background:#ffffff; border:1px solid #cbd5e1; padding:12px; border-radius:8px; margin-bottom:8px;">
                            <strong>Câu ${d.questionId}: ${d.question}</strong><br/>
                            <span style="color:${d.isCorrect ? '#16a34a' : '#dc2626'}; font-weight:700;">
                                Đáp án của bạn: ${d.userAns} ${d.isCorrect ? '✓ (Chính xác)' : '✗ (Sai)'}
                            </span> | Đáp án đúng: <strong>${d.correctAns}</strong><br/>
                            <small style="color:#64748b;">💡 Giải thích: ${d.explanation}</small>
                        </div>
                    `).join('')}
                </div>
            `;
            resultPanel.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (err) {
        alert("Có lỗi nộp bài thi, vui lòng thử lại!");
    }
}

// ==============================================================================
// 5. Q&A FORUM LECTURER-STUDENT EXCHANGE
// ==============================================================================
async function loadForumTopics() {
    const list = document.getElementById('forum-topics-list');
    if (!list) return;

    try {
        const res = await fetch('/api/forum/topics');
        const result = await res.json();
        if (result.success && result.data) {
            list.innerHTML = result.data.map(topic => `
                <div class="forum-topic-card">
                    <div class="topic-header">
                        <div class="topic-author">
                            <span style="font-size:24px;">${topic.avatar}</span>
                            <div>
                                <div>${topic.authorName} <small style="color:#64748b;">(${topic.authorRole})</small></div>
                                <small style="color:#94a3b8;">${topic.createdAt} • ${topic.category}</small>
                            </div>
                        </div>
                    </div>
                    <h3 style="font-size:1.15rem; color:#0f4c81; margin:10px 0;">${topic.title}</h3>
                    <p style="color:#334155;">${topic.content}</p>

                    <div class="replies-section">
                        <strong style="color:#0f4c81;">Phản hồi từ Giảng viên & Học viên:</strong>
                        ${topic.replies.map(r => `
                            <div class="reply-card ${r.isLecturer ? 'lecturer-reply' : ''}">
                                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                    <span class="author-name">${r.avatar} ${r.authorName} ${r.isLecturer ? '✅ [Giảng Viên Xác Nhận]' : ''}</span>
                                    <small style="color:#94a3b8;">${r.createdAt}</small>
                                </div>
                                <p style="color:#1e293b;">${r.content}</p>
                            </div>
                        `).join('')}

                        <div style="margin-top:12px; display:flex; gap:10px;">
                            <input type="text" id="reply-input-${topic.id}" placeholder="Viết câu trả lời hoặc thắc mắc của bạn..." style="flex-grow:1; padding:8px 14px; border:1px solid #cbd5e1; border-radius:20px;">
                            <button class="btn-consult-top" onclick="submitReply(${topic.id})">Gửi Phản Hồi</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error("Lỗi tải diễn đàn:", err);
    }
}

async function createTopic() {
    const title = document.getElementById('new-topic-title').value;
    const content = document.getElementById('new-topic-content').value;

    if (!title || !content) {
        alert("Vui lòng điền đầy đủ tiêu đề và câu hỏi!");
        return;
    }

    try {
        const res = await fetch('/api/forum/topics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                content,
                authorName: "Học viên Kim Anh",
                authorRole: "Học viên K48"
            })
        });

        const result = await res.json();
        if (result.success) {
            alert("🎉 Đã gửi câu hỏi lên diễn đàn!");
            document.getElementById('new-topic-title').value = '';
            document.getElementById('new-topic-content').value = '';
            loadForumTopics();
        }
    } catch (err) {
        alert("Có lỗi khi đăng câu hỏi!");
    }
}

async function submitReply(topicId) {
    const input = document.getElementById(`reply-input-${topicId}`);
    if (!input || !input.value) return;

    try {
        const res = await fetch('/api/forum/replies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topicId,
                content: input.value,
                authorName: "ThS. Nguyễn Văn Đức",
                isLecturer: true
            })
        });

        const result = await res.json();
        if (result.success) {
            input.value = '';
            loadForumTopics();
        }
    } catch (err) {
        alert("Có lỗi phản hồi!");
    }
}

// ==============================================================================
// 6. CONSULTATION MODAL HANDLERS
// ==============================================================================
function setupFormHandlers() {
    const modal = document.getElementById('consultation-modal');
    const closeBtn = document.querySelector('.modal-close');

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }
}

function openConsultationModal(courseTitle = "Khóa Học Kiểm Toán Nội Bộ") {
    const modal = document.getElementById('consultation-modal');
    const titleInput = document.getElementById('modal-course-title');
    if (titleInput) titleInput.value = courseTitle;
    if (modal) modal.classList.add('active');
}

async function submitConsultationForm(event) {
    event.preventDefault();
    const fullName = document.getElementById('form-fullname').value;
    const phone = document.getElementById('form-phone').value;
    const email = document.getElementById('form-email').value;
    const courseInterest = document.getElementById('modal-course-title').value;

    try {
        const res = await fetch('/api/consultation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, phone, email, courseInterest })
        });

        const result = await res.json();
        if (result.success) {
            alert(result.message);
            document.getElementById('consultation-modal').classList.remove('active');
        }
    } catch (err) {
        alert("Gửi yêu cầu thất bại, vui lòng gọi trực tiếp hotline 0913275851!");
    }
}
