package Oss.web_site.controller;

import Oss.web_site.model.Post;
import Oss.web_site.service.PostService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@AllArgsConstructor
public class PostController {

    private final PostService postService;

    // 게시글 목록 조회 (카테고리 필터링 추가 가능)
    @GetMapping
    public List<Post> getAllPosts(@RequestParam(required = false) String category) {
        if (category == null || category.equals("all")) {
            return postService.findAll();
        } else {
            return postService.findByCategory(category);
        }
    }

    // 게시글 작성
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        if (post.getAuthor() == null || post.getAuthor().isEmpty()) {
            return ResponseEntity.badRequest().body("작성자가 필요합니다.");
        }
        Post saved = postService.createPost(post.getTitle(), post.getContent(), post.getAuthor());
        return ResponseEntity.ok(saved);
    }

    // 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @RequestBody Post post) {
        return postService.updatePost(id, post.getTitle(), post.getContent())
                .map(updatedPost -> ResponseEntity.ok(updatedPost))
                .orElse(ResponseEntity.notFound().build());
    }

    // 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        if (postService.deletePost(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
