package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.Match;
import team.bham.repository.MatchRepository;

/**
 * Integration tests for the {@link MatchResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MatchResourceIT {

    private static final Integer DEFAULT_HOME_SCORE = 0;
    private static final Integer UPDATED_HOME_SCORE = 1;

    private static final Integer DEFAULT_AWAY_SCORE = 0;
    private static final Integer UPDATED_AWAY_SCORE = 1;

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/matches";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMatchMockMvc;

    private Match match;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Match createEntity(EntityManager em) {
        Match match = new Match().homeScore(DEFAULT_HOME_SCORE).awayScore(DEFAULT_AWAY_SCORE).date(DEFAULT_DATE);
        return match;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Match createUpdatedEntity(EntityManager em) {
        Match match = new Match().homeScore(UPDATED_HOME_SCORE).awayScore(UPDATED_AWAY_SCORE).date(UPDATED_DATE);
        return match;
    }

    @BeforeEach
    public void initTest() {
        match = createEntity(em);
    }

    @Test
    @Transactional
    void createMatch() throws Exception {
        int databaseSizeBeforeCreate = matchRepository.findAll().size();
        // Create the Match
        restMatchMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(match)))
            .andExpect(status().isCreated());

        // Validate the Match in the database
        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeCreate + 1);
        Match testMatch = matchList.get(matchList.size() - 1);
        assertThat(testMatch.getHomeScore()).isEqualTo(DEFAULT_HOME_SCORE);
        assertThat(testMatch.getAwayScore()).isEqualTo(DEFAULT_AWAY_SCORE);
        assertThat(testMatch.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createMatchWithExistingId() throws Exception {
        // Create the Match with an existing ID
        match.setId(1L);

        int databaseSizeBeforeCreate = matchRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMatchMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(match)))
            .andExpect(status().isBadRequest());

        // Validate the Match in the database
        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = matchRepository.findAll().size();
        // set the field null
        match.setDate(null);

        // Create the Match, which fails.

        restMatchMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(match)))
            .andExpect(status().isBadRequest());

        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMatches() throws Exception {
        // Initialize the database
        matchRepository.saveAndFlush(match);

        // Get all the matchList
        restMatchMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(match.getId().intValue())))
            .andExpect(jsonPath("$.[*].homeScore").value(hasItem(DEFAULT_HOME_SCORE)))
            .andExpect(jsonPath("$.[*].awayScore").value(hasItem(DEFAULT_AWAY_SCORE)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getMatch() throws Exception {
        // Initialize the database
        matchRepository.saveAndFlush(match);

        // Get the match
        restMatchMockMvc
            .perform(get(ENTITY_API_URL_ID, match.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(match.getId().intValue()))
            .andExpect(jsonPath("$.homeScore").value(DEFAULT_HOME_SCORE))
            .andExpect(jsonPath("$.awayScore").value(DEFAULT_AWAY_SCORE))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMatch() throws Exception {
        // Get the match
        restMatchMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMatch() throws Exception {
        // Initialize the database
        matchRepository.saveAndFlush(match);

        int databaseSizeBeforeUpdate = matchRepository.findAll().size();

        // Update the match
        Match updatedMatch = matchRepository.findById(match.getId()).get();
        // Disconnect from session so that the updates on updatedMatch are not directly saved in db
        em.detach(updatedMatch);
        updatedMatch.homeScore(UPDATED_HOME_SCORE).awayScore(UPDATED_AWAY_SCORE).date(UPDATED_DATE);

        restMatchMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMatch.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMatch))
            )
            .andExpect(status().isOk());

        // Validate the Match in the database
        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeUpdate);
        Match testMatch = matchList.get(matchList.size() - 1);
        assertThat(testMatch.getHomeScore()).isEqualTo(UPDATED_HOME_SCORE);
        assertThat(testMatch.getAwayScore()).isEqualTo(UPDATED_AWAY_SCORE);
        assertThat(testMatch.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingMatch() throws Exception {
        int databaseSizeBeforeUpdate = matchRepository.findAll().size();
        match.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMatchMockMvc
            .perform(
                put(ENTITY_API_URL_ID, match.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(match))
            )
            .andExpect(status().isBadRequest());

        // Validate the Match in the database
        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMatch() throws Exception {
        int databaseSizeBeforeUpdate = matchRepository.findAll().size();
        match.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMatchMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(match))
            )
            .andExpect(status().isBadRequest());

        // Validate the Match in the database
        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMatch() throws Exception {
        int databaseSizeBeforeUpdate = matchRepository.findAll().size();
        match.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMatchMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(match)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Match in the database
        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMatchWithPatch() throws Exception {
        // Initialize the database
        matchRepository.saveAndFlush(match);

        int databaseSizeBeforeUpdate = matchRepository.findAll().size();

        // Update the match using partial update
        Match partialUpdatedMatch = new Match();
        partialUpdatedMatch.setId(match.getId());

        partialUpdatedMatch.awayScore(UPDATED_AWAY_SCORE).date(UPDATED_DATE);

        restMatchMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMatch.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMatch))
            )
            .andExpect(status().isOk());

        // Validate the Match in the database
        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeUpdate);
        Match testMatch = matchList.get(matchList.size() - 1);
        assertThat(testMatch.getHomeScore()).isEqualTo(DEFAULT_HOME_SCORE);
        assertThat(testMatch.getAwayScore()).isEqualTo(UPDATED_AWAY_SCORE);
        assertThat(testMatch.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateMatchWithPatch() throws Exception {
        // Initialize the database
        matchRepository.saveAndFlush(match);

        int databaseSizeBeforeUpdate = matchRepository.findAll().size();

        // Update the match using partial update
        Match partialUpdatedMatch = new Match();
        partialUpdatedMatch.setId(match.getId());

        partialUpdatedMatch.homeScore(UPDATED_HOME_SCORE).awayScore(UPDATED_AWAY_SCORE).date(UPDATED_DATE);

        restMatchMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMatch.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMatch))
            )
            .andExpect(status().isOk());

        // Validate the Match in the database
        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeUpdate);
        Match testMatch = matchList.get(matchList.size() - 1);
        assertThat(testMatch.getHomeScore()).isEqualTo(UPDATED_HOME_SCORE);
        assertThat(testMatch.getAwayScore()).isEqualTo(UPDATED_AWAY_SCORE);
        assertThat(testMatch.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingMatch() throws Exception {
        int databaseSizeBeforeUpdate = matchRepository.findAll().size();
        match.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMatchMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, match.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(match))
            )
            .andExpect(status().isBadRequest());

        // Validate the Match in the database
        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMatch() throws Exception {
        int databaseSizeBeforeUpdate = matchRepository.findAll().size();
        match.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMatchMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(match))
            )
            .andExpect(status().isBadRequest());

        // Validate the Match in the database
        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMatch() throws Exception {
        int databaseSizeBeforeUpdate = matchRepository.findAll().size();
        match.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMatchMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(match)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Match in the database
        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMatch() throws Exception {
        // Initialize the database
        matchRepository.saveAndFlush(match);

        int databaseSizeBeforeDelete = matchRepository.findAll().size();

        // Delete the match
        restMatchMockMvc
            .perform(delete(ENTITY_API_URL_ID, match.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Match> matchList = matchRepository.findAll();
        assertThat(matchList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
