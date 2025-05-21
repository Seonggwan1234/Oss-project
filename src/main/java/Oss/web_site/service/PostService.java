package Oss.web_site.service;

import Oss.web_site.model.Post;
import Oss.web_site.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public List<Post> findAll() {
        return postRepository.findAll();
    }

    // 카테고리별 게시글 조회 메서드 추가
    public List<Post> findByCategory(String category) {
        return postRepository.findByCategory(category);
    }

    public Post createPost(String title, String content, String author) {
        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setAuthor(author);
        return postRepository.save(post);
    }

    public Optional<Post> updatePost(Long id, String title, String content) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            post.setTitle(title);
            post.setContent(content);
            postRepository.save(post);
            return Optional.of(post);
        }
        return Optional.empty();
    }

    public boolean deletePost(Long id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return true;
        }
        return false;
    }
}