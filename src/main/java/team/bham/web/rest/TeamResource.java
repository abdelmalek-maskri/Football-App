package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.Team;
import team.bham.domain.UserProfile;
import team.bham.repository.TeamRepository;
import team.bham.repository.UserProfileRepository;
import team.bham.repository.UserRepository;
import team.bham.security.SecurityUtils;
import team.bham.service.UserProfileService;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Team}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TeamResource {

    private final Logger log = LoggerFactory.getLogger(TeamResource.class);

    private static final String ENTITY_NAME = "team";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TeamRepository teamRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserProfileService userProfileService;

    public TeamResource(TeamRepository teamRepository, UserProfileRepository userProfileRepository, UserProfileService userProfileService) {
        this.teamRepository = teamRepository;
        this.userProfileRepository = userProfileRepository;

        this.userProfileService = userProfileService;
    }

    /**
     * {@code POST  /teams} : Create a new team.
     *
     * @param team the team to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new team, or with status {@code 400 (Bad Request)} if the team has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/teams")
    public ResponseEntity<Team> createTeam(@Valid @RequestBody Team team) throws URISyntaxException {
        log.debug("REST request to save Team : {}", team);
        if (team.getId() != null) {
            throw new BadRequestAlertException("A new team cannot already have an ID", ENTITY_NAME, "idexists");
        }

        Optional<Team> existingTeam = teamRepository.findOneByOwnerId(userProfileService.getUserId());
        if (existingTeam.isPresent()) {
            throw new RuntimeException("You have already created a team!");
        }

        // team.setOwner() to the authenticated user's UserProfile:
        Optional<UserProfile> teamOwner = userProfileService.findUserProfile();
        if (teamOwner.isPresent()) {
            team.setOwner(teamOwner.get());
            // TODO: Set teamOwner's team to this new team.
        } else {
            throw new RuntimeException("You have not created a User Profile yet!");
        }

        Team result = teamRepository.save(team);
        return ResponseEntity
            .created(new URI("/api/teams/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /teams/:id} : Updates an existing team.
     *
     * @param id the id of the team to save.
     * @param team the team to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated team,
     * or with status {@code 400 (Bad Request)} if the team is not valid,
     * or with status {@code 500 (Internal Server Error)} if the team couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/teams/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Team team)
        throws URISyntaxException {
        log.debug("REST request to update Team : {}, {}", id, team);
        if (team.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, team.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teamRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        if (userProfileService.findUserProfile().isEmpty()) {
            throw new RuntimeException("You have not created a user profile yet!");
        }
        if (team.getOwner() == null || team.getOwner().getId() != userProfileService.getUserId()) {
            throw new RuntimeException("Unauthorized: You are not the owner of this team.");
        }

        Team result = teamRepository.save(team);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, team.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /teams/:id/join} : Partial updates given fields of an existing team, field will ignore if it is null
     *
     * @param id the id of the team to join.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated team,
     * or with status {@code 400 (Bad Request)} if the team is not valid,
     * or with status {@code 404 (Not Found)} if the team is not found,
     * or with status {@code 500 (Internal Server Error)} if the team couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/teams/{id}/join")
    public ResponseEntity<Team> partialUpdateTeam(@PathVariable(value = "id", required = false) final Long id) throws URISyntaxException {
        log.debug("REST request to join a team : {}", id);

        // Find Team:
        Optional<Team> team = teamRepository.findById(id);
        if (team.isEmpty()) {
            throw new BadRequestAlertException("Invalid team id", ENTITY_NAME, "idnull");
        }

        //if (id == 1451) {
        //    throw new RuntimeException("CANNOT JOIN THIS BLACKLISTED TEAM");
        //}

        // Find UserProfile:
        Optional<UserProfile> userProfile = userProfileService.findUserProfile();

        if (userProfile.isPresent()) {
            // Update UserProfile's Team:
            Optional<UserProfile> result = userProfileRepository
                .findById(userProfile.get().getId())
                .map(existingUserProfile -> {
                    existingUserProfile.setTeam(team.get());
                    // existingUserProfile.setTeamOwned(null); // maybe ??

                    return existingUserProfile;
                })
                .map(userProfileRepository::save);

            Optional<Team> updatedTeam = teamRepository.findById(id);
            if (updatedTeam.isPresent()) {
                // Get team members.
                Set<UserProfile> teamMembers = new HashSet<>(userProfileRepository.findByTeamId(updatedTeam.get().getId()));
                updatedTeam.get().setMembers(teamMembers);
            }

            return ResponseEntity
                .status(HttpStatus.OK)
                .header("app-alert", "You are now a member of the team " + updatedTeam.get().getName())
                .body(updatedTeam.get());
        } else {
            throw new RuntimeException("You have not created a user profile yet!");
        }
    }

    /**
     * {@code PATCH  /teams/:id} : Partial updates given fields of an existing team, field will ignore if it is null
     *
     * @param id the id of the team to save.
     * @param team the team to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated team,
     * or with status {@code 400 (Bad Request)} if the team is not valid,
     * or with status {@code 404 (Not Found)} if the team is not found,
     * or with status {@code 500 (Internal Server Error)} if the team couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/teams/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Team> partialUpdateTeam(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Team team
    ) throws URISyntaxException {
        log.debug("REST request to partial update Team partially : {}, {}", id, team);
        if (team.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, team.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teamRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        // Authentication:
        if (team.getOwner() == null || team.getOwner().getId() != userProfileService.getUserId()) {
            throw new RuntimeException("Unauthorized: You are not the owner of this team.");
        }

        Optional<Team> result = teamRepository
            .findById(team.getId())
            .map(existingTeam -> {
                if (team.getCreated() != null) {
                    existingTeam.setCreated(team.getCreated());
                }
                if (team.getName() != null) {
                    existingTeam.setName(team.getName());
                }
                if (team.getDescription() != null) {
                    existingTeam.setDescription(team.getDescription());
                }
                if (team.getImage() != null) {
                    existingTeam.setImage(team.getImage());
                }
                if (team.getImageContentType() != null) {
                    existingTeam.setImageContentType(team.getImageContentType());
                }
                if (team.getColour() != null) {
                    existingTeam.setColour(team.getColour());
                }
                if (team.getSchedule() != null) {
                    existingTeam.setSchedule(team.getSchedule());
                }
                if (team.getPlayType() != null) {
                    existingTeam.setPlayType(team.getPlayType());
                }

                return existingTeam;
            })
            .map(teamRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, team.getId().toString())
        );
    }

    /**
     * {@code GET  /teams} : get all the teams.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of teams in body.
     */
    @GetMapping("/teams")
    public List<Team> getAllTeams() {
        log.debug("REST request to get all Teams");
        List<Team> searchResults = teamRepository.findAll();

        // Get team members.
        for (Team team : searchResults) {
            Set<UserProfile> teamMembers = new HashSet<>(userProfileRepository.findByTeamId(team.getId()));
            team.setMembers(teamMembers);
        }

        return searchResults;
    }

    /**
     * GET  /teams/search?name={name} : search for teams by name.
     *
     * @param name the name of the team to search for.
     * @return the ResponseEntity with status 200 (OK) and the list of teams in body.
     */
    @GetMapping("/teams/search")
    public List<Team> searchTeams(@RequestParam(required = false) String name) {
        log.debug("REST request to search Teams by name : {}", name);

        List<Team> searchResults;
        if (name != null) {
            searchResults = teamRepository.findByNameContainingIgnoreCaseWithEagerRelationships(name);
        } else {
            searchResults = teamRepository.findAll();
        }

        // Get team members.
        for (Team team : searchResults) {
            Set<UserProfile> teamMembers = new HashSet<>(userProfileRepository.findByTeamId(team.getId()));
            team.setMembers(teamMembers);
        }

        return searchResults;
    }

    /**
     * GET  /teams/:teamId/members : search for members by team.
     *
     * @param teamId the id of the team to get members of.
     * @return the ResponseEntity with status 200 (OK) and the list of user profiles in body.
     */
    @GetMapping("/teams/{teamId}/members")
    public List<UserProfile> getTeamMembers(@PathVariable Long teamId) {
        log.debug("REST request to search team members for team id : {}", teamId);
        return userProfileRepository.findByTeamId(teamId);
    }

    /**
     * {@code GET  /teams/:id} : get the "id" team.
     *
     * @param id the id of the team to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the team, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/teams/{id}")
    public ResponseEntity<Team> getTeam(@PathVariable Long id) {
        log.debug("REST request to get Team : {}", id);
        Optional<Team> team = teamRepository.findById(id);

        if (team.isPresent()) {
            // Get team members.
            log.debug("OK getting team members!");
            Set<UserProfile> teamMembers = new HashSet<>(userProfileRepository.findByTeamId(team.get().getId()));
            team.get().setMembers(teamMembers);
            log.debug("Found " + teamMembers.size() + " team members.");
        }

        return ResponseUtil.wrapOrNotFound(team);
    }

    /**
     * {@code DELETE  /teams/:id} : delete the "id" team.
     *
     * @param id the id of the team to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/teams/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        log.debug("REST request to delete Team : {}", id);

        // Authentication:
        Optional<Team> team = teamRepository.findById(id);
        if (team.isPresent()) {
            if (team.get().getOwner() == null || team.get().getOwner().getId() != userProfileService.getUserId()) {
                throw new RuntimeException("Unauthorized: You are not the owner of this team.");
            }
        }

        teamRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
