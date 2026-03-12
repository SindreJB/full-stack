package no.ntnu.idatt2105.calculator_backend.model;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
}
