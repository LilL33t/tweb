package com.example.animejpa.character;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/characters")
public class CharacterController {

    @Autowired
    private CharacterService service;

    @GetMapping("/{id}")
    public Character getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @GetMapping("/search")
    public List<Character> search(@RequestParam String name) {
        return service.searchByName(name);
    }
}