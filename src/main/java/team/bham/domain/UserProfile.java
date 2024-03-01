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
import team.bham.domain.enumeration.Genders;
import team.bham.domain.enumeration.Positions;

/**
 * A UserProfile.
 */
@Entity
@Table(name = "user_profile")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserProfile implements Serializable {

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
    @Size(max = 32)
    @Column(name = "name", length = 32, nullable = false)
    private String name;

    @Lob
    @Column(name = "profile_pic")
    private byte[] profilePic;

    @Column(name = "profile_pic_content_type")
    private String profilePicContentType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Genders gender;

    @Column(name = "location")
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "position")
    private Positions position;

    @NotNull
    @Column(name = "referee", nullable = false)
    private Boolean referee;

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile", "team" }, allowSetters = true)
    private Set<Contact> contacts = new HashSet<>();

    @OneToMany(mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile", "team" }, allowSetters = true)
    private Set<AvailableDate> availableDates = new HashSet<>();

    @JsonIgnoreProperties(value = { "owner", "bookings", "availableDates", "members", "contacts", "tournaments" }, allowSetters = true)
    @OneToOne(mappedBy = "owner")
    private Team teamOwned;

    @ManyToOne
    @JsonIgnoreProperties(value = { "owner", "bookings", "availableDates", "members", "contacts", "tournaments" }, allowSetters = true)
    private Team team;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserProfile id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getCreated() {
        return this.created;
    }

    public UserProfile created(Instant created) {
        this.setCreated(created);
        return this;
    }

    public void setCreated(Instant created) {
        this.created = created;
    }

    public String getName() {
        return this.name;
    }

    public UserProfile name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getProfilePic() {
        return this.profilePic;
    }

    public UserProfile profilePic(byte[] profilePic) {
        this.setProfilePic(profilePic);
        return this;
    }

    public void setProfilePic(byte[] profilePic) {
        this.profilePic = profilePic;
    }

    public String getProfilePicContentType() {
        return this.profilePicContentType;
    }

    public UserProfile profilePicContentType(String profilePicContentType) {
        this.profilePicContentType = profilePicContentType;
        return this;
    }

    public void setProfilePicContentType(String profilePicContentType) {
        this.profilePicContentType = profilePicContentType;
    }

    public Genders getGender() {
        return this.gender;
    }

    public UserProfile gender(Genders gender) {
        this.setGender(gender);
        return this;
    }

    public void setGender(Genders gender) {
        this.gender = gender;
    }

    public String getLocation() {
        return this.location;
    }

    public UserProfile location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Positions getPosition() {
        return this.position;
    }

    public UserProfile position(Positions position) {
        this.setPosition(position);
        return this;
    }

    public void setPosition(Positions position) {
        this.position = position;
    }

    public Boolean getReferee() {
        return this.referee;
    }

    public UserProfile referee(Boolean referee) {
        this.setReferee(referee);
        return this;
    }

    public void setReferee(Boolean referee) {
        this.referee = referee;
    }

    public Set<Contact> getContacts() {
        return this.contacts;
    }

    public void setContacts(Set<Contact> contacts) {
        if (this.contacts != null) {
            this.contacts.forEach(i -> i.setUserProfile(null));
        }
        if (contacts != null) {
            contacts.forEach(i -> i.setUserProfile(this));
        }
        this.contacts = contacts;
    }

    public UserProfile contacts(Set<Contact> contacts) {
        this.setContacts(contacts);
        return this;
    }

    public UserProfile addContacts(Contact contact) {
        this.contacts.add(contact);
        contact.setUserProfile(this);
        return this;
    }

    public UserProfile removeContacts(Contact contact) {
        this.contacts.remove(contact);
        contact.setUserProfile(null);
        return this;
    }

    public Set<AvailableDate> getAvailableDates() {
        return this.availableDates;
    }

    public void setAvailableDates(Set<AvailableDate> availableDates) {
        if (this.availableDates != null) {
            this.availableDates.forEach(i -> i.setUserProfile(null));
        }
        if (availableDates != null) {
            availableDates.forEach(i -> i.setUserProfile(this));
        }
        this.availableDates = availableDates;
    }

    public UserProfile availableDates(Set<AvailableDate> availableDates) {
        this.setAvailableDates(availableDates);
        return this;
    }

    public UserProfile addAvailableDates(AvailableDate availableDate) {
        this.availableDates.add(availableDate);
        availableDate.setUserProfile(this);
        return this;
    }

    public UserProfile removeAvailableDates(AvailableDate availableDate) {
        this.availableDates.remove(availableDate);
        availableDate.setUserProfile(null);
        return this;
    }

    public Team getTeamOwned() {
        return this.teamOwned;
    }

    public void setTeamOwned(Team team) {
        if (this.teamOwned != null) {
            this.teamOwned.setOwner(null);
        }
        if (team != null) {
            team.setOwner(this);
        }
        this.teamOwned = team;
    }

    public UserProfile teamOwned(Team team) {
        this.setTeamOwned(team);
        return this;
    }

    public Team getTeam() {
        return this.team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public UserProfile team(Team team) {
        this.setTeam(team);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserProfile)) {
            return false;
        }
        return id != null && id.equals(((UserProfile) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserProfile{" +
            "id=" + getId() +
            ", created='" + getCreated() + "'" +
            ", name='" + getName() + "'" +
            ", profilePic='" + getProfilePic() + "'" +
            ", profilePicContentType='" + getProfilePicContentType() + "'" +
            ", gender='" + getGender() + "'" +
            ", location='" + getLocation() + "'" +
            ", position='" + getPosition() + "'" +
            ", referee='" + getReferee() + "'" +
            "}";
    }
}
