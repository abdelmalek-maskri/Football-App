package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Pitch.
 */
@Entity
@Table(name = "pitch")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Pitch implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "location")
    private String location;

    @OneToMany(mappedBy = "pitch")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "team", "pitch" }, allowSetters = true)
    private Set<PitchBooking> pitchBookings = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Pitch id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Pitch name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return this.location;
    }

    public Pitch location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Set<PitchBooking> getPitchBookings() {
        return this.pitchBookings;
    }

    public void setPitchBookings(Set<PitchBooking> pitchBookings) {
        if (this.pitchBookings != null) {
            this.pitchBookings.forEach(i -> i.setPitch(null));
        }
        if (pitchBookings != null) {
            pitchBookings.forEach(i -> i.setPitch(this));
        }
        this.pitchBookings = pitchBookings;
    }

    public Pitch pitchBookings(Set<PitchBooking> pitchBookings) {
        this.setPitchBookings(pitchBookings);
        return this;
    }

    public Pitch addPitchBooking(PitchBooking pitchBooking) {
        this.pitchBookings.add(pitchBooking);
        pitchBooking.setPitch(this);
        return this;
    }

    public Pitch removePitchBooking(PitchBooking pitchBooking) {
        this.pitchBookings.remove(pitchBooking);
        pitchBooking.setPitch(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pitch)) {
            return false;
        }
        return id != null && id.equals(((Pitch) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pitch{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", location='" + getLocation() + "'" +
            "}";
    }
}
