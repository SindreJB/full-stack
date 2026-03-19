package no.ntnu.idatt2105.calculator_backend.controller;

import no.ntnu.idatt2105.calculator_backend.model.CalculationDto;
import no.ntnu.idatt2105.calculator_backend.model.SaveCalculationRequest;
import no.ntnu.idatt2105.calculator_backend.service.CalculationService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calculations")
public class CalculationController {

    private final CalculationService calculationService;

    public CalculationController(CalculationService calculationService) {
        this.calculationService = calculationService;
    }

    @PostMapping
    public ResponseEntity<CalculationDto> save(@RequestBody SaveCalculationRequest request,
                                               Authentication authentication) {
        CalculationDto saved = calculationService.save(
                authentication.getName(),
                request.getExpression(),
                request.getResult());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<Page<CalculationDto>> getCalculations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        return ResponseEntity.ok(
                calculationService.getCalculations(authentication.getName(), page, size));
    }
}
