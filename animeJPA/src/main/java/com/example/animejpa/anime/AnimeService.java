package com.example.animejpa.anime;

import com.example.animejpa.dto.CharacterRoleDTO;
import com.example.animejpa.dto.PersonPositionDTO;
import com.example.animejpa.dto.VoiceActorDTO;

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


    public List<Anime> getTopRankedAnime() {
        return animeRepository.findTopRanked();
    }

}
