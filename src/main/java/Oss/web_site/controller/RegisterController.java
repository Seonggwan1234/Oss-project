package Oss.web_site.controller;

import Oss.web_site.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/register")
@RequiredArgsConstructor
public class RegisterController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> register(@RequestBody RegisterDto registerDto) {
        boolean success = userService.register(registerDto.getUsername(), registerDto.getPassword());
        if (success) {
            return ResponseEntity.ok(Map.of("message", "회원가입 성공", "username", registerDto.getUsername()));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "이미 존재하는 사용자입니다"));
        }
    }

    @Data
    static class RegisterDto {
        private String username;
        private String password;
    }
}