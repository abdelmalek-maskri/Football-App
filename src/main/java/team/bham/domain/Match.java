package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Match.
 */
@Entity
@Table(name = "match")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Match implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Min(value = 0)
    @Column(name = "home_score")
    private Integer homeScore;

    @Min(value = 0)
    @Column(name = "away_score")
    private Integer awayScore;

    @NotNull
    @Column(name = "date", nullable = false)
    private Instant date;

    @JsonIgnoreProperties(value = { "contacts", "availableDates", "teamOwned", "team" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private UserProfile referee;

    @JsonIgnoreProperties(value = { "pitchBookings" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Pitch pitch;

    @JsonIgnoreProperties(value = { "owner", "bookings", "availableDates", "contacts", "tournaments" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Team home;

    @JsonIgnoreProperties(value = { "owner", "bookings", "availableDates", "contacts", "tournaments" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Team away;

    @ManyToOne
    @JsonIgnoreProperties(value = { "matches", "teams" }, allowSetters = true)
    private Tournament tournament;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Match id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getHomeScore() {
        return this.homeScore;
    }

    public Match homeScore(Integer homeScore) {
        this.setHomeScore(homeScore);
        return this;
    }

    public void setHomeScore(Integer homeScore) {
        this.homeScore = homeScore;
    }

    public Integer getAwayScore() {
        return this.awayScore;
    }

    public Match awayScore(Integer awayScore) {
        this.setAwayScore(awayScore);
        return this;
    }

    public void setAwayScore(Integer awayScore) {
        this.awayScore = awayScore;
    }

    public Instant getDate() {
        return this.date;
    }

    public Match date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public UserProfile getReferee() {
        return this.referee;
    }

    public void setReferee(UserProfile userProfile) {
        this.referee = userProfile;
    }

    public Match referee(UserProfile userProfile) {
        this.setReferee(userProfile);
        return this;
    }

    public Pitch getPitch() {
        return this.pitch;
    }

    public void setPitch(Pitch pitch) {
        this.pitch = pitch;
    }

    public Match pitch(Pitch pitch) {
        this.setPitch(pitch);
        return this;
    }

    public Team getHome() {
        return this.home;
    }

    public void setHome(Team team) {
        this.home = team;
    }

    public Match home(Team team) {
        this.setHome(team);
        return this;
    }

    public Team getAway() {
        return this.away;
    }

    public void setAway(Team team) {
        this.away = team;
    }

    public Match away(Team team) {
        this.setAway(team);
        return this;
    }

    public Tournament getTournament() {
        return this.tournament;
    }

    public void setTournament(Tournament tournament) {
        this.tournament = tournament;
    }

    public Match tournament(Tournament tournament) {
        this.setTournament(tournament);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Match)) {
            return false;
        }
        return id != null && id.equals(((Match) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Match{" +
            "id=" + getId() +
            ", homeScore=" + getHomeScore() +
            ", awayScore=" + getAwayScore() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
