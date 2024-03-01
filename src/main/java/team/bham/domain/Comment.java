package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Comment.
 */
@Entity
@Table(name = "comment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Comment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Min(value = 0)
    @Max(value = 5)
    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Size(max = 256)
    @Column(name = "content", length = 256)
    private String content;

    @Min(value = 0)
    @Column(name = "like_count")
    private Integer likeCount;

    @JsonIgnoreProperties(value = { "replyingTo", "author", "targetUser", "match" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Comment replyingTo;

    @JsonIgnoreProperties(value = { "contacts", "availableDates", "teamOwned", "team" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private UserProfile author;

    @JsonIgnoreProperties(value = { "contacts", "availableDates", "teamOwned", "team" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private UserProfile targetUser;

    @JsonIgnoreProperties(value = { "referee", "pitch", "home", "away", "tournament" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Match match;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Comment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRating() {
        return this.rating;
    }

    public Comment rating(Integer rating) {
        this.setRating(rating);
        return this;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getContent() {
        return this.content;
    }

    public Comment content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getLikeCount() {
        return this.likeCount;
    }

    public Comment likeCount(Integer likeCount) {
        this.setLikeCount(likeCount);
        return this;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    public Comment getReplyingTo() {
        return this.replyingTo;
    }

    public void setReplyingTo(Comment comment) {
        this.replyingTo = comment;
    }

    public Comment replyingTo(Comment comment) {
        this.setReplyingTo(comment);
        return this;
    }

    public UserProfile getAuthor() {
        return this.author;
    }

    public void setAuthor(UserProfile userProfile) {
        this.author = userProfile;
    }

    public Comment author(UserProfile userProfile) {
        this.setAuthor(userProfile);
        return this;
    }

    public UserProfile getTargetUser() {
        return this.targetUser;
    }

    public void setTargetUser(UserProfile userProfile) {
        this.targetUser = userProfile;
    }

    public Comment targetUser(UserProfile userProfile) {
        this.setTargetUser(userProfile);
        return this;
    }

    public Match getMatch() {
        return this.match;
    }

    public void setMatch(Match match) {
        this.match = match;
    }

    public Comment match(Match match) {
        this.setMatch(match);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Comment)) {
            return false;
        }
        return id != null && id.equals(((Comment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Comment{" +
            "id=" + getId() +
            ", rating=" + getRating() +
            ", content='" + getContent() + "'" +
            ", likeCount=" + getLikeCount() +
            "}";
    }
}
