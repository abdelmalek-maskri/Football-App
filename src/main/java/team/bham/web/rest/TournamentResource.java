package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.Tournament;
import team.bham.repository.TournamentRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Tournament}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TournamentResource {

    private final Logger log = LoggerFactory.getLogger(TournamentResource.class);

    private static final String ENTITY_NAME = "tournament";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TournamentRepository tournamentRepository;

    public TournamentResource(TournamentRepository tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }

    /**
     * {@code POST  /tournaments} : Create a new tournament.
     *
     * @param tournament the tournament to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tournament, or with status {@code 400 (Bad Request)} if the tournament has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tournaments")
    public ResponseEntity<Tournament> createTournament(@Valid @RequestBody Tournament tournament) throws URISyntaxException {
        log.debug("REST request to save Tournament : {}", tournament);
        if (tournament.getId() != null) {
            throw new BadRequestAlertException("A new tournament cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Tournament result = tournamentRepository.save(tournament);
        return ResponseEntity
            .created(new URI("/api/tournaments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tournaments/:id} : Updates an existing tournament.
     *
     * @param id the id of the tournament to save.
     * @param tournament the tournament to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tournament,
     * or with status {@code 400 (Bad Request)} if the tournament is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tournament couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tournaments/{id}")
    public ResponseEntity<Tournament> updateTournament(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Tournament tournament
    ) throws URISyntaxException {
        log.debug("REST request to update Tournament : {}, {}", id, tournament);
        if (tournament.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tournament.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tournamentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Tournament result = tournamentRepository.save(tournament);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, tournament.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /tournaments/:id} : Partial updates given fields of an existing tournament, field will ignore if it is null
     *
     * @param id the id of the tournament to save.
     * @param tournament the tournament to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tournament,
     * or with status {@code 400 (Bad Request)} if the tournament is not valid,
     * or with status {@code 404 (Not Found)} if the tournament is not found,
     * or with status {@code 500 (Internal Server Error)} if the tournament couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tournaments/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Tournament> partialUpdateTournament(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Tournament tournament
    ) throws URISyntaxException {
        log.debug("REST request to partial update Tournament partially : {}, {}", id, tournament);
        if (tournament.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tournament.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tournamentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Tournament> result = tournamentRepository
            .findById(tournament.getId())
            .map(existingTournament -> {
                if (tournament.getName() != null) {
                    existingTournament.setName(tournament.getName());
                }
                if (tournament.getStartDate() != null) {
                    existingTournament.setStartDate(tournament.getStartDate());
                }
                if (tournament.getEndDate() != null) {
                    existingTournament.setEndDate(tournament.getEndDate());
                }
                if (tournament.getLocation() != null) {
                    existingTournament.setLocation(tournament.getLocation());
                }
                if (tournament.getMaxTeams() != null) {
                    existingTournament.setMaxTeams(tournament.getMaxTeams());
                }

                return existingTournament;
            })
            .map(tournamentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, tournament.getId().toString())
        );
    }

    /**
     * {@code GET  /tournaments} : get all the tournaments.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tournaments in body.
     */
    @GetMapping("/tournaments")
    public List<Tournament> getAllTournaments(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Tournaments");
        if (eagerload) {
            return tournamentRepository.findAllWithEagerRelationships();
        } else {
            return tournamentRepository.findAll();
        }
    }

    /**
     * {@code GET  /tournaments/:id} : get the "id" tournament.
     *
     * @param id the id of the tournament to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tournament, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tournaments/{id}")
    public ResponseEntity<Tournament> getTournament(@PathVariable Long id) {
        log.debug("REST request to get Tournament : {}", id);
        Optional<Tournament> tournament = tournamentRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(tournament);
    }

    /**
     * {@code DELETE  /tournaments/:id} : delete the "id" tournament.
     *
     * @param id the id of the tournament to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tournaments/{id}")
    public ResponseEntity<Void> deleteTournament(@PathVariable Long id) {
        log.debug("REST request to delete Tournament : {}", id);
        tournamentRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
