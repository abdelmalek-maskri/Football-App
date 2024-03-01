package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class AvailableDateTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AvailableDate.class);
        AvailableDate availableDate1 = new AvailableDate();
        availableDate1.setId(1L);
        AvailableDate availableDate2 = new AvailableDate();
        availableDate2.setId(availableDate1.getId());
        assertThat(availableDate1).isEqualTo(availableDate2);
        availableDate2.setId(2L);
        assertThat(availableDate1).isNotEqualTo(availableDate2);
        availableDate1.setId(null);
        assertThat(availableDate1).isNotEqualTo(availableDate2);
    }
}
