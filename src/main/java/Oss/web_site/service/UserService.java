package Oss.web_site.service;

import Oss.web_site.model.User;
import Oss.web_site.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    public boolean register(String username, String password) {
        if (isInvalid(username) || isInvalid(password)) {
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
            logger.error("회원가입 중 예외 발생", e);
            return false;
        }
    }

    public LoginResult login(String username, String password) {
        if (isInvalid(username) || isInvalid(password)) {
            return LoginResult.USER_NOT_FOUND;
        }

        return userRepository.findByUsername(username)
                .map(user -> encoder.matches(password, user.getPassword()) ?
                        LoginResult.SUCCESS : LoginResult.PASSWORD_MISMATCH)
                .orElse(LoginResult.USER_NOT_FOUND);
    }

    private boolean isInvalid(String str) {
        return str == null || str.trim().isEmpty();
    }

    public enum LoginResult {
        SUCCESS,
        USER_NOT_FOUND,
        PASSWORD_MISMATCH
    }
}