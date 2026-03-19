package no.ntnu.idatt2105.calculator_backend.service;

import jakarta.annotation.PostConstruct;
import no.ntnu.idatt2105.calculator_backend.entity.AppUser;
import no.ntnu.idatt2105.calculator_backend.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AppUserService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AppUserService(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void initDefaultUser() {
        if (!userRepository.existsByUsername("test")) {
            AppUser user = new AppUser();
            user.setUsername("test");
            user.setPassword(passwordEncoder.encode("test"));
            userRepository.save(user);
        }
    }

    public void register(String username, String rawPassword) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already taken");
        }
        AppUser user = new AppUser();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword));
        userRepository.save(user);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
}
