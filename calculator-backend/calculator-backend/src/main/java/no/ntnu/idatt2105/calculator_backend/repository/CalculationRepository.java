package no.ntnu.idatt2105.calculator_backend.repository;

import no.ntnu.idatt2105.calculator_backend.entity.AppUser;
import no.ntnu.idatt2105.calculator_backend.entity.Calculation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CalculationRepository extends JpaRepository<Calculation, Long> {
    Page<Calculation> findByUserOrderByCreatedAtDesc(AppUser user, Pageable pageable);
}
