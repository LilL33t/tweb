package com.example.animejpa.anime;

import com.example.animejpa.dto.CharacterRoleDTO;
import com.example.animejpa.dto.PersonPositionDTO;
import com.example.animejpa.dto.VoiceActorDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        p.person_mal_id AS id,
        p.birthday as birthday,
        p.favorites as memberFavorites,
        p.website_url as websiteUrl,
        p.relevant_location as relevantLocation
    FROM person_details p
    JOIN person_anime_works w 
        ON p.person_mal_id::integer = w.person_mal_id::integer
    WHERE w.anime_mal_id::integer = :animeId
""", nativeQuery = true)
    List<PersonPositionDTO> findStaffByAnimeId(@Param("animeId") Integer animeId);

    // 3. Get Voice Actors (Clean version without comments)
    @Query(value = """
    SELECT c.name as characterName, 
           p.name as personName, 
           v.language as language, 
           p.image_url as imageUrl,
           p.birthday as birthday,
           p.favorites as memberFavorites,
           p.website_url as websiteUrl,
           p.relevant_location as relevantLocation

    FROM person_voice_works v
    JOIN person_details p ON v.person_mal_id::integer = p.person_mal_id::integer
    JOIN characters c ON v.character_mal_id::integer = c.character_mal_id::integer
    WHERE v.anime_mal_id::integer = :animeId
""", nativeQuery = true)
    List<VoiceActorDTO> findVoiceActorsByAnimeId(@Param("animeId") Integer animeId);



    //OLD NOT WORKING METHOD:
    // FETCHES: The top 12 anime, ordered by score (Highest first)
    // @Query(value = "SELECT * FROM details WHERE score IS NOT NULL ORDER BY score DESC LIMIT 250", nativeQuery = true)
    // List<Anime> findTopRanked();

    // NEW WORKING METHOD:
    // 1. "findByScoreNotNull" adds "WHERE score IS NOT NULL"
    // 2. "Pageable" automatically adds "ORDER BY score DESC LIMIT 12 OFFSET X"
    @Query("SELECT a FROM Anime a WHERE a.score IS NOT NULL")
    List<Anime> findTopRanked(Pageable pageable);

    @Query(value = """
        SELECT * FROM details 
        WHERE (:title IS NULL OR LOWER(title) LIKE LOWER(CONCAT('%', :title, '%')))
        AND (:genre IS NULL OR LOWER(genres) LIKE LOWER(CONCAT('%', :genre, '%')))
        AND (:minScore IS NULL OR score >= :minScore)
        AND (:rating IS NULL OR rating = :rating)
        ORDER BY score DESC
    """,
    //This count query is needed by spring to know the total results so it knows how many pages are there
    countQuery = """
    SELECT count(*) FROM details
    WHERE (:title IS NULL OR LOWER(title) LIKE LOWER(CONCAT('%', :title, '%')))
    AND (:genre IS NULL OR LOWER(genres) LIKE LOWER(CONCAT('%', :genre, '%')))
    AND (:minScore IS NULL OR score >= :minScore)
    AND (:rating IS NULL OR rating = :rating)
""",
    nativeQuery = true)
    Page<Anime> searchAnimeComplex(
            @Param("title") String title,
            @Param("genre") String genre,
            @Param("minScore") Double minScore,
            @Param("rating") String rating,
            Pageable pageable
    );


    // Fetch multiple anime by a list of IDs
    // Native Query is fast for this
    @Query(value = "SELECT * FROM details WHERE mal_id IN :ids", nativeQuery = true)
    List<Anime> findBatchByIds(@Param("ids") List<Integer> ids);

}

