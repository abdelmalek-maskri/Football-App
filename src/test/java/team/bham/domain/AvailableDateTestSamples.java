package team.bham.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class AvailableDateTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static AvailableDate getAvailableDateSample1() {
        return new AvailableDate().id(1L);
    }

    public static AvailableDate getAvailableDateSample2() {
        return new AvailableDate().id(2L);
    }

    public static AvailableDate getAvailableDateRandomSampleGenerator() {
        return new AvailableDate().id(longCount.incrementAndGet());
    }
}
