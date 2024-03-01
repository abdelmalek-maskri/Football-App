package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.PlayType;

/**
 * A Team.
 */
@Entity
@Table(name = "team")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Team implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "created", nullable = false)
    private Instant created;

    @NotNull
    @Size(min = 2, max = 40)
    @Column(name = "name", length = 40, nullable = false)
    private String name;

    @Size(max = 512)
    @Column(name = "description", length = 512)
    private String description;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @Size(max = 6)
    @Column(name = "colour", length = 6)
    private String colour;

    @Size(max = 64)
    @Column(name = "schedule", length = 64)
    private String schedule;

    @Enumerated(EnumType.STRING)
    @Column(name = "play_type")
    private PlayType playType;

    @JsonIgnoreProperties(value = { "contacts", "availableDates", "teamOwned", "team" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private UserProfile owner;

    @OneToMany(mappedBy = "team")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "pitch", "team" }, allowSetters = true)
    private Set<PitchBooking> bookings = new HashSet<>();

    @OneToMany(mappedBy = "team")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile", "team" }, allowSetters = true)
    private Set<AvailableDate> availableDates = new HashSet<>();

    @OneToMany(mappedBy = "team")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "contacts", "availableDates", "teamOwned", "team" }, allowSetters = true)
    private Set<UserProfile> members = new HashSet<>();

    @OneToMany(mappedBy = "team")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile", "team" }, allowSetters = true)
    private Set<Contact> contacts = new HashSet<>();

    @ManyToMany(mappedBy = "teams")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "matches", "teams" }, allowSetters = true)
    private Set<Tournament> tournaments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Team id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getCreated() {
        return this.created;
    }

    public Team created(Instant created) {
        this.setCreated(created);
        return this;
    }

    public void setCreated(Instant created) {
        this.created = created;
    }

    public String getName() {
        return this.name;
    }

    public Team name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Team description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getImage() {
        return this.image;
    }

    public Team image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public Team imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public String getColour() {
        return this.colour;
    }

    public Team colour(String colour) {
        this.setColour(colour);
        return this;
    }

    public void setColour(String colour) {
        this.colour = colour;
    }

    public String getSchedule() {
        return this.schedule;
    }

    public Team schedule(String schedule) {
        this.setSchedule(schedule);
        return this;
    }

    public void setSchedule(String schedule) {
        this.schedule = schedule;
    }

    public PlayType getPlayType() {
        return this.playType;
    }

    public Team playType(PlayType playType) {
        this.setPlayType(playType);
        return this;
    }

    public void setPlayType(PlayType playType) {
        this.playType = playType;
    }

    public UserProfile getOwner() {
        return this.owner;
    }

    public void setOwner(UserProfile userProfile) {
        this.owner = userProfile;
    }

    public Team owner(UserProfile userProfile) {
        this.setOwner(userProfile);
        return this;
    }

    public Set<PitchBooking> getBookings() {
        return this.bookings;
    }

    public void setBookings(Set<PitchBooking> pitchBookings) {
        if (this.bookings != null) {
            this.bookings.forEach(i -> i.setTeam(null));
        }
        if (pitchBookings != null) {
            pitchBookings.forEach(i -> i.setTeam(this));
        }
        this.bookings = pitchBookings;
    }

    public Team bookings(Set<PitchBooking> pitchBookings) {
        this.setBookings(pitchBookings);
        return this;
    }

    public Team addBookings(PitchBooking pitchBooking) {
        this.bookings.add(pitchBooking);
        pitchBooking.setTeam(this);
        return this;
    }

    public Team removeBookings(PitchBooking pitchBooking) {
        this.bookings.remove(pitchBooking);
        pitchBooking.setTeam(null);
        return this;
    }

    public Set<AvailableDate> getAvailableDates() {
        return this.availableDates;
    }

    public void setAvailableDates(Set<AvailableDate> availableDates) {
        if (this.availableDates != null) {
            this.availableDates.forEach(i -> i.setTeam(null));
        }
        if (availableDates != null) {
            availableDates.forEach(i -> i.setTeam(this));
        }
        this.availableDates = availableDates;
    }

    public Team availableDates(Set<AvailableDate> availableDates) {
        this.setAvailableDates(availableDates);
        return this;
    }

    public Team addAvailableDates(AvailableDate availableDate) {
        this.availableDates.add(availableDate);
        availableDate.setTeam(this);
        return this;
    }

    public Team removeAvailableDates(AvailableDate availableDate) {
        this.availableDates.remove(availableDate);
        availableDate.setTeam(null);
        return this;
    }

    public Set<UserProfile> getMembers() {
        return this.members;
    }

    public void setMembers(Set<UserProfile> userProfiles) {
        if (this.members != null) {
            this.members.forEach(i -> i.setTeam(null));
        }
        if (userProfiles != null) {
            userProfiles.forEach(i -> i.setTeam(this));
        }
        this.members = userProfiles;
    }

    public Team members(Set<UserProfile> userProfiles) {
        this.setMembers(userProfiles);
        return this;
    }

    public Team addMembers(UserProfile userProfile) {
        this.members.add(userProfile);
        userProfile.setTeam(this);
        return this;
    }

    public Team removeMembers(UserProfile userProfile) {
        this.members.remove(userProfile);
        userProfile.setTeam(null);
        return this;
    }

    public Set<Contact> getContacts() {
        return this.contacts;
    }

    public void setContacts(Set<Contact> contacts) {
        if (this.contacts != null) {
            this.contacts.forEach(i -> i.setTeam(null));
        }
        if (contacts != null) {
            contacts.forEach(i -> i.setTeam(this));
        }
        this.contacts = contacts;
    }

    public Team contacts(Set<Contact> contacts) {
        this.setContacts(contacts);
        return this;
    }

    public Team addContacts(Contact contact) {
        this.contacts.add(contact);
        contact.setTeam(this);
        return this;
    }

    public Team removeContacts(Contact contact) {
        this.contacts.remove(contact);
        contact.setTeam(null);
        return this;
    }

    public Set<Tournament> getTournaments() {
        return this.tournaments;
    }

    public void setTournaments(Set<Tournament> tournaments) {
        if (this.tournaments != null) {
            this.tournaments.forEach(i -> i.removeTeams(this));
        }
        if (tournaments != null) {
            tournaments.forEach(i -> i.addTeams(this));
        }
        this.tournaments = tournaments;
    }

    public Team tournaments(Set<Tournament> tournaments) {
        this.setTournaments(tournaments);
        return this;
    }

    public Team addTournaments(Tournament tournament) {
        this.tournaments.add(tournament);
        tournament.getTeams().add(this);
        return this;
    }

    public Team removeTournaments(Tournament tournament) {
        this.tournaments.remove(tournament);
        tournament.getTeams().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Team)) {
            return false;
        }
        return id != null && id.equals(((Team) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Team{" +
            "id=" + getId() +
            ", created='" + getCreated() + "'" +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            ", colour='" + getColour() + "'" +
            ", schedule='" + getSchedule() + "'" +
            ", playType='" + getPlayType() + "'" +
            "}";
    }
}
