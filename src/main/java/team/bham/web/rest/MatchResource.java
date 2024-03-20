package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.Match;
import team.bham.domain.Team;
import team.bham.domain.UserProfile;
import team.bham.repository.MatchRepository;
import team.bham.repository.UserProfileRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Match}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MatchResource {

    private final Logger log = LoggerFactory.getLogger(MatchResource.class);

    private static final String ENTITY_NAME = "match";
    private final UserProfileRepository userProfileRepository;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MatchRepository matchRepository;

    public MatchResource(MatchRepository matchRepository, UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
        this.matchRepository = matchRepository;
    }

    /**
     * {@code POST  /matches} : Create a new match.
     *
     * @param match the match to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new match, or with status {@code 400 (Bad Request)} if the match has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/matches")
    public ResponseEntity<Match> createMatch(@Valid @RequestBody Match match) throws URISyntaxException {
        log.debug("REST request to save Match : {}", match);
        if (match.getId() != null) {
            throw new BadRequestAlertException("A new match cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Match result = matchRepository.save(match);
        return ResponseEntity
            .created(new URI("/api/matches/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /matches/:id} : Updates an existing match.
     *
     * @param id the id of the match to save.
     * @param match the match to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated match,
     * or with status {@code 400 (Bad Request)} if the match is not valid,
     * or with status {@code 500 (Internal Server Error)} if the match couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/matches/{id}")
    public ResponseEntity<Match> updateMatch(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Match match)
        throws URISyntaxException {
        log.debug("REST request to update Match : {}, {}", id, match);
        if (match.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, match.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!matchRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Match result = matchRepository.save(match);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, match.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /matches/:id} : Partial updates given fields of an existing match, field will ignore if it is null
     *
     * @param id the id of the match to save.
     * @param match the match to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated match,
     * or with status {@code 400 (Bad Request)} if the match is not valid,
     * or with status {@code 404 (Not Found)} if the match is not found,
     * or with status {@code 500 (Internal Server Error)} if the match couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/matches/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Match> partialUpdateMatch(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Match match
    ) throws URISyntaxException {
        log.debug("REST request to partial update Match partially : {}, {}", id, match);
        if (match.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, match.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!matchRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Match> result = matchRepository
            .findById(match.getId())
            .map(existingMatch -> {
                if (match.getHomeScore() != null) {
                    existingMatch.setHomeScore(match.getHomeScore());
                }
                if (match.getAwayScore() != null) {
                    existingMatch.setAwayScore(match.getAwayScore());
                }
                if (match.getDate() != null) {
                    existingMatch.setDate(match.getDate());
                }

                return existingMatch;
            })
            .map(matchRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, match.getId().toString())
        );
    }

    /**
     * {@code GET  /matches} : get all the matches.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of matches in body.
     */
    @GetMapping("/matches")
    public List<Match> getAllMatches(@RequestParam(required = false) String date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        log.debug("REST request to get all Matches");

        LocalDate theMonth;
        try {
            theMonth = LocalDate.parse(date, formatter);
        } catch (Exception e) {
            theMonth = LocalDate.now();
        }
        LocalDate date1 = theMonth.withDayOfMonth(1);
        Instant instant = date1.atStartOfDay(ZoneId.of("Europe/London")).toInstant();

        LocalDate date2 = theMonth.withDayOfMonth(theMonth.lengthOfMonth());
        Instant instant2 = date2.atStartOfDay(ZoneId.of("Europe/London")).toInstant();

        return matchRepository.findByDateBetween(instant, instant2);
    }

    /**
     * {@code GET  /matches/:id} : get the "id" match.
     *
     * @param id the id of the match to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the match, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/matches/{id}")
    public ResponseEntity<Match> getMatch(@PathVariable Long id) {
        log.debug("REST request to get Match : {}", id);
        Optional<Match> match = matchRepository.findById(id);
        if (match.isPresent()) {
            Team home = match.get().getHome();
            // Get team members.
            if (home != null) {
                log.debug("OK getting team members!");
                Set<UserProfile> teamMembers = new HashSet<>(userProfileRepository.findByTeamId(home.getId()));
                match.get().getHome().setMembers(teamMembers);
                log.debug("Found " + teamMembers.size() + " team members.");
            }

            Team away = match.get().getAway();
            if (away != null) {
                // Get team members.
                log.debug("OK getting team members!");
                Set<UserProfile> teamMembersA = new HashSet<>(userProfileRepository.findByTeamId(away.getId()));
                match.get().getAway().setMembers(teamMembersA);
                log.debug("Found " + teamMembersA.size() + " team members.");
            }
        }

        return ResponseUtil.wrapOrNotFound(match);
    }

    /**
     * {@code DELETE  /matches/:id} : delete the "id" match.
     *
     * @param id the id of the match to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/matches/{id}")
    public ResponseEntity<Void> deleteMatch(@PathVariable Long id) {
        log.debug("REST request to delete Match : {}", id);
        matchRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
