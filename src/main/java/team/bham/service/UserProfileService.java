package team.bham.service;

import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.User;
import team.bham.repository.UserProfileRepository;
import team.bham.repository.UserRepository;
import team.bham.security.SecurityUtils;
import team.bham.web.rest.UserProfileResource;

@Service
@Transactional
public class UserProfileService {

    private static class UserProfileServiceException extends RuntimeException {

        private UserProfileServiceException(String message) {
            super(message);
        }
    }

    private final Logger log = LoggerFactory.getLogger(UserProfileService.class);
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    public UserProfileService(UserRepository userRepository, UserProfileRepository userProfileRepository) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
    }

    public long getUserId() {
        String userLogin = SecurityUtils
            .getCurrentUserLogin()
            .orElseThrow(() -> new UserProfileService.UserProfileServiceException("Current user login not found"));

        Optional<User> potentialUser = userRepository.findOneWithAuthoritiesByLogin(userLogin);
        if (potentialUser.isEmpty()) {
            throw new UserProfileService.UserProfileServiceException("Current user login not found");
        }

        return potentialUser.get().getId();
    }
}
