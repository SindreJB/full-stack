package no.ntnu.idatt2105.calculator_backend.model;

public class ExpressionRequest {
    private String expression;

    public ExpressionRequest() {
    }

    public ExpressionRequest(String expression) {
        this.expression = expression;
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }
}
