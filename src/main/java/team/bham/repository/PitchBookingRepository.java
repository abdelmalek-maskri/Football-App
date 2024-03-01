package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.PitchBooking;

/**
 * Spring Data JPA repository for the PitchBooking entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PitchBookingRepository extends JpaRepository<PitchBooking, Long> {}
