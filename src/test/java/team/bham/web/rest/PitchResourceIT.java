package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import team.bham.domain.Pitch;
import team.bham.repository.PitchRepository;

/**
 * Integration tests for the {@link PitchResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PitchResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/pitches";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PitchRepository pitchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPitchMockMvc;

    private Pitch pitch;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pitch createEntity(EntityManager em) {
        Pitch pitch = new Pitch().name(DEFAULT_NAME).location(DEFAULT_LOCATION);
        return pitch;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pitch createUpdatedEntity(EntityManager em) {
        Pitch pitch = new Pitch().name(UPDATED_NAME).location(UPDATED_LOCATION);
        return pitch;
    }

    @BeforeEach
    public void initTest() {
        pitch = createEntity(em);
    }

    @Test
    @Transactional
    void createPitch() throws Exception {
        int databaseSizeBeforeCreate = pitchRepository.findAll().size();
        // Create the Pitch
        restPitchMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pitch)))
            .andExpect(status().isCreated());

        // Validate the Pitch in the database
        List<Pitch> pitchList = pitchRepository.findAll();
        assertThat(pitchList).hasSize(databaseSizeBeforeCreate + 1);
        Pitch testPitch = pitchList.get(pitchList.size() - 1);
        assertThat(testPitch.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPitch.getLocation()).isEqualTo(DEFAULT_LOCATION);
    }

    @Test
    @Transactional
    void createPitchWithExistingId() throws Exception {
        // Create the Pitch with an existing ID
        pitch.setId(1L);

        int databaseSizeBeforeCreate = pitchRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPitchMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pitch)))
            .andExpect(status().isBadRequest());

        // Validate the Pitch in the database
        List<Pitch> pitchList = pitchRepository.findAll();
        assertThat(pitchList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPitches() throws Exception {
        // Initialize the database
        pitchRepository.saveAndFlush(pitch);

        // Get all the pitchList
        restPitchMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pitch.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)));
    }

    @Test
    @Transactional
    void getPitch() throws Exception {
        // Initialize the database
        pitchRepository.saveAndFlush(pitch);

        // Get the pitch
        restPitchMockMvc
            .perform(get(ENTITY_API_URL_ID, pitch.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pitch.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION));
    }

    @Test
    @Transactional
    void getNonExistingPitch() throws Exception {
        // Get the pitch
        restPitchMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPitch() throws Exception {
        // Initialize the database
        pitchRepository.saveAndFlush(pitch);

        int databaseSizeBeforeUpdate = pitchRepository.findAll().size();

        // Update the pitch
        Pitch updatedPitch = pitchRepository.findById(pitch.getId()).get();
        // Disconnect from session so that the updates on updatedPitch are not directly saved in db
        em.detach(updatedPitch);
        updatedPitch.name(UPDATED_NAME).location(UPDATED_LOCATION);

        restPitchMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPitch.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPitch))
            )
            .andExpect(status().isOk());

        // Validate the Pitch in the database
        List<Pitch> pitchList = pitchRepository.findAll();
        assertThat(pitchList).hasSize(databaseSizeBeforeUpdate);
        Pitch testPitch = pitchList.get(pitchList.size() - 1);
        assertThat(testPitch.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPitch.getLocation()).isEqualTo(UPDATED_LOCATION);
    }

    @Test
    @Transactional
    void putNonExistingPitch() throws Exception {
        int databaseSizeBeforeUpdate = pitchRepository.findAll().size();
        pitch.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPitchMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pitch.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pitch))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pitch in the database
        List<Pitch> pitchList = pitchRepository.findAll();
        assertThat(pitchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPitch() throws Exception {
        int databaseSizeBeforeUpdate = pitchRepository.findAll().size();
        pitch.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPitchMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pitch))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pitch in the database
        List<Pitch> pitchList = pitchRepository.findAll();
        assertThat(pitchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPitch() throws Exception {
        int databaseSizeBeforeUpdate = pitchRepository.findAll().size();
        pitch.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPitchMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pitch)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pitch in the database
        List<Pitch> pitchList = pitchRepository.findAll();
        assertThat(pitchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePitchWithPatch() throws Exception {
        // Initialize the database
        pitchRepository.saveAndFlush(pitch);

        int databaseSizeBeforeUpdate = pitchRepository.findAll().size();

        // Update the pitch using partial update
        Pitch partialUpdatedPitch = new Pitch();
        partialUpdatedPitch.setId(pitch.getId());

        partialUpdatedPitch.name(UPDATED_NAME);

        restPitchMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPitch.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPitch))
            )
            .andExpect(status().isOk());

        // Validate the Pitch in the database
        List<Pitch> pitchList = pitchRepository.findAll();
        assertThat(pitchList).hasSize(databaseSizeBeforeUpdate);
        Pitch testPitch = pitchList.get(pitchList.size() - 1);
        assertThat(testPitch.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPitch.getLocation()).isEqualTo(DEFAULT_LOCATION);
    }

    @Test
    @Transactional
    void fullUpdatePitchWithPatch() throws Exception {
        // Initialize the database
        pitchRepository.saveAndFlush(pitch);

        int databaseSizeBeforeUpdate = pitchRepository.findAll().size();

        // Update the pitch using partial update
        Pitch partialUpdatedPitch = new Pitch();
        partialUpdatedPitch.setId(pitch.getId());

        partialUpdatedPitch.name(UPDATED_NAME).location(UPDATED_LOCATION);

        restPitchMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPitch.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPitch))
            )
            .andExpect(status().isOk());

        // Validate the Pitch in the database
        List<Pitch> pitchList = pitchRepository.findAll();
        assertThat(pitchList).hasSize(databaseSizeBeforeUpdate);
        Pitch testPitch = pitchList.get(pitchList.size() - 1);
        assertThat(testPitch.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPitch.getLocation()).isEqualTo(UPDATED_LOCATION);
    }

    @Test
    @Transactional
    void patchNonExistingPitch() throws Exception {
        int databaseSizeBeforeUpdate = pitchRepository.findAll().size();
        pitch.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPitchMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pitch.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pitch))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pitch in the database
        List<Pitch> pitchList = pitchRepository.findAll();
        assertThat(pitchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPitch() throws Exception {
        int databaseSizeBeforeUpdate = pitchRepository.findAll().size();
        pitch.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPitchMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pitch))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pitch in the database
        List<Pitch> pitchList = pitchRepository.findAll();
        assertThat(pitchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPitch() throws Exception {
        int databaseSizeBeforeUpdate = pitchRepository.findAll().size();
        pitch.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPitchMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(pitch)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pitch in the database
        List<Pitch> pitchList = pitchRepository.findAll();
        assertThat(pitchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePitch() throws Exception {
        // Initialize the database
        pitchRepository.saveAndFlush(pitch);

        int databaseSizeBeforeDelete = pitchRepository.findAll().size();

        // Delete the pitch
        restPitchMockMvc
            .perform(delete(ENTITY_API_URL_ID, pitch.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Pitch> pitchList = pitchRepository.findAll();
        assertThat(pitchList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
