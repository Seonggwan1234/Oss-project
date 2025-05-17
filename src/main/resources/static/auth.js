// auth.js

const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register");
const registerModal = document.getElementById("register-modal");
const closeRegister = document.getElementById("close-register");
const registerSubmit = document.getElementById("register-submit");

// 회원가입 모달 열기
registerBtn.addEventListener("click", () => {
    registerModal.style.display = "flex";
});

// 회원가입 모달 닫기
closeRegister.addEventListener("click", () => {
    registerModal.style.display = "none";
});

// 모달 바깥 클릭 시 닫기
window.addEventListener("click", (e) => {
    if (e.target === registerModal) {
        registerModal.style.display = "none";
    }
});

window.isLoggedIn = false;
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
        if (!response.ok) throw new Error("로그인 실패");

        const data = await response.json();
        alert(`로그인 성공! 환영합니다, ${data.username}님.`);
        isLoggedIn = true;

        document.getElementById("post-form").style.display = "block";
        // TODO: 로그인 성공 후 처리 (토큰 저장, 페이지 이동 등)
    } catch (error) {
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
        console.error("로그인 오류:", error);
    }
});

// 회원가입 처리 (모달 안 '가입하기' 버튼)
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
        registerModal.style.display = "none"; // 모달 닫기
        // TODO: 회원가입 성공 후 처리 (입력창 초기화 등)
    } catch (error) {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
        console.error("회원가입 오류:", error);
    }
});
function updateAuthUI() {
    const user = localStorage.getItem("user");

    const loginBox = document.getElementById("login-box");
    const userBox = document.getElementById("user-box");
    const userDisplay = document.getElementById("user-id-display");

    if (user) {
        loginBox.style.display = "none";
        userBox.style.display = "block";
        userDisplay.textContent = user;
    } else {
        loginBox.style.display = "flex";
        userBox.style.display = "none";
        userDisplay.textContent = "";
    }
}

// 로그인 성공 시 호출 예시
function isLoggedIn(userId) {
    localStorage.setItem("user", userId);
    updateAuthUI();
}

// 로그아웃 이벤트
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user");
    updateAuthUI();
    alert("로그아웃 되었습니다.");
});
//페이지 로딩시 로그인 상태반영
window.addEventListener("DOMContentLoaded", () => {
    updateAuthUI();
    renderPosts("all");
});

