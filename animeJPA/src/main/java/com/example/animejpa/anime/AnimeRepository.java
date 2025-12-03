package com.example.animejpa.anime;

import com.example.animejpa.dto.CharacterRoleDTO;
import com.example.animejpa.dto.PersonPositionDTO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimeRepository extends JpaRepository<Anime, Integer>{

    // Custom Query: Finds animes where the title contains the keyword (Case Insensitive)
    // SQL equivalent: SELECT * FROM details WHERE title LIKE '%keyword%'
    List<Anime> findByTitleContainingIgnoreCase(String title);

    // It joins 'characters' with 'character_anime_works'
    @Query(value = """
        SELECT c.name as name, w.role as role, c.image as imageUrl, c.character_mal_id as id
        FROM characters c
        JOIN character_anime_works w ON c.character_mal_id = w.character_mal_id
        WHERE w.anime_mal_id = :animeId
        ORDER BY w.role ASC
        LIMIT 500
    """, nativeQuery = true)
    List<CharacterRoleDTO> findCharactersByAnimeId(@Param("animeId") Integer animeId);

    // --- NEW NATIVE QUERY ---
    // It joins 'person_details' with 'person_anime_works'
    // 2. Get Staff + Positions
    @Query(value = """
    SELECT 
        p.name AS name,
        w.position AS job,
        p.image_url AS imageUrl,
        p.person_mal_id AS id
    FROM person_details p
    JOIN person_anime_works w 
        ON p.person_mal_id::integer = w.person_mal_id::integer
    WHERE w.anime_mal_id::integer = :animeId
    LIMIT 500
""", nativeQuery = true)
    List<PersonPositionDTO> findStaffByAnimeId(@Param("animeId") Integer animeId);
}