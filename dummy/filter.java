import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.mock.web.MockHttpServletRequest;

import javax.servlet.FilterChain;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import java.io.IOException;

import static org.mockito.Mockito.*;

class AppCodeFilterTest {

    private AppCodeFilter appCodeFilter;

    @Mock
    private SonarToolsConfig sonarToolsConfig;

    @Mock
    private FilterChain filterChain;

    @Mock
    private ServletResponse response;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        appCodeFilter = new AppCodeFilter();
        appCodeFilter.sonarToolsConfig = sonarToolsConfig; // manually inject mock
    }

    @Test
    void testDoFilter_withAppcodeHeader() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("appcode", "myAppCode");

        appCodeFilter.doFilter(request, response, filterChain);

        verify(sonarToolsConfig).setSonarBasePath("myAppCode");
        verify(filterChain).doFilter(request, response);
        verify(sonarToolsConfig).clear();
    }

    @Test
    void testDoFilter_withoutAppcodeHeader() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest(); // no header

        appCodeFilter.doFilter(request, response, filterChain);

        verify(sonarToolsConfig, never()).setSonarBasePath(any());
        verify(filterChain).doFilter(request, response);
        verify(sonarToolsConfig).clear();
    }
}
