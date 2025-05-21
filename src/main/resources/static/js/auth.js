// --- 로그인, 회원가입, 로그아웃 및 인증 UI 관리 ---

// 로그인 상태 관리
let isLoggedIn = false;
let currentUser = null;

// DOM 요소
const loginBox = document.getElementById('login-box');
const userBox = document.getElementById('user-box');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const registerBtn = document.getElementById('register');
const loginId = document.getElementById('login-id');
const loginPw = document.getElementById('login-pw');
const userIdDisplay = document.getElementById('user-id-display');
const registerModal = document.getElementById('register-modal');
const closeRegister = document.getElementById('close-register');
const registerSubmit = document.getElementById('register-submit');
const registerCancel = document.getElementById('register-cancel');

// 커스텀 이벤트 정의
const loginStateChanged = new CustomEvent('loginStateChanged', {
    detail: { isLoggedIn: false, currentUser: null }
});

// 로그인 처리
loginBtn.addEventListener('click', () => {
    const id = loginId.value;
    const pw = loginPw.value;

    if (!id || !pw) {
        alert('아이디와 비밀번호를 모두 입력해주세요.');
        return;
    }

    // 여기에 실제 로그인 API 호출 로직이 들어갈 예정
    // 임시로 바로 로그인 처리
    isLoggedIn = true;
    currentUser = id;
    updateLoginState();
    clearLoginForm();
});

// 로그아웃 처리
logoutBtn.addEventListener('click', () => {
    isLoggedIn = false;
    currentUser = null;
    updateLoginState();
});

// 회원가입 모달 표시
registerBtn.addEventListener('click', () => {
    registerModal.style.display = 'flex';
});

// 회원가입 모달 닫기
closeRegister.addEventListener('click', () => {
    registerModal.style.display = 'none';
});

registerCancel.addEventListener('click', () => {
    registerModal.style.display = 'none';
});

// 회원가입 처리
registerSubmit.addEventListener('click', () => {
    const id = document.getElementById('register-id').value;
    const pw = document.getElementById('register-pw').value;

    if (!id || !pw) {
        alert('아이디와 비밀번호를 모두 입력해주세요.');
        return;
    }

    // 여기에 실제 회원가입 API 호출 로직이 들어갈 예정
    alert('회원가입이 완료되었습니다. 로그인해주세요.');
    registerModal.style.display = 'none';
});

// 로그인 상태 업데이트
function updateLoginState() {
    if (isLoggedIn) {
        loginBox.style.display = 'none';
        userBox.style.display = 'flex';
        userIdDisplay.textContent = currentUser;
    } else {
        loginBox.style.display = 'flex';
        userBox.style.display = 'none';
        userIdDisplay.textContent = '';
    }

    // 로그인 상태 변경 이벤트 발생
    loginStateChanged.detail.isLoggedIn = isLoggedIn;
    loginStateChanged.detail.currentUser = currentUser;
    document.dispatchEvent(loginStateChanged);
}

// 로그인 폼 초기화
function clearLoginForm() {
    loginId.value = '';
    loginPw.value = '';
}

// 모달 외부 클릭시 닫기
window.addEventListener('click', (e) => {
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
    }
});

// 페이지 로드 시 UI 초기화
window.addEventListener("DOMContentLoaded", () => {
    updateLoginState();
});
