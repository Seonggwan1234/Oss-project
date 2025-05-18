package Oss.web_site.controller;

import Oss.web_site.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/login")
@RequiredArgsConstructor
public class LoginController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        UserService.LoginResult result = userService.login(loginDto.getUsername(), loginDto.getPassword());

        switch (result) {
            case SUCCESS -> {
                return ResponseEntity.ok(Map.of("message", "로그인 성공", "username", loginDto.getUsername()));
            }
            case USER_NOT_FOUND -> {
                return ResponseEntity.status(404).body(Map.of("error", "존재하지 않는 사용자입니다"));
            }
            case PASSWORD_MISMATCH -> {
                return ResponseEntity.status(401).body(Map.of("error", "비밀번호가 틀렸습니다"));
            }
            default -> {
                return ResponseEntity.status(500).body(Map.of("error", "알 수 없는 오류"));
            }
        }
    }

    @Data
    static class LoginDto {
        private String username;
        private String password;
    }
}