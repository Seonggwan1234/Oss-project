// --- 로그인, 회원가입, 로그아웃 및 인증 UI 관리 ---

const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register");
const registerModal = document.getElementById("register-modal");
const closeRegister = document.getElementById("close-register");
const registerSubmit = document.getElementById("register-submit");

const loginBox = document.getElementById("login-box");
const userBox = document.getElementById("user-box");
const userDisplay = document.getElementById("user-id-display");
const writePostBtn = document.getElementById("write-post-btn");

// 회원가입 모달 열기/닫기
registerBtn.addEventListener("click", () => {
    registerModal.style.display = "flex";
});

closeRegister.addEventListener("click", () => {
    registerModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === registerModal) {
        registerModal.style.display = "none";
    }
});

// 로그인 처리
loginBtn.addEventListener("click", async () => {
    const id = document.getElementById("login-id").value.trim();
    const pw = document.getElementById("login-pw").value.trim();

    if (!id || !pw) {
        alert("아이디와 비밀번호를 입력하세요.");
        return;
    }

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: id, password: pw }),
        });

        const data = await response.json();

        if (response.status === 200) {
            alert(`로그인 성공! 환영합니다, ${data.username}님.`);

            localStorage.setItem("user", data.username);
            updateAuthUI();

            document.getElementById("login-id").value = "";
            document.getElementById("login-pw").value = "";

            // 게시글 목록 다시 불러오기 (script.js의 함수 호출)
            if (typeof renderPosts === "function") {
                renderPosts("all");
            }

        } else {
            alert(data.error || "로그인 실패");
        }
    } catch (error) {
        alert("서버 오류로 로그인에 실패했습니다. 다시 시도해주세요.");
        console.error("로그인 오류:", error);

        document.getElementById("login-id").value = "";
        document.getElementById("login-pw").value = "";
    }
});

// 회원가입 처리
registerSubmit.addEventListener("click", async () => {
    const id = document.getElementById("register-id").value.trim();
    const pw = document.getElementById("register-pw").value.trim();

    if (!id || !pw) {
        alert("아이디와 비밀번호를 입력하세요.");
        return;
    }

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: id, password: pw }),
        });

        if (!response.ok) throw new Error("회원가입 실패");

        alert("회원가입 성공! 로그인 해주세요.");
        registerModal.style.display = "none";

        document.getElementById("register-id").value = "";
        document.getElementById("register-pw").value = "";

    } catch (error) {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
        console.error("회원가입 오류:", error);

        document.getElementById("register-id").value = "";
        document.getElementById("register-pw").value = "";
    }
});

// 로그인 상태 확인 함수
function isLoggedIn() {
    return !!localStorage.getItem("user");
}

// 로그인/로그아웃 UI 갱신 함수
function updateAuthUI() {
    const user = localStorage.getItem("user");

    if (user) {
        loginBox.style.display = "none";
        userBox.style.display = "block";
        userDisplay.textContent = user;
        writePostBtn.style.display = "inline-block";
    } else {
        loginBox.style.display = "flex";
        userBox.style.display = "none";
        userDisplay.textContent = "";
        writePostBtn.style.display = "none";
    }
}

// 로그아웃 처리
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user");
    updateAuthUI();
    alert("로그아웃 되었습니다.");

    // 게시글 목록 초기화 (script.js 함수 호출)
    if (typeof clearPostList === "function") {
        clearPostList();
    }
});

// 페이지 로드 시 UI 초기화
window.addEventListener("DOMContentLoaded", () => {
    updateAuthUI();
});
