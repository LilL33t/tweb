package com.example.animejpa.anime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnimeService {

    @Autowired

    private AnimeRepository animeRepository;

    /**
     * Fetch a single Anime by its MAL ID.
     * Returns null if not found (you could also throw an exception here).
     */
    public Anime getAnimeById(Integer id) {
        Optional<Anime> result = animeRepository.findById(id);
        return result.orElse(null);
    }

    /**
     * Search for animes by title.
     * Returns a list of matches.
     */
    public List<Anime> searchAnimes(String title) {
        return animeRepository.findByTitleContainingIgnoreCase(title);
    }
}