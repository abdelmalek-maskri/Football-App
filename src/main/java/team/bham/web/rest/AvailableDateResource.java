package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
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
import team.bham.domain.AvailableDate;
import team.bham.repository.AvailableDateRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.AvailableDate}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AvailableDateResource {

    private final Logger log = LoggerFactory.getLogger(AvailableDateResource.class);

    private static final String ENTITY_NAME = "availableDate";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AvailableDateRepository availableDateRepository;

    public AvailableDateResource(AvailableDateRepository availableDateRepository) {
        this.availableDateRepository = availableDateRepository;
    }

    /**
     * {@code POST  /available-dates} : Create a new availableDate.
     *
     * @param availableDate the availableDate to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new availableDate, or with status {@code 400 (Bad Request)} if the availableDate has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/available-dates")
    public ResponseEntity<AvailableDate> createAvailableDate(@Valid @RequestBody AvailableDate availableDate) throws URISyntaxException {
        log.debug("REST request to save AvailableDate : {}", availableDate);
        if (availableDate.getId() != null) {
            throw new BadRequestAlertException("A new availableDate cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AvailableDate result = availableDateRepository.save(availableDate);
        return ResponseEntity
            .created(new URI("/api/available-dates/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /available-dates/:id} : Updates an existing availableDate.
     *
     * @param id the id of the availableDate to save.
     * @param availableDate the availableDate to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated availableDate,
     * or with status {@code 400 (Bad Request)} if the availableDate is not valid,
     * or with status {@code 500 (Internal Server Error)} if the availableDate couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/available-dates/{id}")
    public ResponseEntity<AvailableDate> updateAvailableDate(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AvailableDate availableDate
    ) throws URISyntaxException {
        log.debug("REST request to update AvailableDate : {}, {}", id, availableDate);
        if (availableDate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, availableDate.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!availableDateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AvailableDate result = availableDateRepository.save(availableDate);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, availableDate.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /available-dates/:id} : Partial updates given fields of an existing availableDate, field will ignore if it is null
     *
     * @param id the id of the availableDate to save.
     * @param availableDate the availableDate to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated availableDate,
     * or with status {@code 400 (Bad Request)} if the availableDate is not valid,
     * or with status {@code 404 (Not Found)} if the availableDate is not found,
     * or with status {@code 500 (Internal Server Error)} if the availableDate couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/available-dates/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AvailableDate> partialUpdateAvailableDate(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AvailableDate availableDate
    ) throws URISyntaxException {
        log.debug("REST request to partial update AvailableDate partially : {}, {}", id, availableDate);
        if (availableDate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, availableDate.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!availableDateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AvailableDate> result = availableDateRepository
            .findById(availableDate.getId())
            .map(existingAvailableDate -> {
                if (availableDate.getFromTime() != null) {
                    existingAvailableDate.setFromTime(availableDate.getFromTime());
                }
                if (availableDate.getToTime() != null) {
                    existingAvailableDate.setToTime(availableDate.getToTime());
                }
                if (availableDate.getIsAvailable() != null) {
                    existingAvailableDate.setIsAvailable(availableDate.getIsAvailable());
                }

                return existingAvailableDate;
            })
            .map(availableDateRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, availableDate.getId().toString())
        );
    }

    /**
     * {@code GET  /available-dates} : get all the availableDates.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of availableDates in body.
     */
    @GetMapping("/available-dates")
    public List<AvailableDate> getAllAvailableDates() {
        log.debug("REST request to get all AvailableDates");
        return availableDateRepository.findAll();
    }

    /**
     * {@code GET  /available-dates/:id} : get the "id" availableDate.
     *
     * @param id the id of the availableDate to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the availableDate, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/available-dates/{id}")
    public ResponseEntity<AvailableDate> getAvailableDate(@PathVariable Long id) {
        log.debug("REST request to get AvailableDate : {}", id);
        Optional<AvailableDate> availableDate = availableDateRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(availableDate);
    }

    @GetMapping("/available-dates/user/{userId}")
    public List<AvailableDate> getUserAvaliableDate(@PathVariable Long userId) {
        log.debug("REST request to get AvailableDate of user : {}", userId);

        List<AvailableDate> allAvailableDate = availableDateRepository.findAll();

        List<AvailableDate> usersDate = new ArrayList<>();

        for (AvailableDate ad : allAvailableDate) {
            if (ad.getUserProfile() != null) {
                if (Objects.equals(ad.getUserProfile().getId(), userId)) {
                    usersDate.add(ad);
                }
            }
        }

        return usersDate;
    }

    /**
     * {@code DELETE  /available-dates/:id} : delete the "id" availableDate.
     *
     * @param id the id of the availableDate to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/available-dates/{id}")
    public ResponseEntity<Void> deleteAvailableDate(@PathVariable Long id) {
        log.debug("REST request to delete AvailableDate : {}", id);
        availableDateRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
