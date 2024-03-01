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
import team.bham.domain.PitchBooking;
import team.bham.repository.PitchBookingRepository;

/**
 * Integration tests for the {@link PitchBookingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PitchBookingResourceIT {

    private static final Instant DEFAULT_BOOKING_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_BOOKING_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_START_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/pitch-bookings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PitchBookingRepository pitchBookingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPitchBookingMockMvc;

    private PitchBooking pitchBooking;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PitchBooking createEntity(EntityManager em) {
        PitchBooking pitchBooking = new PitchBooking()
            .bookingDate(DEFAULT_BOOKING_DATE)
            .startTime(DEFAULT_START_TIME)
            .endTime(DEFAULT_END_TIME);
        return pitchBooking;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PitchBooking createUpdatedEntity(EntityManager em) {
        PitchBooking pitchBooking = new PitchBooking()
            .bookingDate(UPDATED_BOOKING_DATE)
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME);
        return pitchBooking;
    }

    @BeforeEach
    public void initTest() {
        pitchBooking = createEntity(em);
    }

    @Test
    @Transactional
    void createPitchBooking() throws Exception {
        int databaseSizeBeforeCreate = pitchBookingRepository.findAll().size();
        // Create the PitchBooking
        restPitchBookingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pitchBooking)))
            .andExpect(status().isCreated());

        // Validate the PitchBooking in the database
        List<PitchBooking> pitchBookingList = pitchBookingRepository.findAll();
        assertThat(pitchBookingList).hasSize(databaseSizeBeforeCreate + 1);
        PitchBooking testPitchBooking = pitchBookingList.get(pitchBookingList.size() - 1);
        assertThat(testPitchBooking.getBookingDate()).isEqualTo(DEFAULT_BOOKING_DATE);
        assertThat(testPitchBooking.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testPitchBooking.getEndTime()).isEqualTo(DEFAULT_END_TIME);
    }

    @Test
    @Transactional
    void createPitchBookingWithExistingId() throws Exception {
        // Create the PitchBooking with an existing ID
        pitchBooking.setId(1L);

        int databaseSizeBeforeCreate = pitchBookingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPitchBookingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pitchBooking)))
            .andExpect(status().isBadRequest());

        // Validate the PitchBooking in the database
        List<PitchBooking> pitchBookingList = pitchBookingRepository.findAll();
        assertThat(pitchBookingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkBookingDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = pitchBookingRepository.findAll().size();
        // set the field null
        pitchBooking.setBookingDate(null);

        // Create the PitchBooking, which fails.

        restPitchBookingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pitchBooking)))
            .andExpect(status().isBadRequest());

        List<PitchBooking> pitchBookingList = pitchBookingRepository.findAll();
        assertThat(pitchBookingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStartTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = pitchBookingRepository.findAll().size();
        // set the field null
        pitchBooking.setStartTime(null);

        // Create the PitchBooking, which fails.

        restPitchBookingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pitchBooking)))
            .andExpect(status().isBadRequest());

        List<PitchBooking> pitchBookingList = pitchBookingRepository.findAll();
        assertThat(pitchBookingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEndTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = pitchBookingRepository.findAll().size();
        // set the field null
        pitchBooking.setEndTime(null);

        // Create the PitchBooking, which fails.

        restPitchBookingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pitchBooking)))
            .andExpect(status().isBadRequest());

        List<PitchBooking> pitchBookingList = pitchBookingRepository.findAll();
        assertThat(pitchBookingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPitchBookings() throws Exception {
        // Initialize the database
        pitchBookingRepository.saveAndFlush(pitchBooking);

        // Get all the pitchBookingList
        restPitchBookingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pitchBooking.getId().intValue())))
            .andExpect(jsonPath("$.[*].bookingDate").value(hasItem(DEFAULT_BOOKING_DATE.toString())))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(DEFAULT_START_TIME.toString())))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(DEFAULT_END_TIME.toString())));
    }

    @Test
    @Transactional
    void getPitchBooking() throws Exception {
        // Initialize the database
        pitchBookingRepository.saveAndFlush(pitchBooking);

        // Get the pitchBooking
        restPitchBookingMockMvc
            .perform(get(ENTITY_API_URL_ID, pitchBooking.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pitchBooking.getId().intValue()))
            .andExpect(jsonPath("$.bookingDate").value(DEFAULT_BOOKING_DATE.toString()))
            .andExpect(jsonPath("$.startTime").value(DEFAULT_START_TIME.toString()))
            .andExpect(jsonPath("$.endTime").value(DEFAULT_END_TIME.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPitchBooking() throws Exception {
        // Get the pitchBooking
        restPitchBookingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPitchBooking() throws Exception {
        // Initialize the database
        pitchBookingRepository.saveAndFlush(pitchBooking);

        int databaseSizeBeforeUpdate = pitchBookingRepository.findAll().size();

        // Update the pitchBooking
        PitchBooking updatedPitchBooking = pitchBookingRepository.findById(pitchBooking.getId()).get();
        // Disconnect from session so that the updates on updatedPitchBooking are not directly saved in db
        em.detach(updatedPitchBooking);
        updatedPitchBooking.bookingDate(UPDATED_BOOKING_DATE).startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restPitchBookingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPitchBooking.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPitchBooking))
            )
            .andExpect(status().isOk());

        // Validate the PitchBooking in the database
        List<PitchBooking> pitchBookingList = pitchBookingRepository.findAll();
        assertThat(pitchBookingList).hasSize(databaseSizeBeforeUpdate);
        PitchBooking testPitchBooking = pitchBookingList.get(pitchBookingList.size() - 1);
        assertThat(testPitchBooking.getBookingDate()).isEqualTo(UPDATED_BOOKING_DATE);
        assertThat(testPitchBooking.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testPitchBooking.getEndTime()).isEqualTo(UPDATED_END_TIME);
    }

    @Test
    @Transactional
    void putNonExistingPitchBooking() throws Exception {
        int databaseSizeBeforeUpdate = pitchBookingRepository.findAll().size();
        pitchBooking.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPitchBookingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pitchBooking.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pitchBooking))
            )
            .andExpect(status().isBadRequest());

        // Validate the PitchBooking in the database
        List<PitchBooking> pitchBookingList = pitchBookingRepository.findAll();
        assertThat(pitchBookingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPitchBooking() throws Exception {
        int databaseSizeBeforeUpdate = pitchBookingRepository.findAll().size();
        pitchBooking.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPitchBookingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pitchBooking))
            )
            .andExpect(status().isBadRequest());

        // Validate the PitchBooking in the database
        List<PitchBooking> pitchBookingList = pitchBookingRepository.findAll();
        assertThat(pitchBookingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPitchBooking() throws Exception {
        int databaseSizeBeforeUpdate = pitchBookingRepository.findAll().size();
        pitchBooking.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPitchBookingMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pitchBooking)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PitchBooking in the database
        List<PitchBooking> pitchBookingList = pitchBookingRepository.findAll();
        assertThat(pitchBookingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePitchBookingWithPatch() throws Exception {
        // Initialize the database
        pitchBookingRepository.saveAndFlush(pitchBooking);

        int databaseSizeBeforeUpdate = pitchBookingRepository.findAll().size();

        // Update the pitchBooking using partial update
        PitchBooking partialUpdatedPitchBooking = new PitchBooking();
        partialUpdatedPitchBooking.setId(pitchBooking.getId());

        partialUpdatedPitchBooking.bookingDate(UPDATED_BOOKING_DATE).startTime(UPDATED_START_TIME);

        restPitchBookingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPitchBooking.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPitchBooking))
            )
            .andExpect(status().isOk());

        // Validate the PitchBooking in the database
        List<PitchBooking> pitchBookingList = pitchBookingRepository.findAll();
        assertThat(pitchBookingList).hasSize(databaseSizeBeforeUpdate);
        PitchBooking testPitchBooking = pitchBookingList.get(pitchBookingList.size() - 1);
        assertThat(testPitchBooking.getBookingDate()).isEqualTo(UPDATED_BOOKING_DATE);
        assertThat(testPitchBooking.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testPitchBooking.getEndTime()).isEqualTo(DEFAULT_END_TIME);
    }

    @Test
    @Transactional
    void fullUpdatePitchBookingWithPatch() throws Exception {
        // Initialize the database
        pitchBookingRepository.saveAndFlush(pitchBooking);

        int databaseSizeBeforeUpdate = pitchBookingRepository.findAll().size();

        // Update the pitchBooking using partial update
        PitchBooking partialUpdatedPitchBooking = new PitchBooking();
        partialUpdatedPitchBooking.setId(pitchBooking.getId());

        partialUpdatedPitchBooking.bookingDate(UPDATED_BOOKING_DATE).startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restPitchBookingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPitchBooking.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPitchBooking))
            )
            .andExpect(status().isOk());

        // Validate the PitchBooking in the database
        List<PitchBooking> pitchBookingList = pitchBookingRepository.findAll();
        assertThat(pitchBookingList).hasSize(databaseSizeBeforeUpdate);
        PitchBooking testPitchBooking = pitchBookingList.get(pitchBookingList.size() - 1);
        assertThat(testPitchBooking.getBookingDate()).isEqualTo(UPDATED_BOOKING_DATE);
        assertThat(testPitchBooking.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testPitchBooking.getEndTime()).isEqualTo(UPDATED_END_TIME);
    }

    @Test
    @Transactional
    void patchNonExistingPitchBooking() throws Exception {
        int databaseSizeBeforeUpdate = pitchBookingRepository.findAll().size();
        pitchBooking.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPitchBookingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pitchBooking.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pitchBooking))
            )
            .andExpect(status().isBadRequest());

        // Validate the PitchBooking in the database
        List<PitchBooking> pitchBookingList = pitchBookingRepository.findAll();
        assertThat(pitchBookingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPitchBooking() throws Exception {
        int databaseSizeBeforeUpdate = pitchBookingRepository.findAll().size();
        pitchBooking.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPitchBookingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pitchBooking))
            )
            .andExpect(status().isBadRequest());

        // Validate the PitchBooking in the database
        List<PitchBooking> pitchBookingList = pitchBookingRepository.findAll();
        assertThat(pitchBookingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPitchBooking() throws Exception {
        int databaseSizeBeforeUpdate = pitchBookingRepository.findAll().size();
        pitchBooking.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPitchBookingMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(pitchBooking))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PitchBooking in the database
        List<PitchBooking> pitchBookingList = pitchBookingRepository.findAll();
        assertThat(pitchBookingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePitchBooking() throws Exception {
        // Initialize the database
        pitchBookingRepository.saveAndFlush(pitchBooking);

        int databaseSizeBeforeDelete = pitchBookingRepository.findAll().size();

        // Delete the pitchBooking
        restPitchBookingMockMvc
            .perform(delete(ENTITY_API_URL_ID, pitchBooking.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PitchBooking> pitchBookingList = pitchBookingRepository.findAll();
        assertThat(pitchBookingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
