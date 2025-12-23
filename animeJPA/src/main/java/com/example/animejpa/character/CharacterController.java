package com.example.animejpa.character;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/characters")
@Tag(name = "Character Controller", description = "Manages Anime Character details and search operations.")
public class CharacterController {

    @Autowired
    private CharacterService service;


    // --- 1. GET CHARACTER DETAILS ---
    @Operation(summary = "Get Character by ID", description = "Retrieves detailed information (name, biography, image) of a specific character.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Character found", content = @Content(schema = @Schema(implementation = Character.class))),
            @ApiResponse(responseCode = "404", description = "Character not found", content = @Content)
    })
    @GetMapping("/{id}")
    public Character getById(
            @Parameter(description = "Unique ID of the character", required = true, example = "40")
            @PathVariable Integer id) {
        return service.getById(id);
    }

    // --- 2. FIND CHARACTER BY NAME ---
    @Operation(summary = "Search Character by Name", description = "Performs a text-based search for characters matching the provided name.")
    @ApiResponse(responseCode = "200", description = "List of matching characters found")
    @GetMapping("/search")
    public List<Character> search(
            @Parameter(description = "Name (or partial name) to search for", required = true, example = "Luffy")
            @RequestParam String name) {
        return service.searchByName(name);
    }
}