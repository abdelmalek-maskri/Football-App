package team.bham.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class PitchBookingTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static PitchBooking getPitchBookingSample1() {
        return new PitchBooking().id(1L);
    }

    public static PitchBooking getPitchBookingSample2() {
        return new PitchBooking().id(2L);
    }

    public static PitchBooking getPitchBookingRandomSampleGenerator() {
        return new PitchBooking().id(longCount.incrementAndGet());
    }
}
