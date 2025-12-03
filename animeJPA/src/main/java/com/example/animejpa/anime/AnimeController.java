package com.example.animejpa.anime;

import org.springframework.beans.factory.annotation.Autowired;
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
}