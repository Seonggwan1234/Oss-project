// 전역변수로 수정 중인 게시글 ID 저장
let editingPostId = null;

window.addEventListener("DOMContentLoaded", () => {
    const categoryList = document.getElementById("category-list");
    const postList = document.getElementById("post-list");
    const categoryTitle = document.getElementById("category-title");
    const postContent = document.getElementById("post-content");
    const postForm = document.getElementById("post-form");
    const writePostBtn = document.getElementById("write-post-btn");
    const postSubmitBtn = document.getElementById("post-submit");

    function checkLogin() {
        return !!localStorage.getItem("user");
    }

    // 게시글 목록 렌더링 함수
    async function renderPosts(category = "all") {
        postList.innerHTML = "";
        postContent.innerHTML = "";
        postForm.style.display = "none";
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
                    editingPostId = null; // 수정 모드 초기화

                    postContent.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <small>작성자: ${post.author || '알 수 없음'}</small>
            <br/><br/>
            <button id="edit-post-btn">수정</button>
            <button id="delete-post-btn">삭제</button>
          `;

                    // 삭제 버튼 이벤트
                    document.getElementById("delete-post-btn").addEventListener("click", async () => {
                        if (!checkLogin()) {
                            alert("로그인 후에 삭제할 수 있습니다.");
                            return;
                        }
                        if (localStorage.getItem("user") !== post.author) {
                            alert("본인 게시글만 삭제할 수 있습니다.");
                            return;
                        }
                        if (!confirm("게시글을 삭제하시겠습니까?")) return;

                        try {
                            const response = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
                            if (!response.ok) throw new Error("삭제 실패");

                            alert("게시글이 삭제되었습니다.");
                            postContent.innerHTML = "";
                            renderPosts(category);
                        } catch (error) {
                            alert("삭제 중 오류가 발생했습니다.");
                            console.error(error);
                        }
                    });

                    // 수정 버튼 이벤트
                    document.getElementById("edit-post-btn").addEventListener("click", () => {
                        if (!checkLogin()) {
                            alert("로그인 후에 수정할 수 있습니다.");
                            return;
                        }
                        if (localStorage.getItem("user") !== post.author) {
                            alert("본인 게시글만 수정할 수 있습니다.");
                            return;
                        }

                        document.getElementById("post-title").value = post.title;
                        document.getElementById("post-content-input").value = post.content;
                        postForm.style.display = "block";
                        postContent.innerHTML = "";

                        editingPostId = post.id;  // 수정 모드 설정
                    });
                });

                postList.appendChild(li);
            });
        } catch (error) {
            postList.innerHTML = "<li>게시글을 불러오는 데 실패했습니다.</li>";
            postContent.innerHTML = "";
            console.error("게시글 로드 실패:", error);
        }
    }

    // 게시글 작성 및 수정 처리
    postSubmitBtn.addEventListener("click", async () => {
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

            renderPosts("all");
        } catch (error) {
            alert(editingPostId ? "게시글 수정 중 오류가 발생했습니다." : "게시글 작성 중 오류가 발생했습니다.");
            console.error(error);
        }
    });

    // 카테고리 클릭 이벤트
    categoryList.addEventListener("click", e => {
        if (e.target.tagName !== "LI") return;

        document.querySelectorAll("#category-list li").forEach(li => li.classList.remove("active"));
        e.target.classList.add("active");

        const category = e.target.getAttribute("data-category");
        renderPosts(category);
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
        postContent.innerHTML = "";
    });

    // 초기 렌더링: 전체 게시글 로드 및 '전체' 카테고리 active 설정
    renderPosts("all");
    document.querySelector('#category-list li[data-category="all"]').classList.add("active");
});
