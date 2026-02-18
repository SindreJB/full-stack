package no.ntnu.idatt2105.calculator_backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import no.ntnu.idatt2105.calculator_backend.model.CalculationResponse;
import no.ntnu.idatt2105.calculator_backend.model.ErrorResponse;
import no.ntnu.idatt2105.calculator_backend.model.ExpressionRequest;
import no.ntnu.idatt2105.calculator_backend.service.ExpressionCalculatorService;

@RestController
@RequestMapping("/api/calculator")
public class ExpressionCalculatorController {

    private static final Logger logger = LoggerFactory.getLogger(ExpressionCalculatorController.class);

    private final ExpressionCalculatorService calculatorService;

    public ExpressionCalculatorController(ExpressionCalculatorService calculatorService) {
        this.calculatorService = calculatorService;
    }

    @PostMapping("/evaluate")
    public CalculationResponse evaluate(@RequestBody ExpressionRequest request) {
        logger.info("Expression request: {}", request.getExpression());
        double result = calculatorService.evaluate(request.getExpression());
        return new CalculationResponse(result);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        logger.warn("Invalid expression: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(new ErrorResponse(ex.getMessage()));
    }
}
