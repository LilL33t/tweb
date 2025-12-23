package com.example.animejpa.anime;

import com.example.animejpa.dto.CharacterRoleDTO;
import com.example.animejpa.dto.PersonPositionDTO;
import com.example.animejpa.dto.VoiceActorDTO;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/animes")
@Tag(name = "Anime Controller", description = "Manages Anime details, rankings, staff, characters, and advanced search operations.")
public class AnimeController {

    @Autowired
    private AnimeService animeService;

    // Endpoint: Get specific anime
    // GET http://localhost:8080/api/animes/1
    // --- 1. GET ANIME DETAILS ---
    @Operation(summary = "Get Anime by ID", description = "Retrieves full details of a specific anime using its unique MAL ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Anime found and returned successfully",
                    content = @Content(schema = @Schema(implementation = Anime.class))),
            @ApiResponse(responseCode = "404", description = "Anime not found with the provided ID", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content)
    })
    @GetMapping("/{id}")
    public Anime getAnimeById(
            @Parameter(description = "The unique MAL ID of the anime", required = true, example = "21")
            @PathVariable Integer id) {
        return animeService.getAnimeById(id);
    }


    // --- 2. GET CHARACTERS ---
    @Operation(summary = "Get Anime Characters", description = "Retrieves a list of characters appearing in the specified anime, including their role (Main/Supporting).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of characters retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Anime ID not found", content = @Content)
    })
    // GET /api/animes/1/characters
    @GetMapping("/{id}/characters")
    public List<CharacterRoleDTO> getCharacters(
            @Parameter(description = "ID of the anime", required = true, example = "21")
            @PathVariable Integer id) {
        return animeService.getCharacters(id);
    }

    // --- 3. GET STAFF ---
    @Operation(summary = "Get Anime Staff", description = "Retrieves the production staff (Directors, Producers, etc.) for a specific anime.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of staff members retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Anime ID not found", content = @Content)
    })
    // GET /api/animes/1/staff
    @GetMapping("/{id}/staff")
    public List<PersonPositionDTO> getStaff(
            @Parameter(description = "ID of the anime", required = true, example = "21")
            @PathVariable Integer id) {
        return animeService.getStaff(id);
    }

    // --- 4. GET VOICE ACTORS ---
    @Operation(summary = "Get Voice Actors", description = "Retrieves voice actors for the anime, grouped by character and language.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of voice actors retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Anime ID not found", content = @Content)
    })
    // GET /api/animes/1/voices
    @GetMapping("/{id}/voices")
    public List<VoiceActorDTO> getVoiceActors(
            @Parameter(description = "ID of the anime", required = true, example = "21")
            @PathVariable Integer id) {
        return animeService.getVoiceActors(id);
    }


    // --- 5. GET TOP ANIME ---
    @Operation(summary = "Get Top Ranked Anime", description = "Retrieves a paginated list of anime sorted by score (highest to lowest).")
    @ApiResponse(responseCode = "200", description = "List of top anime retrieved successfully")
    // GET http://localhost:8080/api/animes/top
    @GetMapping("/top")
    public ResponseEntity<List<Anime>> getTopAnime(
            @Parameter(description = "Page number for pagination (starts at 1)", example = "1")
            @RequestParam(defaultValue = "1") int page) {

        // CLEAN: Just call the service with the raw page number
        List<Anime> animes = animeService.getTopAnimes(page);

        return ResponseEntity.ok(animes);
    }

    // --- 6. SEARCH WITH FILTERS ---
    @Operation(summary = "Advanced Anime Search", description = "Searches for anime based on multiple optional filters like title, genre, score, and rating.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Search results returned successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid parameters provided", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content)
    })
    @GetMapping("/search")
    public ResponseEntity<List<Anime>> searchAnimes(
            @Parameter(description = "Partial or full title of the anime", example = "One Piece")
            @RequestParam(required = false) String title,

            @Parameter(description = "Specific genre to filter by", example = "Action")
            @RequestParam(required = false) String genre,

            @Parameter(description = "Minimum score threshold (0-10)", example = "8.0")
            @RequestParam(required = false) Double minScore,

            @Parameter(description = "Age rating (e.g., PG-13, R-17+)", example = "PG-13")
            @RequestParam(required = false) String rating,

            @Parameter(description = "Page number for pagination", example = "1")
            @RequestParam(defaultValue = "1") int page
    ) {
        List<Anime> results = animeService.searchAnimeWithFilters(title, genre, minScore, rating, page);
        return ResponseEntity.ok(results);
    }


    // --- 7. GET LIST OF ANIMES ---
    @Operation(summary = "Get Anime Batch", description = "Retrieves details for a list of specific Anime IDs. Used for recommendations and favorites.")
    // GET /api/animes/batch?ids=317,55,101
    @GetMapping("/batch")
    public ResponseEntity<List<Anime>> getAnimesBatch(
            @Parameter(description = "Comma-separated list of Anime IDs", required = true, example = "1,55,317")
            @RequestParam List<Integer> ids) {
        List<Anime> animes = animeService.getAnimesByIdList(ids);
        return ResponseEntity.ok(animes);
    }
}