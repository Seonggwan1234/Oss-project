package Oss.web_site.repository;

import Oss.web_site.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // 카테고리별 조회 쿼리 메서드 추가
    List<Post> findByCategory(String category);
}