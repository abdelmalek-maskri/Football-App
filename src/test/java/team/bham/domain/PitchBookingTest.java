package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class PitchBookingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PitchBooking.class);
        PitchBooking pitchBooking1 = new PitchBooking();
        pitchBooking1.setId(1L);
        PitchBooking pitchBooking2 = new PitchBooking();
        pitchBooking2.setId(pitchBooking1.getId());
        assertThat(pitchBooking1).isEqualTo(pitchBooking2);
        pitchBooking2.setId(2L);
        assertThat(pitchBooking1).isNotEqualTo(pitchBooking2);
        pitchBooking1.setId(null);
        assertThat(pitchBooking1).isNotEqualTo(pitchBooking2);
    }
}
