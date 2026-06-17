package com.hotelimperial.backend;

import com.hotelimperial.backend.seeder.DatabaseSeeder;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(properties = "server.port=0")
class BackendApplicationTests {

    @Autowired
    private BackendApplication application;

    @SpyBean
    private DatabaseSeeder seeder;

    @Test
    void contextLoads() {
        assertNotNull(application);
    }

    @Test
    void testSeederDoubleRun() throws Exception {
        seeder.run();
    }

    @Test
    void testMainMethod() {
        BackendApplication.main(new String[]{"--server.port=0"});
    }
}
