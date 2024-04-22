package team.bham.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class MatchTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Match getMatchSample1() {
        return new Match().id(1L).homeScore(1).awayScore(1);
    }

    public static Match getMatchSample2() {
        return new Match().id(2L).homeScore(2).awayScore(2);
    }

    public static Match getMatchRandomSampleGenerator() {
        return new Match().id(longCount.incrementAndGet()).homeScore(intCount.incrementAndGet()).awayScore(intCount.incrementAndGet());
    }
}
