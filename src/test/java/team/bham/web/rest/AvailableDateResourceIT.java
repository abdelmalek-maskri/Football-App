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
import team.bham.domain.AvailableDate;
import team.bham.repository.AvailableDateRepository;

/**
 * Integration tests for the {@link AvailableDateResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AvailableDateResourceIT {

    private static final Instant DEFAULT_FROM_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_FROM_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_TO_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TO_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_IS_AVAILABLE = false;
    private static final Boolean UPDATED_IS_AVAILABLE = true;

    private static final String ENTITY_API_URL = "/api/available-dates";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AvailableDateRepository availableDateRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAvailableDateMockMvc;

    private AvailableDate availableDate;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AvailableDate createEntity(EntityManager em) {
        AvailableDate availableDate = new AvailableDate()
            .fromTime(DEFAULT_FROM_TIME)
            .toTime(DEFAULT_TO_TIME)
            .isAvailable(DEFAULT_IS_AVAILABLE);
        return availableDate;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AvailableDate createUpdatedEntity(EntityManager em) {
        AvailableDate availableDate = new AvailableDate()
            .fromTime(UPDATED_FROM_TIME)
            .toTime(UPDATED_TO_TIME)
            .isAvailable(UPDATED_IS_AVAILABLE);
        return availableDate;
    }

    @BeforeEach
    public void initTest() {
        availableDate = createEntity(em);
    }

    @Test
    @Transactional
    void createAvailableDate() throws Exception {
        int databaseSizeBeforeCreate = availableDateRepository.findAll().size();
        // Create the AvailableDate
        restAvailableDateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(availableDate)))
            .andExpect(status().isCreated());

        // Validate the AvailableDate in the database
        List<AvailableDate> availableDateList = availableDateRepository.findAll();
        assertThat(availableDateList).hasSize(databaseSizeBeforeCreate + 1);
        AvailableDate testAvailableDate = availableDateList.get(availableDateList.size() - 1);
        assertThat(testAvailableDate.getFromTime()).isEqualTo(DEFAULT_FROM_TIME);
        assertThat(testAvailableDate.getToTime()).isEqualTo(DEFAULT_TO_TIME);
        assertThat(testAvailableDate.getIsAvailable()).isEqualTo(DEFAULT_IS_AVAILABLE);
    }

    @Test
    @Transactional
    void createAvailableDateWithExistingId() throws Exception {
        // Create the AvailableDate with an existing ID
        availableDate.setId(1L);

        int databaseSizeBeforeCreate = availableDateRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAvailableDateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(availableDate)))
            .andExpect(status().isBadRequest());

        // Validate the AvailableDate in the database
        List<AvailableDate> availableDateList = availableDateRepository.findAll();
        assertThat(availableDateList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFromTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = availableDateRepository.findAll().size();
        // set the field null
        availableDate.setFromTime(null);

        // Create the AvailableDate, which fails.

        restAvailableDateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(availableDate)))
            .andExpect(status().isBadRequest());

        List<AvailableDate> availableDateList = availableDateRepository.findAll();
        assertThat(availableDateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkToTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = availableDateRepository.findAll().size();
        // set the field null
        availableDate.setToTime(null);

        // Create the AvailableDate, which fails.

        restAvailableDateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(availableDate)))
            .andExpect(status().isBadRequest());

        List<AvailableDate> availableDateList = availableDateRepository.findAll();
        assertThat(availableDateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkIsAvailableIsRequired() throws Exception {
        int databaseSizeBeforeTest = availableDateRepository.findAll().size();
        // set the field null
        availableDate.setIsAvailable(null);

        // Create the AvailableDate, which fails.

        restAvailableDateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(availableDate)))
            .andExpect(status().isBadRequest());

        List<AvailableDate> availableDateList = availableDateRepository.findAll();
        assertThat(availableDateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAvailableDates() throws Exception {
        // Initialize the database
        availableDateRepository.saveAndFlush(availableDate);

        // Get all the availableDateList
        restAvailableDateMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(availableDate.getId().intValue())))
            .andExpect(jsonPath("$.[*].fromTime").value(hasItem(DEFAULT_FROM_TIME.toString())))
            .andExpect(jsonPath("$.[*].toTime").value(hasItem(DEFAULT_TO_TIME.toString())))
            .andExpect(jsonPath("$.[*].isAvailable").value(hasItem(DEFAULT_IS_AVAILABLE.booleanValue())));
    }

    @Test
    @Transactional
    void getAvailableDate() throws Exception {
        // Initialize the database
        availableDateRepository.saveAndFlush(availableDate);

        // Get the availableDate
        restAvailableDateMockMvc
            .perform(get(ENTITY_API_URL_ID, availableDate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(availableDate.getId().intValue()))
            .andExpect(jsonPath("$.fromTime").value(DEFAULT_FROM_TIME.toString()))
            .andExpect(jsonPath("$.toTime").value(DEFAULT_TO_TIME.toString()))
            .andExpect(jsonPath("$.isAvailable").value(DEFAULT_IS_AVAILABLE.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingAvailableDate() throws Exception {
        // Get the availableDate
        restAvailableDateMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAvailableDate() throws Exception {
        // Initialize the database
        availableDateRepository.saveAndFlush(availableDate);

        int databaseSizeBeforeUpdate = availableDateRepository.findAll().size();

        // Update the availableDate
        AvailableDate updatedAvailableDate = availableDateRepository.findById(availableDate.getId()).get();
        // Disconnect from session so that the updates on updatedAvailableDate are not directly saved in db
        em.detach(updatedAvailableDate);
        updatedAvailableDate.fromTime(UPDATED_FROM_TIME).toTime(UPDATED_TO_TIME).isAvailable(UPDATED_IS_AVAILABLE);

        restAvailableDateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAvailableDate.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAvailableDate))
            )
            .andExpect(status().isOk());

        // Validate the AvailableDate in the database
        List<AvailableDate> availableDateList = availableDateRepository.findAll();
        assertThat(availableDateList).hasSize(databaseSizeBeforeUpdate);
        AvailableDate testAvailableDate = availableDateList.get(availableDateList.size() - 1);
        assertThat(testAvailableDate.getFromTime()).isEqualTo(UPDATED_FROM_TIME);
        assertThat(testAvailableDate.getToTime()).isEqualTo(UPDATED_TO_TIME);
        assertThat(testAvailableDate.getIsAvailable()).isEqualTo(UPDATED_IS_AVAILABLE);
    }

    @Test
    @Transactional
    void putNonExistingAvailableDate() throws Exception {
        int databaseSizeBeforeUpdate = availableDateRepository.findAll().size();
        availableDate.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAvailableDateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, availableDate.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(availableDate))
            )
            .andExpect(status().isBadRequest());

        // Validate the AvailableDate in the database
        List<AvailableDate> availableDateList = availableDateRepository.findAll();
        assertThat(availableDateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAvailableDate() throws Exception {
        int databaseSizeBeforeUpdate = availableDateRepository.findAll().size();
        availableDate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAvailableDateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(availableDate))
            )
            .andExpect(status().isBadRequest());

        // Validate the AvailableDate in the database
        List<AvailableDate> availableDateList = availableDateRepository.findAll();
        assertThat(availableDateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAvailableDate() throws Exception {
        int databaseSizeBeforeUpdate = availableDateRepository.findAll().size();
        availableDate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAvailableDateMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(availableDate)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AvailableDate in the database
        List<AvailableDate> availableDateList = availableDateRepository.findAll();
        assertThat(availableDateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAvailableDateWithPatch() throws Exception {
        // Initialize the database
        availableDateRepository.saveAndFlush(availableDate);

        int databaseSizeBeforeUpdate = availableDateRepository.findAll().size();

        // Update the availableDate using partial update
        AvailableDate partialUpdatedAvailableDate = new AvailableDate();
        partialUpdatedAvailableDate.setId(availableDate.getId());

        partialUpdatedAvailableDate.isAvailable(UPDATED_IS_AVAILABLE);

        restAvailableDateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAvailableDate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAvailableDate))
            )
            .andExpect(status().isOk());

        // Validate the AvailableDate in the database
        List<AvailableDate> availableDateList = availableDateRepository.findAll();
        assertThat(availableDateList).hasSize(databaseSizeBeforeUpdate);
        AvailableDate testAvailableDate = availableDateList.get(availableDateList.size() - 1);
        assertThat(testAvailableDate.getFromTime()).isEqualTo(DEFAULT_FROM_TIME);
        assertThat(testAvailableDate.getToTime()).isEqualTo(DEFAULT_TO_TIME);
        assertThat(testAvailableDate.getIsAvailable()).isEqualTo(UPDATED_IS_AVAILABLE);
    }

    @Test
    @Transactional
    void fullUpdateAvailableDateWithPatch() throws Exception {
        // Initialize the database
        availableDateRepository.saveAndFlush(availableDate);

        int databaseSizeBeforeUpdate = availableDateRepository.findAll().size();

        // Update the availableDate using partial update
        AvailableDate partialUpdatedAvailableDate = new AvailableDate();
        partialUpdatedAvailableDate.setId(availableDate.getId());

        partialUpdatedAvailableDate.fromTime(UPDATED_FROM_TIME).toTime(UPDATED_TO_TIME).isAvailable(UPDATED_IS_AVAILABLE);

        restAvailableDateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAvailableDate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAvailableDate))
            )
            .andExpect(status().isOk());

        // Validate the AvailableDate in the database
        List<AvailableDate> availableDateList = availableDateRepository.findAll();
        assertThat(availableDateList).hasSize(databaseSizeBeforeUpdate);
        AvailableDate testAvailableDate = availableDateList.get(availableDateList.size() - 1);
        assertThat(testAvailableDate.getFromTime()).isEqualTo(UPDATED_FROM_TIME);
        assertThat(testAvailableDate.getToTime()).isEqualTo(UPDATED_TO_TIME);
        assertThat(testAvailableDate.getIsAvailable()).isEqualTo(UPDATED_IS_AVAILABLE);
    }

    @Test
    @Transactional
    void patchNonExistingAvailableDate() throws Exception {
        int databaseSizeBeforeUpdate = availableDateRepository.findAll().size();
        availableDate.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAvailableDateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, availableDate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(availableDate))
            )
            .andExpect(status().isBadRequest());

        // Validate the AvailableDate in the database
        List<AvailableDate> availableDateList = availableDateRepository.findAll();
        assertThat(availableDateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAvailableDate() throws Exception {
        int databaseSizeBeforeUpdate = availableDateRepository.findAll().size();
        availableDate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAvailableDateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(availableDate))
            )
            .andExpect(status().isBadRequest());

        // Validate the AvailableDate in the database
        List<AvailableDate> availableDateList = availableDateRepository.findAll();
        assertThat(availableDateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAvailableDate() throws Exception {
        int databaseSizeBeforeUpdate = availableDateRepository.findAll().size();
        availableDate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAvailableDateMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(availableDate))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AvailableDate in the database
        List<AvailableDate> availableDateList = availableDateRepository.findAll();
        assertThat(availableDateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAvailableDate() throws Exception {
        // Initialize the database
        availableDateRepository.saveAndFlush(availableDate);

        int databaseSizeBeforeDelete = availableDateRepository.findAll().size();

        // Delete the availableDate
        restAvailableDateMockMvc
            .perform(delete(ENTITY_API_URL_ID, availableDate.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AvailableDate> availableDateList = availableDateRepository.findAll();
        assertThat(availableDateList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
