package team.bham.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PitchTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Pitch getPitchSample1() {
        return new Pitch().id(1L).name("name1").location("location1");
    }

    public static Pitch getPitchSample2() {
        return new Pitch().id(2L).name("name2").location("location2");
    }

    public static Pitch getPitchRandomSampleGenerator() {
        return new Pitch().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString()).location(UUID.randomUUID().toString());
    }
}
