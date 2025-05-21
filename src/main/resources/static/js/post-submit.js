// 전역변수로 수정 중인 게시글 ID 저장
let editingPostId = null;

window.addEventListener("DOMContentLoaded", () => {
    // ...기존 코드 생략...

    document.getElementById("post-submit").addEventListener("click", async () => {
        const title = document.getElementById("post-title").value.trim();
        const content = document.getElementById("post-content-input").value.trim();

        if (!title || !content) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        try {
            let response;
            if (editingPostId) {
                // 수정 API 호출
                response = await fetch(`/api/posts/${editingPostId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, content }),
                });
            } else {
                // 새 게시글 작성
                response = await fetch("/api/posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        author: localStorage.getItem("user"),
                        title,
                        content
                    }),
                });
            }

            if (!response.ok) throw new Error("저장 실패");

            alert(editingPostId ? "게시글이 수정되었습니다." : "게시글이 작성되었습니다.");
            editingPostId = null;

            document.getElementById("post-form").style.display = "none";
            document.getElementById("post-title").value = "";
            document.getElementById("post-content-input").value = "";

            renderPosts("all");  // 전체 게시판 다시 로드
        } catch (error) {
            alert("게시글 저장 중 오류가 발생했습니다.");
            console.error(error);
        }
    });

    // ...기존 초기화 및 렌더링 코드...
});
