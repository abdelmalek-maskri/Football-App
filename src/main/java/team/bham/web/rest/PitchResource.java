package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.Pitch;
import team.bham.repository.PitchRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Pitch}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PitchResource {

    private final Logger log = LoggerFactory.getLogger(PitchResource.class);

    private static final String ENTITY_NAME = "pitch";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PitchRepository pitchRepository;

    public PitchResource(PitchRepository pitchRepository) {
        this.pitchRepository = pitchRepository;
    }

    /**
     * {@code POST  /pitches} : Create a new pitch.
     *
     * @param pitch the pitch to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pitch, or with status {@code 400 (Bad Request)} if the pitch has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/pitches")
    public ResponseEntity<Pitch> createPitch(@RequestBody Pitch pitch) throws URISyntaxException {
        log.debug("REST request to save Pitch : {}", pitch);
        if (pitch.getId() != null) {
            throw new BadRequestAlertException("A new pitch cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Pitch result = pitchRepository.save(pitch);
        return ResponseEntity
            .created(new URI("/api/pitches/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /pitches/:id} : Updates an existing pitch.
     *
     * @param id the id of the pitch to save.
     * @param pitch the pitch to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pitch,
     * or with status {@code 400 (Bad Request)} if the pitch is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pitch couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/pitches/{id}")
    public ResponseEntity<Pitch> updatePitch(@PathVariable(value = "id", required = false) final Long id, @RequestBody Pitch pitch)
        throws URISyntaxException {
        log.debug("REST request to update Pitch : {}, {}", id, pitch);
        if (pitch.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pitch.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pitchRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Pitch result = pitchRepository.save(pitch);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, pitch.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /pitches/:id} : Partial updates given fields of an existing pitch, field will ignore if it is null
     *
     * @param id the id of the pitch to save.
     * @param pitch the pitch to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pitch,
     * or with status {@code 400 (Bad Request)} if the pitch is not valid,
     * or with status {@code 404 (Not Found)} if the pitch is not found,
     * or with status {@code 500 (Internal Server Error)} if the pitch couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/pitches/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Pitch> partialUpdatePitch(@PathVariable(value = "id", required = false) final Long id, @RequestBody Pitch pitch)
        throws URISyntaxException {
        log.debug("REST request to partial update Pitch partially : {}, {}", id, pitch);
        if (pitch.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pitch.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pitchRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Pitch> result = pitchRepository
            .findById(pitch.getId())
            .map(existingPitch -> {
                if (pitch.getName() != null) {
                    existingPitch.setName(pitch.getName());
                }
                if (pitch.getLocation() != null) {
                    existingPitch.setLocation(pitch.getLocation());
                }

                return existingPitch;
            })
            .map(pitchRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, pitch.getId().toString())
        );
    }

    /**
     * {@code GET  /pitches} : get all the pitches.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pitches in body.
     */
    @GetMapping("/pitches")
    public List<Pitch> getAllPitches() {
        log.debug("REST request to get all Pitches");
        return pitchRepository.findAll();
    }

    /**
     * {@code GET  /pitches/:id} : get the "id" pitch.
     *
     * @param id the id of the pitch to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pitch, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/pitches/{id}")
    public ResponseEntity<Pitch> getPitch(@PathVariable Long id) {
        log.debug("REST request to get Pitch : {}", id);
        Optional<Pitch> pitch = pitchRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(pitch);
    }

    /**
     * {@code DELETE  /pitches/:id} : delete the "id" pitch.
     *
     * @param id the id of the pitch to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/pitches/{id}")
    public ResponseEntity<Void> deletePitch(@PathVariable Long id) {
        log.debug("REST request to delete Pitch : {}", id);
        pitchRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
