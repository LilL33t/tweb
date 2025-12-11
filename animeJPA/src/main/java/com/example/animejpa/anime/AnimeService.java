package com.example.animejpa.anime;

import com.example.animejpa.dto.CharacterRoleDTO;
import com.example.animejpa.dto.PersonPositionDTO;
import com.example.animejpa.dto.VoiceActorDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public Anime getAnimeById(Integer id){
        Optional<Anime> result = animeRepository.findById(id);
        return result.orElse(null);
    }

    /**
     * Search for animes by title.
     * Returns a list of matches.
     */
    public List<Anime> searchAnimes(String title){
        return animeRepository.findByTitleContainingIgnoreCase(title);
    }


    public List<CharacterRoleDTO> getCharacters(Integer id){
        return animeRepository.findCharactersByAnimeId(id);
    }

    public List<PersonPositionDTO> getStaff(Integer id){
        return animeRepository.findStaffByAnimeId(id);
    }

    public List<VoiceActorDTO> getVoiceActors(Integer id){
        return animeRepository.findVoiceActorsByAnimeId(id);
    }


    public List<Anime> getTopAnimes(int page) {
        // The Service decides the page size and sorting logic
        int pageSize = 12; // Matches your frontend grid

        // Handle 0-based index (Frontend sends 1, Spring wants 0)
        int pageNumber = (page > 0) ? page - 1 : 0;

        // Create the Pageable object here
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("score").descending());

        // Call Repository
        return animeRepository.findTopRanked(pageable);
    }

    public List<Anime> searchAnimeWithFilters(String title, String genre, Double minScore, String rating, int page) {

        // 1. Clean String inputs
        String cleanTitle = (title != null && !title.isBlank()) ? title : null;
        String cleanGenre = (genre != null && !genre.isBlank()) ? genre : null;
        String cleanRating = (rating != null && !rating.isBlank()) ? rating : null;

        // 2. Setup Pagination (12 items per page, sorted by Score)
        int pageNumber = (page > 0) ? page - 1 : 0; // Handle 1-based index
        Pageable pageable = PageRequest.of(pageNumber, 12, Sort.by("score").descending());

        // 3. Call Repository
        // Now this returns a 'Page<Anime>', so .getContent() is valid!
        return animeRepository.searchAnimeComplex(cleanTitle, cleanGenre, minScore, cleanRating, pageable).getContent();
    }

    public List<Anime> getAnimesByIdList(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of(); // Return empty list if no IDs provided
        }
        return animeRepository.findBatchByIds(ids);
    }
}
