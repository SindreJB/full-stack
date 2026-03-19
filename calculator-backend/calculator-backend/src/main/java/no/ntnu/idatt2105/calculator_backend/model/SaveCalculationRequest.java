package no.ntnu.idatt2105.calculator_backend.model;

import lombok.Data;

@Data
public class SaveCalculationRequest {
    private String expression;
    private Double result;
}
