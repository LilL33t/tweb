package com.example.animejpa.person;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/people")
@Tag(name = "Person Controller", description = "Manages details for real people (Voice Actors and Staff members).")
public class PersonController {
    @Autowired
    private PersonService service;


    // --- 1. GET PERSON DETAILS BY ID ---
    @Operation(summary = "Get Person by ID", description = "Retrieves details of a staff member or voice actor.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Person found", content = @Content(schema = @Schema(implementation = Person.class))),
            @ApiResponse(responseCode = "404", description = "Person not found", content = @Content)
    })
    @GetMapping("/{id}")
    public Person getById(
            @Parameter(description = "Unique ID of the person", required = true, example = "65")
            @PathVariable Integer id) { return service.getById(id); }


    // --- 1. GET PERSON BY NAME ---
    @Operation(summary = "Search Person by Name", description = "Searches for voice actors or staff members by name.")
    @ApiResponse(responseCode = "200", description = "List of matching people found")
    @GetMapping("/search")
    public List<Person> search(
            @Parameter(description = "Name (or partial name) to search for", required = true, example = "Miyano")
            @RequestParam String name) { return service.searchByName(name); }
}