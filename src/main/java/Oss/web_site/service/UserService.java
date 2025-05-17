package Oss.web_site.service;

import Oss.web_site.model.User;
import Oss.web_site.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    public boolean register(String username, String password) {
        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            return false;
        }
        if (userRepository.existsByUsername(username)) {
            return false;
        }
        try {
            User user = new User();
            user.setUsername(username);
            user.setPassword(encoder.encode(password));
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            // 예외 로깅 추가
            System.err.println("회원가입 실패: " + e.getMessage());
            return false;
        }
    }
}
