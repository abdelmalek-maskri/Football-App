package team.bham.repository;

import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Match;

/**
 * Spring Data JPA repository for the Match entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByDateBetween(Instant begin, Instant end);
}
