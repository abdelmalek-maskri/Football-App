package team.bham.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import team.bham.domain.Tournament;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class TournamentRepositoryWithBagRelationshipsImpl implements TournamentRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Tournament> fetchBagRelationships(Optional<Tournament> tournament) {
        return tournament.map(this::fetchTeams);
    }

    @Override
    public Page<Tournament> fetchBagRelationships(Page<Tournament> tournaments) {
        return new PageImpl<>(fetchBagRelationships(tournaments.getContent()), tournaments.getPageable(), tournaments.getTotalElements());
    }

    @Override
    public List<Tournament> fetchBagRelationships(List<Tournament> tournaments) {
        return Optional.of(tournaments).map(this::fetchTeams).orElse(Collections.emptyList());
    }

    Tournament fetchTeams(Tournament result) {
        return entityManager
            .createQuery(
                "select tournament from Tournament tournament left join fetch tournament.teams where tournament is :tournament",
                Tournament.class
            )
            .setParameter("tournament", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Tournament> fetchTeams(List<Tournament> tournaments) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, tournaments.size()).forEach(index -> order.put(tournaments.get(index).getId(), index));
        List<Tournament> result = entityManager
            .createQuery(
                "select distinct tournament from Tournament tournament left join fetch tournament.teams where tournament in :tournaments",
                Tournament.class
            )
            .setParameter("tournaments", tournaments)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
