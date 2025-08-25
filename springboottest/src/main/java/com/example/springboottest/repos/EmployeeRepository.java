package com.example.springboottest.repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springboottest.entities.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
}
