package no.ntnu.idatt2105.calculator_backend.service;

import no.ntnu.idatt2105.calculator_backend.entity.AppUser;
import no.ntnu.idatt2105.calculator_backend.entity.Calculation;
import no.ntnu.idatt2105.calculator_backend.model.CalculationDto;
import no.ntnu.idatt2105.calculator_backend.repository.AppUserRepository;
import no.ntnu.idatt2105.calculator_backend.repository.CalculationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CalculationService {

    private final CalculationRepository calculationRepository;
    private final AppUserRepository userRepository;

    public CalculationService(CalculationRepository calculationRepository,
                              AppUserRepository userRepository) {
        this.calculationRepository = calculationRepository;
        this.userRepository = userRepository;
    }

    public CalculationDto save(String username, String expression, double result) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        Calculation calc = new Calculation();
        calc.setExpression(expression);
        calc.setResult(result);
        calc.setCreatedAt(LocalDateTime.now());
        calc.setUser(user);
        Calculation saved = calculationRepository.save(calc);
        return toDto(saved);
    }

    public Page<CalculationDto> getCalculations(String username, int page, int size) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        return calculationRepository
                .findByUserOrderByCreatedAtDesc(user, PageRequest.of(page, size))
                .map(this::toDto);
    }

    private CalculationDto toDto(Calculation calc) {
        return new CalculationDto(
                calc.getId(),
                calc.getExpression(),
                calc.getResult(),
                calc.getCreatedAt());
    }
}
