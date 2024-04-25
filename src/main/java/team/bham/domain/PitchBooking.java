package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PitchBooking.
 */
@Entity
@Table(name = "pitch_booking")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PitchBooking implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "booking_date", nullable = false)
    private Instant bookingDate;

    @NotNull
    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @NotNull
    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @NotNull
    @Column(name = "user_profile_id", nullable = false)
    private Long userProfileId; // Added field for user_profile_id

    @ManyToOne
    @JsonIgnoreProperties(value = { "owner", "bookings", "availableDates", "members", "contacts", "tournaments" }, allowSetters = true)
    private Team team;

    @ManyToOne
    @JsonIgnoreProperties(value = { "pitchBookings" }, allowSetters = true)
    private Pitch pitch;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PitchBooking id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getBookingDate() {
        return this.bookingDate;
    }

    public PitchBooking bookingDate(Instant bookingDate) {
        this.setBookingDate(bookingDate);
        return this;
    }

    public void setBookingDate(Instant bookingDate) {
        this.bookingDate = bookingDate;
    }

    public Instant getStartTime() {
        return this.startTime;
    }

    public PitchBooking startTime(Instant startTime) {
        this.setStartTime(startTime);
        return this;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return this.endTime;
    }

    public PitchBooking endTime(Instant endTime) {
        this.setEndTime(endTime);
        return this;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public Team getTeam() {
        return this.team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public PitchBooking team(Team team) {
        this.setTeam(team);
        return this;
    }

    public Pitch getPitch() {
        return this.pitch;
    }

    public void setPitch(Pitch pitch) {
        this.pitch = pitch;
    }

    public PitchBooking pitch(Pitch pitch) {
        this.setPitch(pitch);
        return this;
    }

    public Long getUserProfileId() {
        return this.userProfileId;
    }

    public void setUserProfileId(Long userProfileId) {
        this.userProfileId = userProfileId;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PitchBooking)) {
            return false;
        }
        return id != null && id.equals(((PitchBooking) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PitchBooking{" +
            "id=" + getId() +
            ", bookingDate='" + getBookingDate() + "'" +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            "}";
    }
}
