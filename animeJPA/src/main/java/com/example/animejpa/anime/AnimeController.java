package com.example.animejpa.anime;

import com.example.animejpa.dto.CharacterRoleDTO;
import com.example.animejpa.dto.PersonPositionDTO;
import com.example.animejpa.dto.VoiceActorDTO;


import org.springframework.beans.factory.annotation.Autowired;
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



    // Endpoint: Search animes
    // GET http://localhost:8080/api/animes/search?title=Naruto
    @GetMapping("/search")
    public List<Anime> searchAnimes(@RequestParam String title) {
        return animeService.searchAnimes(title);
    }

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
    public ResponseEntity<List<Anime>> getTopAnime() {
        return ResponseEntity.ok(animeService.getTopRankedAnime());
    }
}