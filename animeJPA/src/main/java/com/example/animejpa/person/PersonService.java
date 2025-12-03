package com.example.animejpa.person;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PersonService {
    @Autowired
    private PersonRepository repo;

    public Person getById(Integer id) { return repo.findById(id).orElse(null); }
    public List<Person> searchByName(String name) { return repo.findByNameContainingIgnoreCase(name); }
}