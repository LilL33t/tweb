package com.example.animejpa.character;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CharacterRepository extends JpaRepository<Character, Integer> {
    // Custom search by name
    List<Character> findByNameContainingIgnoreCase(String name);
}