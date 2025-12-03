package com.example.animejpa.character;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CharacterService {

    @Autowired
    private CharacterRepository repo;

    public Character getById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public List<Character> searchByName(String name) {
        return repo.findByNameContainingIgnoreCase(name);
    }
}