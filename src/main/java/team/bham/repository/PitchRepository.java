package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Pitch;

/**
 * Spring Data JPA repository for the Pitch entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PitchRepository extends JpaRepository<Pitch, Long> {}
