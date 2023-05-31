package com.example.loginTest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@EnableJpaRepositories
public interface LoginRepository extends JpaRepository<LoginEntity, Long> {
    LoginEntity findByKnameAndKemail(String kName, String kEmail);

    LoginEntity save(LoginEntity loginEntity);
}
