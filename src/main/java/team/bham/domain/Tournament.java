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

/**
 * A Tournament.
 */
@Entity
@Table(name = "tournament")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Tournament implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 128)
    @Column(name = "name", length = 128, nullable = false)
    private String name;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private Instant startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private Instant endDate;

    @NotNull
    @Column(name = "location", nullable = false)
    private String location;

    @NotNull
    @Min(value = 4)
    @Max(value = 32)
    @Column(name = "max_teams", nullable = false)
    private Integer maxTeams;

    @OneToMany(mappedBy = "tournament")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "referee", "pitch", "home", "away", "tournament" }, allowSetters = true)
    private Set<Match> matches = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_tournament__teams",
        joinColumns = @JoinColumn(name = "tournament_id"),
        inverseJoinColumns = @JoinColumn(name = "teams_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "owner", "bookings", "availableDates", "members", "contacts", "tournaments" }, allowSetters = true)
    private Set<Team> teams = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Tournament id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Tournament name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getStartDate() {
        return this.startDate;
    }

    public Tournament startDate(Instant startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Instant getEndDate() {
        return this.endDate;
    }

    public Tournament endDate(Instant endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public String getLocation() {
        return this.location;
    }

    public Tournament location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getMaxTeams() {
        return this.maxTeams;
    }

    public Tournament maxTeams(Integer maxTeams) {
        this.setMaxTeams(maxTeams);
        return this;
    }

    public void setMaxTeams(Integer maxTeams) {
        this.maxTeams = maxTeams;
    }

    public Set<Match> getMatches() {
        return this.matches;
    }

    public void setMatches(Set<Match> matches) {
        if (this.matches != null) {
            this.matches.forEach(i -> i.setTournament(null));
        }
        if (matches != null) {
            matches.forEach(i -> i.setTournament(this));
        }
        this.matches = matches;
    }

    public Tournament matches(Set<Match> matches) {
        this.setMatches(matches);
        return this;
    }

    public Tournament addMatches(Match match) {
        this.matches.add(match);
        match.setTournament(this);
        return this;
    }

    public Tournament removeMatches(Match match) {
        this.matches.remove(match);
        match.setTournament(null);
        return this;
    }

    public Set<Team> getTeams() {
        return this.teams;
    }

    public void setTeams(Set<Team> teams) {
        this.teams = teams;
    }

    public Tournament teams(Set<Team> teams) {
        this.setTeams(teams);
        return this;
    }

    public Tournament addTeams(Team team) {
        this.teams.add(team);
        team.getTournaments().add(this);
        return this;
    }

    public Tournament removeTeams(Team team) {
        this.teams.remove(team);
        team.getTournaments().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Tournament)) {
            return false;
        }
        return id != null && id.equals(((Tournament) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Tournament{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", location='" + getLocation() + "'" +
            ", maxTeams=" + getMaxTeams() +
            "}";
    }
}
