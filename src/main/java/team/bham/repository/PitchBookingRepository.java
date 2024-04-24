package team.bham.repository;

import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.Pitch;
import team.bham.domain.PitchBooking;
import team.bham.domain.User;

/**
 * Spring Data JPA repository for the PitchBooking entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PitchBookingRepository extends JpaRepository<PitchBooking, Long> {
    List<PitchBooking> findByPitchIdAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(Long pitchId, Instant startTime, Instant endTime);

    // Retrieve the list of booked pitches based on the provided date
    @Query("SELECT pb FROM PitchBooking pb WHERE pb.bookingDate = :date")
    List<PitchBooking> findBookedPitchesBasedOnDate(@Param("date") Instant date);

    List<PitchBooking> findPitchByPitchName(String keyword);
}
