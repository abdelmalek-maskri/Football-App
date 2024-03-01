package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import team.bham.domain.Team;

public interface TeamRepositoryWithBagRelationships {
    Optional<Team> fetchBagRelationships(Optional<Team> team);

    List<Team> fetchBagRelationships(List<Team> teams);

    Page<Team> fetchBagRelationships(Page<Team> teams);
}
