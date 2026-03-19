package no.ntnu.idatt2105.calculator_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CalculationDto {
    private Long id;
    private String expression;
    private Double result;
    private LocalDateTime createdAt;
}
