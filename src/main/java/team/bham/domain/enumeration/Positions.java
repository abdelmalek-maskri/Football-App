package team.bham.domain.enumeration;

/**
 * The Positions enumeration.
 */
public enum Positions {
    GK("Goalkeeper"),
    LB("LeftBack"),
    CB("CentreBack"),
    RB("RightBack"),
    DM("DefenceMid"),
    CM("CentreMid"),
    AM("AttackMid"),
    LM("LeftMid"),
    RM("RightMid"),
    ST("Striker"),
    LW("LeftWing"),
    RW("RightWing");

    private final String value;

    Positions(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
