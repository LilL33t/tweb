package com.example.animejpa.person;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/people")
public class PersonController {
    @Autowired
    private PersonService service;

    @GetMapping("/{id}")
    public Person getById(@PathVariable Integer id) { return service.getById(id); }

    @GetMapping("/search")
    public List<Person> search(@RequestParam String name) { return service.searchByName(name); }
}