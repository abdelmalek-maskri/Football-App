package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AvailableDate.
 */
@Entity
@Table(name = "available_date")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AvailableDate implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "from_time", nullable = false)
    private Instant fromTime;

    @NotNull
    @Column(name = "to_time", nullable = false)
    private Instant toTime;

    @NotNull
    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable;

    @ManyToOne
    @JsonIgnoreProperties(value = { "contacts", "availableDates", "teamOwned", "team" }, allowSetters = true)
    private UserProfile userProfile;

    @ManyToOne
    @JsonIgnoreProperties(value = { "owner", "bookings", "availableDates", "members", "contacts", "tournaments" }, allowSetters = true)
    private Team team;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AvailableDate id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getFromTime() {
        return this.fromTime;
    }

    public AvailableDate fromTime(Instant fromTime) {
        this.setFromTime(fromTime);
        return this;
    }

    public void setFromTime(Instant fromTime) {
        this.fromTime = fromTime;
    }

    public Instant getToTime() {
        return this.toTime;
    }

    public AvailableDate toTime(Instant toTime) {
        this.setToTime(toTime);
        return this;
    }

    public void setToTime(Instant toTime) {
        this.toTime = toTime;
    }

    public Boolean getIsAvailable() {
        return this.isAvailable;
    }

    public AvailableDate isAvailable(Boolean isAvailable) {
        this.setIsAvailable(isAvailable);
        return this;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public AvailableDate userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    public Team getTeam() {
        return this.team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public AvailableDate team(Team team) {
        this.setTeam(team);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AvailableDate)) {
            return false;
        }
        return id != null && id.equals(((AvailableDate) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AvailableDate{" +
            "id=" + getId() +
            ", fromTime='" + getFromTime() + "'" +
            ", toTime='" + getToTime() + "'" +
            ", isAvailable='" + getIsAvailable() + "'" +
            "}";
    }
}
