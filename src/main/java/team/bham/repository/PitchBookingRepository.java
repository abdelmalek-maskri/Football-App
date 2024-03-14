package team.bham.repository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.PitchBooking;

/**
 * Spring Data JPA repository for the PitchBooking entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PitchBookingRepository extends JpaRepository<PitchBooking, Long> {
    List<PitchBooking> findByBookingDate(LocalDate bookingDate);
}
