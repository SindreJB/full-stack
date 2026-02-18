package no.ntnu.idatt2105.calculator_backend.service;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ExpressionCalculatorService {

    public double evaluate(String expression) {
        if (expression == null || expression.trim().isEmpty()) {
            throw new IllegalArgumentException("Expression is empty.");
        }

        List<String> tokens = tokenize(expression);
        List<String> rpn = toRpn(tokens);
        return evalRpn(rpn);
    }

    private List<String> tokenize(String expression) {
        List<String> tokens = new ArrayList<>();
        int i = 0;
        TokenType lastTokenType = TokenType.NONE;

        while (i < expression.length()) {
            char ch = expression.charAt(i);

            if (Character.isWhitespace(ch)) {
                i++;
                continue;
            }

            if (isOperator(ch)) {
                if (ch == '-' && isUnary(lastTokenType)) {
                    int nextIndex = skipWhitespace(expression, i + 1);
                    if (nextIndex < expression.length() && expression.charAt(nextIndex) == '(') {
                        tokens.add("0");
                        tokens.add("-");
                        lastTokenType = TokenType.OPERATOR;
                        i++;
                        continue;
                    }

                    String number = parseNumber(expression, i);
                    tokens.add(number);
                    i += number.length();
                    lastTokenType = TokenType.NUMBER;
                    continue;
                }

                tokens.add(String.valueOf(ch));
                i++;
                lastTokenType = TokenType.OPERATOR;
                continue;
            }

            if (ch == '(') {
                tokens.add("(");
                i++;
                lastTokenType = TokenType.LEFT_PAREN;
                continue;
            }

            if (ch == ')') {
                tokens.add(")");
                i++;
                lastTokenType = TokenType.RIGHT_PAREN;
                continue;
            }

            if (Character.isDigit(ch) || ch == '.') {
                String number = parseNumber(expression, i);
                tokens.add(number);
                i += number.length();
                lastTokenType = TokenType.NUMBER;
                continue;
            }

            throw new IllegalArgumentException("Invalid character: " + ch);
        }

        return tokens;
    }

    private String parseNumber(String expression, int startIndex) {
        StringBuilder sb = new StringBuilder();
        int i = startIndex;
        boolean hasDot = false;

        if (expression.charAt(i) == '-') {
            sb.append('-');
            i++;
        }

        while (i < expression.length()) {
            char ch = expression.charAt(i);
            if (Character.isDigit(ch)) {
                sb.append(ch);
                i++;
                continue;
            }
            if (ch == '.') {
                if (hasDot) {
                    throw new IllegalArgumentException("Invalid number format.");
                }
                hasDot = true;
                sb.append(ch);
                i++;
                continue;
            }
            break;
        }

        String number = sb.toString();
        if (number.equals("-") || number.equals(".")) {
            throw new IllegalArgumentException("Invalid number format.");
        }

        return number;
    }

    private List<String> toRpn(List<String> tokens) {
        List<String> output = new ArrayList<>();
        Deque<String> operators = new ArrayDeque<>();

        for (String token : tokens) {
            if (isNumber(token)) {
                output.add(token);
                continue;
            }

            if ("(".equals(token)) {
                operators.push(token);
                continue;
            }

            if (")".equals(token)) {
                while (!operators.isEmpty() && !"(".equals(operators.peek())) {
                    output.add(operators.pop());
                }
                if (operators.isEmpty() || !"(".equals(operators.pop())) {
                    throw new IllegalArgumentException("Mismatched parentheses.");
                }
                continue;
            }

            if (token.length() == 1 && isOperator(token.charAt(0))) {
                while (!operators.isEmpty()
                        && isOperator(operators.peek().charAt(0))
                        && precedence(operators.peek()) >= precedence(token)) {
                    output.add(operators.pop());
                }
                operators.push(token);
                continue;
            }

            throw new IllegalArgumentException("Invalid token: " + token);
        }

        while (!operators.isEmpty()) {
            String op = operators.pop();
            if ("(".equals(op) || ")".equals(op)) {
                throw new IllegalArgumentException("Mismatched parentheses.");
            }
            output.add(op);
        }

        return output;
    }

    private double evalRpn(List<String> rpn) {
        Deque<Double> stack = new ArrayDeque<>();

        for (String token : rpn) {
            if (isNumber(token)) {
                stack.push(Double.parseDouble(token));
                continue;
            }

            if (stack.size() < 2) {
                throw new IllegalArgumentException("Invalid expression.");
            }

            double b = stack.pop();
            double a = stack.pop();
            double result;

            switch (token) {
                case "+":
                    result = a + b;
                    break;
                case "-":
                    result = a - b;
                    break;
                case "*":
                    result = a * b;
                    break;
                case "/":
                    if (b == 0) {
                        throw new IllegalArgumentException("Division by zero.");
                    }
                    result = a / b;
                    break;
                default:
                    throw new IllegalArgumentException("Invalid operator: " + token);
            }

            stack.push(result);
        }

        if (stack.size() != 1) {
            throw new IllegalArgumentException("Invalid expression.");
        }

        return stack.pop();
    }

    private boolean isOperator(char ch) {
        return ch == '+' || ch == '-' || ch == '*' || ch == '/';
    }

    private boolean isNumber(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }
        try {
            Double.parseDouble(token);
            return true;
        } catch (NumberFormatException ex) {
            return false;
        }
    }

    private int precedence(String operator) {
        if ("*".equals(operator) || "/".equals(operator)) {
            return 2;
        }
        return 1;
    }

    private boolean isUnary(TokenType lastTokenType) {
        return lastTokenType == TokenType.NONE
                || lastTokenType == TokenType.OPERATOR
                || lastTokenType == TokenType.LEFT_PAREN;
    }

    private int skipWhitespace(String expression, int index) {
        int i = index;
        while (i < expression.length() && Character.isWhitespace(expression.charAt(i))) {
            i++;
        }
        return i;
    }

    private enum TokenType {
        NONE,
        NUMBER,
        OPERATOR,
        LEFT_PAREN,
        RIGHT_PAREN
    }
}
