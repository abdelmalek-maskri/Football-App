package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Team;
import team.bham.domain.Tournament;

/**
 * Spring Data JPA repository for the Team entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TeamRepository extends TeamRepositoryWithBagRelationships, JpaRepository<Team, Long> {
    List<Team> findByNameContainingIgnoreCase(String name);
    Optional<Team> findOneByOwnerId(Long ownerId);

    default List<Team> findByNameContainingIgnoreCaseWithEagerRelationships(String name) {
        return this.fetchBagRelationships(this.findByNameContainingIgnoreCase(name));
    }

    default List<Team> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<Team> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }
}
