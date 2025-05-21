// 전역변수로 수정 중인 게시글 ID 저장
let editingPostId = null;

// DOM 요소
const categoryList = document.getElementById('category-list');
const categoryTitle = document.getElementById('category-title');
const postList = document.getElementById('post-list');
const writePostBtn = document.getElementById('write-post-btn');
const postForm = document.getElementById('post-form');
const closePostForm = document.getElementById('close-post-form');
const postSubmit = document.getElementById('post-submit');
const postCancel = document.getElementById('post-cancel');

// 카테고리 관리
let currentCategory = 'all';

// 게시글 데이터 (임시)
let posts = [
    { id: 1, title: 'Git 기초 사용법', category: 'Git', author: 'user1', date: '2024-03-15' },
    { id: 2, title: 'Spring Boot와 JPA', category: 'Tech', author: 'user2', date: '2024-03-14' },
    { id: 3, title: '오픈소스 기여하기', category: 'Oss', author: 'user3', date: '2024-03-13' }
];

window.addEventListener("DOMContentLoaded", () => {
    // 로그인 상태 변경 이벤트 리스너
    document.addEventListener('loginStateChanged', (e) => {
        const { isLoggedIn } = e.detail;
        writePostBtn.style.display = isLoggedIn ? 'inline-block' : 'none';
    });

    function checkLogin() {
        return !!localStorage.getItem("user");
    }

    // 게시글 목록 렌더링
    function renderPosts(category) {
        const filteredPosts = category === 'all' 
            ? posts 
            : posts.filter(post => post.category === category);

        postList.innerHTML = filteredPosts.map(post => `
            <li class="post-item">
                <div class="post-title">${post.title}</div>
                <div class="post-info">
                    <span class="post-author">${post.author}</span>
                    <span class="post-date">${post.date}</span>
                </div>
            </li>
        `).join('');
    }

    // 카테고리 클릭 이벤트
    categoryList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;

        const category = li.dataset.category;
        if (category === currentCategory) return;

        // 활성 카테고리 변경
        document.querySelector('.active').classList.remove('active');
        li.classList.add('active');

        // 카테고리 제목 업데이트
        categoryTitle.textContent = li.textContent.trim();
        currentCategory = category;

        // 게시글 목록 업데이트
        renderPosts(category);
    });

    // 게시글 작성 및 수정 처리
    postSubmit.addEventListener('click', async () => {
        if (!checkLogin()) {
            alert("로그인 후에 작성할 수 있습니다.");
            return;
        }

        const user = localStorage.getItem("user");
        const title = document.getElementById("post-title").value.trim();
        const content = document.getElementById("post-content-input").value.trim();

        if (!title || !content) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        try {
            let response;

            if (editingPostId) {
                // 수정 요청
                response = await fetch(`/api/posts/${editingPostId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ author: user, title, content }),
                });
            } else {
                // 신규 작성 요청
                response = await fetch("/api/posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ author: user, title, content }),
                });
            }

            if (!response.ok) throw new Error(editingPostId ? "게시글 수정 실패" : "게시글 작성 실패");

            alert(editingPostId ? "게시글이 수정되었습니다." : "게시글이 작성되었습니다.");
            postForm.style.display = "none";
            document.getElementById("post-title").value = "";
            document.getElementById("post-content-input").value = "";
            editingPostId = null;

            renderPosts(currentCategory);
        } catch (error) {
            alert(editingPostId ? "게시글 수정 중 오류가 발생했습니다." : "게시글 작성 중 오류가 발생했습니다.");
            console.error(error);
        }
    });

    // 글 작성 폼 닫기
    closePostForm.addEventListener('click', () => {
        postForm.style.display = 'none';
    });

    postCancel.addEventListener('click', () => {
        postForm.style.display = 'none';
    });

    // 게시글 쓰기 버튼 클릭 (새글 작성)
    writePostBtn.addEventListener("click", () => {
        if (!checkLogin()) {
            alert("로그인 후에 작성할 수 있습니다.");
            return;
        }
        editingPostId = null;
        document.getElementById("post-title").value = "";
        document.getElementById("post-content-input").value = "";
        postForm.style.display = "block";
    });

    // 초기 렌더링: 전체 게시글 로드 및 '전체' 카테고리 active 설정
    renderPosts("all");
    document.querySelector('#category-list li[data-category="all"]').classList.add("active");
});

// 다크 모드 토글
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');

// 저장된 테마 불러오기
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '🌞';
themeText.textContent = savedTheme === 'dark' ? '라이트 모드' : '다크 모드';

themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    themeIcon.textContent = newTheme === 'dark' ? '🌙' : '🌞';
    themeText.textContent = newTheme === 'dark' ? '라이트 모드' : '다크 모드';
});
