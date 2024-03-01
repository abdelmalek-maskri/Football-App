package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import team.bham.domain.Tournament;

public interface TournamentRepositoryWithBagRelationships {
    Optional<Tournament> fetchBagRelationships(Optional<Tournament> tournament);

    List<Tournament> fetchBagRelationships(List<Tournament> tournaments);

    Page<Tournament> fetchBagRelationships(Page<Tournament> tournaments);
}
