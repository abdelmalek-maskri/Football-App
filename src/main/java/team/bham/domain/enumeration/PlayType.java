package team.bham.domain.enumeration;

/**
 * The PlayType enumeration.
 */
public enum PlayType {
    SOCIAL("Social"),
    COMPETITIVE("Competitive");

    private final String value;

    PlayType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
