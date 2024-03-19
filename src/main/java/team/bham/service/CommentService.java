package team.bham.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team.bham.domain.Comment;
import team.bham.domain.UserProfile;
import team.bham.repository.CommentRepository;
import team.bham.repository.UserProfileRepository;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public double calculateAverageRate(UserProfile targetUser) {
        List<Comment> comments = commentRepository.findByTargetUser(targetUser);
        if (comments.isEmpty()) {
            return 0;
        }

        int totalRating = 0;
        for (Comment comment : comments) {
            totalRating += comment.getRating();
        }

        return (double) totalRating / comments.size();
    }
}
