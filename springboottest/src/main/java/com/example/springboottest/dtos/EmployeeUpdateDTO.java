package com.example.springboottest.dtos;
import java.time.LocalDate;

import com.example.springboottest.entities.Gender;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EmployeeUpdateDTO {
    @NotBlank(message = "Full name is required")
    @Size(min = 4, max = 160, message = "Full name must be between 4 and 160 characters")
    private String fullName;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    private Gender gender;

    @NotBlank @Pattern(regexp = "\\d{10}")
    private String phoneNumber;

    private Boolean active;

    private String password;
}