const categoryList = document.getElementById("category-list");
const postList = document.getElementById("post-list");
const categoryTitle = document.getElementById("category-title");
const postContent = document.getElementById("post-content");
const postForm = document.getElementById("post-form");
const writePostBtn = document.getElementById("write-post-btn");

// 로그인 상태 기본값 (auth.js에서 설정되었을 수도 있음)
function checkLogin() {
    return !!localStorage.getItem("user");
}

// 초기 렌더링 시도
let isLoggedIn = checkLogin();


// 게시글 렌더링 함수
async function renderPosts(category) {
    postList.innerHTML = "";
    postContent.innerHTML = "";
    postForm.style.display = "none"; // 리스트 로딩 시 작성 폼 숨기기
    categoryTitle.textContent = category === "all" ? "전체 게시판" : category + " 게시판";

    try {
        const url = category === "all" ? "/api/posts" : `/api/posts?category=${category}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("네트워크 오류");
        const posts = await response.json();

        posts.forEach(post => {
            const li = document.createElement("li");
            li.textContent = post.title;
            li.style.cursor = "pointer";

            li.addEventListener("click", () => {
                postForm.style.display = "none"; // 다른 게시글 클릭 시 폼 숨기기
                postContent.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                `;
            });

            postList.appendChild(li);
        });
    } catch (error) {
        postList.innerHTML = "<li>게시글을 불러오는 데 실패했습니다.</li>";
        postContent.innerHTML = "";
        console.error("게시글 로드 실패:", error);
    }
}

// 카테고리 클릭 이벤트 처리
categoryList.addEventListener("click", e => {
    if (e.target.tagName !== "LI") return;

    document.querySelectorAll("#category-list li").forEach(li => li.classList.remove("active"));
    e.target.classList.add("active");

    const category = e.target.getAttribute("data-category");
    renderPosts(category);
});

// 게시글 쓰기 버튼 처리
writePostBtn.addEventListener("click", () => {
    const user = localStorage.getItem("user");
    if (!checkLogin()) {
        alert("로그인 후에 작성할 수 있습니다.");
        return;
    }

    document.getElementById("post-title").value = "";
    document.getElementById("post-content-input").value = "";

    postContent.innerHTML = ""; // 기존 본문 숨기기
    postForm.style.display = "block"; // 작성 폼 보이기
});

// 게시글 작성 처리
document.getElementById("post-submit").addEventListener("click", async () => {
    const user = localStorage.getItem("user"); // 로그인 유저 가져오기

    if (!checkLogin()) {
        alert("로그인 후에 작성할 수 있습니다.");
        return;
    }

    const title = document.getElementById("post-title").value.trim();
    const content = document.getElementById("post-content-input").value.trim();

    if (!title || !content) {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
    }

    try {
        const response = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                author: user,
                title: title,
                content: content
            }),
        });

        if (!response.ok) throw new Error("게시글 작성 실패");

        alert("게시글이 작성되었습니다.");
        document.getElementById("post-form").style.display = "none";
        document.getElementById("post-title").value = "";
        document.getElementById("post-content-input").value = "";

        renderPosts("all"); // 목록 갱신

    } catch (error) {
        alert("게시글 작성 중 오류가 발생했습니다.");
        console.error(error);
    }
});


// 초기 렌더링
renderPosts("all");
