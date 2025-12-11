package com.example.animejpa.anime;

import com.example.animejpa.dto.CharacterRoleDTO;
import com.example.animejpa.dto.PersonPositionDTO;
import com.example.animejpa.dto.VoiceActorDTO;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animes")
public class AnimeController {

    @Autowired
    private AnimeService animeService;

    // Endpoint: Get specific anime
    // GET http://localhost:8080/api/animes/1
    @GetMapping("/{id}")
    public Anime getAnimeById(@PathVariable Integer id) {
        return animeService.getAnimeById(id);
    }


/*
    // Endpoint: Search animes
    // GET http://localhost:8080/api/animes/search?title=Naruto
    @GetMapping("/search")
    public List<Anime> searchAnimes(@RequestParam String title) {
        return animeService.searchAnimes(title);
    }

 */

    // GET /api/animes/1/characters
    @GetMapping("/{id}/characters")
    public List<CharacterRoleDTO> getCharacters(@PathVariable Integer id) {
        return animeService.getCharacters(id);
    }

    // GET /api/animes/1/staff
    @GetMapping("/{id}/staff")
    public List<PersonPositionDTO> getStaff(@PathVariable Integer id) {
        return animeService.getStaff(id);
    }

    // GET /api/animes/1/voices
    @GetMapping("/{id}/voices")
    public List<VoiceActorDTO> getVoiceActors(@PathVariable Integer id) {
        return animeService.getVoiceActors(id);
    }

    // GET http://localhost:8080/api/animes/top
    @GetMapping("/top")
    public ResponseEntity<List<Anime>> getTopAnime(@RequestParam(defaultValue = "1") int page) {

        // CLEAN: Just call the service with the raw page number
        List<Anime> animes = animeService.getTopAnimes(page);

        return ResponseEntity.ok(animes);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Anime>> searchAnimes(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) Double minScore,
            @RequestParam(required = false) String rating,
            @RequestParam(defaultValue = "1") int page
    ) {
        List<Anime> results = animeService.searchAnimeWithFilters(title, genre, minScore, rating, page);
        return ResponseEntity.ok(results);
    }
}