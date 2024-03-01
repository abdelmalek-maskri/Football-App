package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.AvailableDate;

/**
 * Spring Data JPA repository for the AvailableDate entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AvailableDateRepository extends JpaRepository<AvailableDate, Long> {}
